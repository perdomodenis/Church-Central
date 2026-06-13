import React, { useState, useEffect } from 'react';
import * as Icon from '../common/Icons';
import { listFeedPosts } from '../../lib/dataconnect';
import './FeedScreen.css';
import { useLanguage } from '../../context/LanguageContext';
import { rtdb } from '../../services/firebase';
import { ref, onValue, set as rtdbSet, push, remove } from 'firebase/database';
import { sendInboxNotification } from '../../services/notificationService';
import { getAccessLevel, DEPARTMENTS, COURTS } from '../../services/churchConstants';
import { getAllEvents, registerForEvent, cancelEventRegistration } from '../../services/eventService';

const getDepartments = (member) => {
  if (!member) return [];
  const deptVal = member.dept || member.department || 'General';
  if (Array.isArray(deptVal)) return deptVal;
  if (typeof deptVal === 'string') {
    return deptVal.split(',').map(s => s.trim()).filter(Boolean);
  }
  return ['General'];
};

const getCourts = (member) => {
  if (!member) return [];
  const courtVal = member.court || member.campus || 'Global';
  if (Array.isArray(courtVal)) return courtVal;
  if (typeof courtVal === 'string') {
    return courtVal.split(',').map(s => s.trim()).filter(Boolean);
  }
  return ['Global'];
};

const toCamelCase = (str) => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .split(/[\s-]+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

const isPdfUrl = (url) => {
  if (!url) return false;
  try {
    const urlWithoutQuery = url.split('?')[0];
    return urlWithoutQuery.toLowerCase().endsWith('.pdf');
  } catch (e) {
    return url.toLowerCase().includes('.pdf');
  }
};

const handleShareClick = (post, e, onAction) => {
  e.stopPropagation();
  if (navigator.share) {
    navigator.share({
      title: 'Church Central',
      text: post.content,
      url: window.location.origin + '?post=' + post.id
    }).catch((error) => console.log('Error sharing:', error));
  } else {
    navigator.clipboard.writeText(window.location.origin + '?post=' + post.id);
    if (onAction) onAction('share');
  }
};

const extractMentions = (text, members) => {
  if (!text || !members || members.length === 0) return [];
  
  // Sort members by full name length descending to match the longest name first
  const sortedMembers = [...members].map(m => ({
    member: m,
    fullName: `${(m.first || '').trim()} ${(m.last || '').trim()}`.trim()
  })).filter(m => m.fullName.length > 0)
    .sort((a, b) => b.fullName.length - a.fullName.length);

  const matches = [];
  let index = text.indexOf('@');
  
  while (index !== -1) {
    const remainingText = text.substring(index + 1);
    
    // Find the first member that matches the start of remainingText
    const matched = sortedMembers.find(m => {
      const name = m.fullName.toLowerCase();
      if (remainingText.toLowerCase().startsWith(name)) {
        const nextCharIndex = name.length;
        if (nextCharIndex >= remainingText.length) return true;
        const nextChar = remainingText[nextCharIndex];
        return /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]/.test(nextChar);
      }
      return false;
    });

    if (matched) {
      matches.push({
        startIndex: index,
        endIndex: index + 1 + matched.fullName.length,
        member: matched.member,
        fullName: matched.fullName
      });
      index = text.indexOf('@', index + 1 + matched.fullName.length);
    } else {
      // Try matching by first name only if it is unique
      const firstNamesOnly = [...members].map(m => ({
        member: m,
        firstName: (m.first || '').trim()
      })).filter(m => m.firstName.length > 0)
        .sort((a, b) => b.firstName.length - a.firstName.length);
        
      const matchedFirst = firstNamesOnly.find(m => {
        const name = m.firstName.toLowerCase();
        if (remainingText.toLowerCase().startsWith(name)) {
          const nextCharIndex = name.length;
          if (nextCharIndex >= remainingText.length) return true;
          const nextChar = remainingText[nextCharIndex];
          return /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]/.test(nextChar);
        }
        return false;
      });
      
      if (matchedFirst) {
        const count = members.filter(m => (m.first || '').trim().toLowerCase() === matchedFirst.firstName.toLowerCase()).length;
        if (count === 1) {
          matches.push({
            startIndex: index,
            endIndex: index + 1 + matchedFirst.firstName.length,
            member: matchedFirst.member,
            fullName: matchedFirst.firstName
          });
          index = text.indexOf('@', index + 1 + matchedFirst.firstName.length);
          continue;
        }
      }
      index = text.indexOf('@', index + 1);
    }
  }
  return matches;
};

const renderCommentText = (text, members, onSelectMember, level) => {
  if (!text || !members || members.length === 0) return text;

  const matches = extractMentions(text, members);
  if (matches.length === 0) return text;

  const parts = [];
  let lastIndex = 0;

  for (const match of matches) {
    if (match.startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, match.startIndex));
    }

    parts.push(
      <span
        key={`mention-${match.startIndex}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMember && onSelectMember(match.member);
        }}
        style={{
          color: 'var(--accent)',
          fontWeight: '700',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        @{match.fullName}
      </span>
    );

    lastIndex = match.endIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const FeedScreen = ({ scope, onScope, onAction, user, refreshKey, onSelectMember }) => {
  const { t } = useLanguage();
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [posts, setPosts] = useState([]);

  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');

  // High fidelity UI states
  const [dbLikes, setDbLikes] = useState({});
  const [dbComments, setDbComments] = useState({});
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [heartbeatActive, setHeartbeatActive] = useState({});
  const [viewingPdfInline, setViewingPdfInline] = useState({});
  const [members, setMembers] = useState([]);
  const [mentioningPostId, setMentioningPostId] = useState(null);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);

  // Load members for mentions
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const { getAllMembers } = await import('../../services/memberService');
        const list = await getAllMembers();
        setMembers(list);
      } catch (err) {
        console.error('Error loading members:', err);
      }
    };
    loadMembers();
  }, []);
  
  // Real events state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  const [eventDeclines, setEventDeclines] = useState(() => {
    const saved = localStorage.getItem('eventDeclines:v1');
    return saved ? JSON.parse(saved) : {};
  });

  const [optimisticGoing, setOptimisticGoing] = useState({});
  const [submittingRSVP, setSubmittingRSVP] = useState({});

  useEffect(() => {
    localStorage.setItem('eventDeclines:v1', JSON.stringify(eventDeclines));
  }, [eventDeclines]);

  // Sync RTDB likes and comments in real-time
  useEffect(() => {
    const likesRef = ref(rtdb, 'feed_likes');
    const unsubscribeLikes = onValue(likesRef, (snapshot) => {
      setDbLikes(snapshot.val() || {});
    });

    const commentsRef = ref(rtdb, 'feed_comments');
    const unsubscribeComments = onValue(commentsRef, (snapshot) => {
      setDbComments(snapshot.val() || {});
    });

    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, []);

  // Load real events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const list = await getAllEvents();
        setEvents(list);
      } catch (err) {
        console.error('Error loading events in feed:', err);
      }
      setLoadingEvents(false);
    };
    loadEvents();
  }, [refreshKey]);

  // Load posts from SQL Connect
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await listFeedPosts({ fetchPolicy: 'SERVER_ONLY' });
        const announcements = response.data?.announcements || [];
        const mapped = announcements.map(post => {
          let authorDept = post.author?.dept || post.author?.department || '';
          if (!authorDept && post.author?.uid?.startsWith('dept_')) {
            authorDept = post.author?.first || '';
          }
          let authorCourt = post.author?.court || '';
          if (!authorCourt && post.author?.uid?.startsWith('court_')) {
            authorCourt = post.author?.first || '';
          }
          let authorDistrict = post.author?.district || '';

          return {
            id: post.id,
            author: post.author ? `${post.author.first} ${post.author.last}` : 'Anonymous',
            authorId: post.author?.uid || 'unknown',
            authorDistrict: authorDistrict,
            authorCourt: authorCourt,
            authorDepartment: authorDept,
            time: new Date(post.createdAt).toLocaleDateString('de-CH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            timestamp: post.createdAt,
            content: post.content,
            scope: post.scope,
            category: post.category,
            image: post.imageUrl || null,
            likes: post.likes || 0,
            comments: []
          };
        });
        setPosts(mapped);
      } catch (error) {
        console.error('Error loading feed:', error);
        setPosts([]);
      }
    };
    loadPosts();
  }, [refreshKey]);

  const handleLikeClick = (postId, e) => {
    e.stopPropagation();
    if (!user) return;

    // Trigger heartbeat animation on button
    setHeartbeatActive(prev => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setHeartbeatActive(prev => ({ ...prev, [postId]: false }));
    }, 350);

    const userLikeRef = ref(rtdb, `feed_likes/${postId}/${user.uid}`);
    const isCurrentlyLiked = !!dbLikes[postId]?.[user.uid];

    if (isCurrentlyLiked) {
      remove(userLikeRef);
    } else {
      rtdbSet(userLikeRef, true);
      
      // Spawn floating like emoji at mouse click position (or button center if keyboard)
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX || (rect.left + rect.width / 2);
      const clickY = e.clientY || rect.top;

      const newEmoji = {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY - 15
      };

      setFloatingEmojis(prev => [...prev, newEmoji]);
      
      // Clean up emoji after animation completes (800ms)
      setTimeout(() => {
        setFloatingEmojis(prev => prev.filter(item => item.id !== newEmoji.id));
      }, 800);

      // Trigger standard action notification
      if (onAction) onAction('pray');
    }
  };

  const handleRSVP = async (event, status) => {
    if (!user?.uid || submittingRSVP[event.id]) return;
    
    // Set lock immediately
    setSubmittingRSVP(prev => ({ ...prev, [event.id]: true }));
    const isAttending = event.attendeeUids?.includes(user.uid);
    
    // Apply optimistic updates immediately
    if (status === 'going') {
      setOptimisticGoing(prev => ({ ...prev, [event.id]: true }));
      setEventDeclines(prev => {
        const updated = { ...prev };
        delete updated[event.id];
        return updated;
      });
    } else if (status === 'declined') {
      setOptimisticGoing(prev => ({ ...prev, [event.id]: false }));
      setEventDeclines(prev => ({ ...prev, [event.id]: true }));
    }

    try {
      if (status === 'going') {
        if (!isAttending) {
          await registerForEvent(event.id, user.uid);
        }
      } else if (status === 'declined') {
        if (isAttending) {
          await cancelEventRegistration(event.id, user.uid);
        }
      }
      // Refresh local events list
      const list = await getAllEvents();
      setEvents(list);
    } catch (error) {
      console.error('Error updating RSVP in feed:', error);
    } finally {
      // Clear optimistic state
      setOptimisticGoing(prev => {
        const updated = { ...prev };
        delete updated[event.id];
        return updated;
      });
      // Release lock
      setSubmittingRSVP(prev => {
        const updated = { ...prev };
        delete updated[event.id];
        return updated;
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    // 1. Check Role-Based Access Control (RBAC)
    const isAuthor = post.authorId === user?.uid;
    const isReverend = user?.position === 'Reverend';
    const isAdmin = user?.position === 'Admin';
    const isLeader = user?.position === 'Leader';

    if (post.scope === 'Leaders' && !isLeader && !isAdmin && !isReverend && !isAuthor) return false;
    if (post.scope === 'Reverends' && !isReverend && !isAdmin && !isAuthor) return false;
    if (post.scope === 'Admins' && !isAdmin && !isAuthor) return false;
    if (post.scope === 'Class' && !user?.schoolClass && !isAdmin && !isReverend && !isAuthor) return false;

    const isAdminOrRev = user?.position === 'Admin' || user?.position === 'Reverend' || user?.position === 'Bishop';
    const userDepts = getDepartments(user);
    const userCourts = getCourts(user);

    // Lock District channel posts to matching personal district
    if (post.scope === 'District') {
      if (post.authorDistrict && user?.district && post.authorDistrict !== user.district) {
        return false;
      }
    }

    // Lock Department channel posts
    if (post.scope === 'Department') {
      if (post.authorDepartment && selectedDept && post.authorDepartment !== selectedDept) {
        return false;
      }
      if (!isAdminOrRev && post.authorDepartment && !userDepts.includes(post.authorDepartment)) {
        return false;
      }
    }

    // Lock Court channel posts
    if (post.scope === 'Court') {
      if (post.authorCourt && selectedCourt && post.authorCourt !== selectedCourt) {
        return false;
      }
      if (!isAdminOrRev && post.authorCourt && !userCourts.includes(post.authorCourt)) {
        return false;
      }
    }

    // 2. Apply active UI tab filter
    if (!scope || scope === 'All' || scope === 'Todos') return true;
    if (scope === 'News') return !post.scope || post.scope === 'News';
    return post.scope === scope;
  });

  const isAdminOrRev = user?.position === 'Admin' || user?.position === 'Reverend' || user?.position === 'Bishop';
  const availableDepts = isAdminOrRev ? DEPARTMENTS : getDepartments(user);
  const availableCourts = isAdminOrRev ? COURTS : getCourts(user);

  useEffect(() => {
    if (scope === 'Department' && !selectedDept && availableDepts.length > 0) {
      setSelectedDept(availableDepts[0]);
    }
  }, [scope, selectedDept, availableDepts]);

  useEffect(() => {
    if (scope === 'Court' && !selectedCourt && availableCourts.length > 0) {
      setSelectedCourt(availableCourts[0]);
    }
  }, [scope, selectedCourt, availableCourts]);

  const handleAddComment = async (postId) => {
    const text = commentText[postId] || '';
    if (!text.trim() || !user) return;

    const commentsListRef = ref(rtdb, `feed_comments/${postId}`);
    const newCommentRef = push(commentsListRef);
    
    const newComment = {
      author: `${user.first} ${user.last}`.trim(),
      authorId: user.uid,
      text: text,
      timestamp: Date.now()
    };

    await rtdbSet(newCommentRef, newComment);

    // Check for @-mentions to notify in inbox using the new helper
    const notifiedUsers = new Set();
    const matches = extractMentions(text, members);
    for (const match of matches) {
      if (match.member.uid !== user.uid) {
        notifiedUsers.add(match.member.uid);
      }
    }

    for (const targetUid of notifiedUsers) {
      await sendInboxNotification(targetUid, {
        sender: `${user.first} ${user.last}`.trim(),
        senderId: user.uid,
        subject: 'You were mentioned in a comment',
        preview: `${user.first} mentioned you: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`,
        body: `Hi! ${user.first} ${user.last} mentioned you in a comment on a feed post:\n\n"${text}"\n\nGo check it out in the home feed!`
      });
    }

    setCommentText(prev => ({
      ...prev,
      [postId]: ''
    }));

    setMentioningPostId(null);
  };

  const handleCommentChange = (postId, value) => {
    setCommentText(prev => ({ ...prev, [postId]: value }));

    const inputEl = document.getElementById(`comment-input-${postId}`);
    if (!inputEl) return;

    const selectionStart = inputEl.selectionStart || value.length;
    const textBeforeCursor = value.substring(0, selectionStart);
    const lastAtIdx = textBeforeCursor.lastIndexOf('@');

    if (lastAtIdx !== -1) {
      const charBeforeAt = lastAtIdx > 0 ? textBeforeCursor[lastAtIdx - 1] : ' ';
      const textAfterAt = textBeforeCursor.substring(lastAtIdx + 1);
      
      if ((charBeforeAt === ' ' || charBeforeAt === '\n') && !textAfterAt.includes(' ')) {
        setMentioningPostId(postId);
        setMentionSearch(textAfterAt);
        setMentionStartIndex(lastAtIdx);
        return;
      }
    }
    setMentioningPostId(null);
  };

  const handleSelectMention = (postId, member) => {
    const currentText = commentText[postId] || '';
    const textBefore = currentText.substring(0, mentionStartIndex);
    const textAfter = currentText.substring(mentionStartIndex + mentionSearch.length + 1);
    const newText = textBefore + `@${member.first} ${member.last} ` + textAfter;

    setCommentText(prev => ({ ...prev, [postId]: newText }));
    setMentioningPostId(null);

    setTimeout(() => {
      const inputEl = document.getElementById(`comment-input-${postId}`);
      if (inputEl) {
        inputEl.focus();
        const cursorPosition = textBefore.length + member.first.length + member.last.length + 2;
        inputEl.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const handleReplyToComment = (postId, authorName) => {
    setCommentText(prev => {
      const current = prev[postId] || '';
      const prefix = `@${authorName} `;
      return {
        ...prev,
        [postId]: prefix + current.replace(new RegExp(`^@${authorName}\\s*`), '')
      };
    });

    setTimeout(() => {
      const inputEl = document.getElementById(`comment-input-${postId}`);
      if (inputEl) {
        inputEl.focus();
      }
    }, 0);
  };



  const getPostComments = (postId) => {
    const list = dbComments[postId] || {};
    return Object.entries(list).map(([id, val]) => ({
      id,
      ...val
    })).sort((a, b) => a.timestamp - b.timestamp);
  };

  const commentCount = (postId) => getPostComments(postId).length;

  const activeMembersCount = members.filter(m => getAccessLevel(m.position || '') >= 2).length;

  const level = user?.accessLevel || 1;
  let scopeOptions = ['News', 'District', 'Court'];
  if (level >= 2) {
    scopeOptions = ['News', 'Department', 'District', 'Court'];
  }
  if (user?.schoolClass) {
    scopeOptions.push('Class');
  }
  if (level >= 3) {
    scopeOptions.push('Leaders');
  }
  if (level >= 4) {
    scopeOptions.push('All');
  }

  const matchingMembers = members.filter(m => {
    const fullName = `${m.first} ${m.last}`.toLowerCase();
    return fullName.includes(mentionSearch.toLowerCase()) || m.email.toLowerCase().includes(mentionSearch.toLowerCase());
  }).slice(0, 5);

  return (
    <div className="feed-screen-container">
      
      {/* 1. Left Sidebar: Grace Community Church Info (Desktop Only) */}
      <aside className="left-sidebar grace-left-widget desktop-only">
        <h2>⛪ {t('graceCommunityChurch')}</h2>
        <p>{t('churchSubtitle')}</p>
        <div>
          <div className="grace-info-box">
            <div className="label">{t('mainService')}</div>
            <div className="value">{t('sunday10am')}</div>
          </div>
          <div className="grace-info-box">
            <div className="label">{t('activeMembers')}</div>
            <div className="value">{activeMembersCount > 0 ? activeMembersCount : '...'}</div>
          </div>
        </div>
      </aside>

      {/* 2. Main Feed Section */}
      <main className="main-feed-content">
        
        {/* Sliding Scope Selector (Desktop Only) */}
        {onScope && (
          <div className="scope-tabs-container desktop-only">
            {scopeOptions.map(opt => (
              <button
                key={opt}
                onClick={() => onScope(opt)}
                className={`scope-tab-button ${scope === opt ? 'active' : ''}`}
              >
                {t(opt.toLowerCase())}
              </button>
            ))}
          </div>
        )}

        {/* Channel Headers / Filters */}
        {scope === 'District' && user?.district && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--line-2)', fontWeight: '600', color: 'var(--ink)' }}>
            📍 Showing feeds for {user.district}
          </div>
        )}

        {scope === 'Department' && availableDepts.length > 0 && (
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: '600', color: 'var(--ink)' }}>📁 Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                backgroundColor: 'var(--surface)',
                color: 'var(--ink)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                outlineColor: 'var(--accent)'
              }}
            >
              {availableDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        {scope === 'Court' && availableCourts.length > 0 && (
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: '600', color: 'var(--ink)' }}>⛪ Court:</span>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                backgroundColor: 'var(--surface)',
                color: 'var(--ink)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                outlineColor: 'var(--accent)'
              }}
            >
              {availableCourts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}



        {/* Floating elements for like triggers */}
        {floatingEmojis.map(emoji => (
          <div
            key={emoji.id}
            className="prayer-emoji-rising"
            style={{ left: emoji.x, top: emoji.y }}
          >
            ❤️
          </div>
        ))}

        {/* Announcements List */}
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => {
            const hasLiked = !!dbLikes[post.id]?.[user?.uid];
            const totalLikes = (post.likes || 0) + Object.keys(dbLikes[post.id] || {}).length;
            const isPdf = isPdfUrl(post.image);
            const showPdfInline = viewingPdfInline[post.id];

            return (
              <div
                key={post.id}
                className="feed-post-card"
              >
                <div className="post-author-row">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="widget-avatar av-grad" style={{ width: '40px', height: '40px', fontSize: '1rem', marginRight: '12px' }}>
                      {post.author[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{post.author}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '2px' }}>{post.time}</div>
                    </div>
                  </div>
                  <span className="post-scope-tag">{t(post.scope.toLowerCase())}</span>
                </div>

                <p style={{ lineHeight: '1.6', marginBottom: '16px', fontSize: '0.95rem', color: 'var(--ink)' }}>
                  {post.content}
                </p>

                {post.image && (
                  isPdf ? (
                    <div style={{ marginBottom: '16px' }}>
                      <div className="pdf-attachment-card">
                        <div className="pdf-info-left">
                          <div className="pdf-icon-frame">📄</div>
                          <div>
                            <div className="pdf-meta-name">{t('weeklyAnnouncement')}</div>
                            <div className="pdf-meta-size">{t('pdfAttachment')}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setViewingPdfInline(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                            className="pdf-download-btn"
                          >
                            👁️ {showPdfInline ? t('hide') : t('view')}
                          </button>
                          <a
                            href={`${backendUrl}/api/download?url=${encodeURIComponent(post.image)}`}
                            download
                            className="pdf-download-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            📥 {t('download')}
                          </a>
                        </div>
                      </div>

                      {showPdfInline && (
                        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line-2)', marginTop: '8px' }}>
                          <iframe
                            src={post.image}
                            title={`PDF ${post.id}`}
                            style={{ width: '100%', height: '400px', border: 'none' }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', border: '1px solid var(--line-2)' }}>
                      <img
                        src={post.image}
                        alt="Post content"
                        style={{ width: '100%', objectFit: 'cover', maxHeight: '320px', display: 'block', cursor: 'zoom-in' }}
                        onClick={() => setSelectedPost(post)}
                      />
                    </div>
                  )
                )}

                <div className="post-actions-row">
                  <button
                    onClick={(e) => handleLikeClick(post.id, e)}
                    className={`post-action-button ${hasLiked ? 'liked' : ''} ${heartbeatActive[post.id] ? 'heartbeat-active' : ''}`}
                  >
                    <span>{hasLiked ? '❤️' : '🤍'}</span>
                    <span>{totalLikes} {totalLikes === 1 ? t('like') : t('likes')}</span>
                  </button>
                  
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="post-action-button"
                  >
                    <span>💬</span>
                    <span>{commentCount(post.id)} {commentCount(post.id) === 1 ? t('comment') : t('comments')}</span>
                  </button>
                  
                  <button onClick={(e) => handleShareClick(post, e)} className="post-action-button">
                    <span>🔗</span>
                    <span>{t('share')}</span>
                  </button>
                </div>

                {expandedPost === post.id && (
                  <div className="comments-container">
                    <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '12px' }}>
                      {getPostComments(post.id).map(comment => (
                        <div key={comment.id} className="comment-bubble">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div className="comment-author">{comment.author}</div>
                            <button
                              onClick={() => handleReplyToComment(post.id, comment.author)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--accent)',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s'
                              }}
                              className="reply-btn-hover"
                            >
                              {t('reply')}
                            </button>
                          </div>
                          <div className="comment-body">{renderCommentText(comment.text, members, onSelectMember, user?.accessLevel || 1)}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
                      {mentioningPostId === post.id && matchingMembers.length > 0 && (
                        <div className="mention-dropdown">
                          {matchingMembers.map(member => (
                            <div
                              key={member.uid}
                              className="mention-dropdown-item"
                              onClick={() => handleSelectMention(post.id, member)}
                            >
                              <div className="mention-avatar">
                                {member.first[0]}{member.last[0]}
                              </div>
                              <div className="mention-name">
                                {member.first} {member.last}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <input
                        id={`comment-input-${post.id}`}
                        type="text"
                        placeholder={t('addCommentPlaceholder')}
                        value={commentText[post.id] || ''}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '1px solid var(--line)',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit',
                          backgroundColor: 'var(--surface)',
                          color: 'var(--ink)'
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="btn btn-primary"
                        style={{ padding: '10px 16px', borderRadius: '12px', fontSize: '0.85rem' }}
                      >
                        {t('send')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="grace-empty-state">
            <div className="icon">🔔</div>
            <p>{t('noUpdates')}</p>
          </div>
        )}
      </main>

      {/* 3. Right Sidebar: Events & RSVP Widget */}
      <aside className="right-sidebar">
        <div className="grace-right-widget">
          <h3>📅 {t('upcomingEventsTitle')}</h3>
          <p className="subtitle">{t('connectFellowship')}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loadingEvents ? (
              <p style={{ color: 'var(--ink-3)', fontSize: '0.8rem' }}>{t('loadingEvents')}</p>
            ) : events.length === 0 ? (
              <div className="grace-empty-state">
                <div className="icon">📅</div>
                <p>No upcoming events yet.</p>
              </div>
            ) : (
              events.slice(0, 4).map(event => {
                const isAttending = optimisticGoing[event.id] !== undefined
                  ? optimisticGoing[event.id]
                  : event.attendeeUids?.includes(user?.uid);
                const isDeclined = eventDeclines[event.id];
                const eventDate = new Date(event.startTime);
                const day = isNaN(eventDate.getTime()) ? '??' : eventDate.getDate().toString().padStart(2, '0');
                const month = isNaN(eventDate.getTime()) ? '???' : eventDate.toLocaleDateString('en-US', { month: 'short' });
                const formattedTime = event.startTime.split('T')[1] || '';

                return (
                  <div key={event.id} className="event-item" style={{ alignItems: 'flex-start' }}>
                    <div className="event-date-badge">
                      {day}
                      <span>{month}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink)' }}>{event.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '2px' }}>
                        {formattedTime} • {event.location}
                      </div>
                      <div className="rsvp-button-group">
                        <button
                          onClick={() => handleRSVP(event, 'going')}
                          disabled={!user || submittingRSVP[event.id]}
                          className={`rsvp-btn ${isAttending ? 'selected' : ''}`}
                          style={{
                            opacity: submittingRSVP[event.id] ? 0.7 : 1,
                            cursor: (user && !submittingRSVP[event.id]) ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {isAttending ? `✓ ${t('going')}` : t('going')}
                        </button>
                        <button
                          onClick={() => handleRSVP(event, 'declined')}
                          disabled={!user || submittingRSVP[event.id]}
                          className={`rsvp-btn ${isDeclined ? 'selected' : ''}`}
                          style={{
                            opacity: submittingRSVP[event.id] ? 0.7 : 1,
                            cursor: (user && !submittingRSVP[event.id]) ? 'pointer' : 'not-allowed',
                            ...(isDeclined ? { backgroundColor: '#c62828', borderColor: '#c62828' } : {})
                          }}
                        >
                          {t('notGoing')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <button
              onClick={() => onAction && onAction('compose')}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {t('composeAnnouncement')}
            </button>
          </div>
        </div>
      </aside>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(20,16,40,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              border: '1px solid var(--line-2)',
              boxShadow: 'var(--shadow-2)'
            }}
          >
            <button
              onClick={() => setSelectedPost(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'var(--ink)',
                zIndex: 10
              }}
            >
              ×
            </button>

            {selectedPost.image && (
              <img
                src={selectedPost.image}
                alt="Post Detail"
                style={{
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px'
                }}
              />
            )}

            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div className="widget-avatar av-grad" style={{ width: '48px', height: '48px', fontSize: '1.1rem', marginRight: '12px' }}>
                  {selectedPost.author[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--ink)' }}>{selectedPost.author}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-3)', marginTop: '2px' }}>{selectedPost.time}</div>
                </div>
              </div>

              <p className="serif" style={{
                fontSize: '1.25rem',
                lineHeight: '1.6',
                color: 'var(--ink)',
                marginBottom: '24px',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedPost.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedScreen;
