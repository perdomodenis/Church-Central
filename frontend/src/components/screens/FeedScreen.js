import React, { useState, useEffect } from 'react';
import * as Icon from '../common/Icons';
import { listFeedPosts } from '../../lib/dataconnect';
import './FeedScreen.css';

const isPdfUrl = (url) => {
  if (!url) return false;
  try {
    const urlWithoutQuery = url.split('?')[0];
    return urlWithoutQuery.toLowerCase().endsWith('.pdf');
  } catch (e) {
    return url.toLowerCase().includes('.pdf');
  }
};

const FeedScreen = ({ scope, onScope, onAction, user }) => {
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [posts, setPosts] = useState([]);
  const [postComments, setPostComments] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  // High fidelity UI states
  const [prayedPosts, setPrayedPosts] = useState(() => {
    const saved = localStorage.getItem('prayedPosts');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [heartbeatActive, setHeartbeatActive] = useState({});
  const [viewingPdfInline, setViewingPdfInline] = useState({});
  
  // RSVP state for events
  const [eventRSVPs, setEventRSVPs] = useState(() => {
    const saved = localStorage.getItem('eventRSVPs');
    return saved ? JSON.parse(saved) : {};
  });

  // Mock events for the right sidebar
  const upcomingEvents = [
    { id: 'ev1', title: 'Sunday Worship Service', date: '07', month: 'Jun', time: '10:00 AM', loc: 'Main Sanctuary' },
    { id: 'ev2', title: 'Midweek Bible Study', date: '10', month: 'Jun', time: '07:30 PM', loc: 'Fellowship Hall' },
    { id: 'ev3', title: 'Youth Group Night', date: '12', month: 'Jun', time: '06:30 PM', loc: 'Youth Room' },
    { id: 'ev4', title: 'Community Soup Kitchen', date: '13', month: 'Jun', time: '09:00 AM', loc: 'Dining Area' }
  ];

  // Sync prayed posts to localStorage
  useEffect(() => {
    localStorage.setItem('prayedPosts', JSON.stringify(Array.from(prayedPosts)));
  }, [prayedPosts]);

  // Sync RSVPs to localStorage
  useEffect(() => {
    localStorage.setItem('eventRSVPs', JSON.stringify(eventRSVPs));
  }, [eventRSVPs]);

  // Load posts from SQL Connect
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await listFeedPosts();
        const announcements = response.data?.announcements || [];
        const mapped = announcements.map(post => ({
          id: post.id,
          author: post.author ? `${post.author.first} ${post.author.last}` : 'Anonymous',
          authorId: post.author?.uid || 'unknown',
          time: new Date(post.createdAt).toLocaleDateString('de-CH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          timestamp: post.createdAt,
          content: post.content,
          scope: post.scope,
          category: post.category,
          image: post.imageUrl || null,
          prayers: post.likes || 0,
          comments: []
        }));
        setPosts(mapped);
      } catch (error) {
        console.error('Error loading feed:', error);
        setPosts([]);
      }
    };
    loadPosts();
  }, []);

  const handlePrayClick = (postId, e) => {
    e.stopPropagation();

    // Trigger heartbeat animation on button
    setHeartbeatActive(prev => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setHeartbeatActive(prev => ({ ...prev, [postId]: false }));
    }, 350);

    const updated = new Set(prayedPosts);
    const wasPrayed = updated.has(postId);

    if (wasPrayed) {
      updated.delete(postId);
    } else {
      updated.add(postId);
      
      // Spawn floating prayer emoji at mouse click position (or button center if keyboard)
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

    setPrayedPosts(updated);
  };

  const handleRSVP = (eventId, status) => {
    setEventRSVPs(prev => ({
      ...prev,
      [eventId]: prev[eventId] === status ? null : status
    }));
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

    // 2. Apply active UI tab filter
    if (!scope || scope === 'All' || scope === 'Todos' || scope === 'News') return true;
    return post.scope === scope;
  });

  const handleAddComment = (postId) => {
    const text = commentText[postId] || '';
    if (!text.trim()) return;

    setPostComments(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || posts.find(p => p.id === postId)?.comments || []),
        {
          id: Date.now(),
          author: user ? `${user.first} ${user.last}` : 'You',
          text: text
        }
      ]
    }));

    setCommentText(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  const getPostComments = (postId) => {
    return postComments[postId] || posts.find(p => p.id === postId)?.comments || [];
  };

  const commentCount = (postId) => getPostComments(postId).length;

  const level = user?.accessLevel || 1;
  const scopeOptions = ['All', 'News', 'District', 'Court'];
  if (level >= 2) scopeOptions.splice(2, 0, 'Department');
  if (level >= 3) scopeOptions.push('Leaders', 'Admins');
  if (level >= 4) scopeOptions.push('Reverends');

  return (
    <div className="feed-screen-container">
      
      {/* 1. Left Sidebar: Profile & Devotional (Desktop Only) */}
      <aside className="sidebar-widget left-sidebar desktop-only">
        <div className="widget-profile-header">
          <div className="widget-avatar av-grad">
            {user?.first ? user.first[0] : '👤'}
          </div>
          <div>
            <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>
              {user?.first ? `${user.first} ${user.last}` : 'Welcome Guest'}
            </h4>
            <span className="post-scope-tag" style={{ marginTop: '4px', display: 'inline-block', fontSize: '0.65rem' }}>
              {user?.position || 'Member'}
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="profile-meta-item">
            <span>📍</span> <span>{user?.court || 'Main Campus'}</span>
          </div>
          <div className="profile-meta-item">
            <span>👥</span> <span>{user?.dept || 'General Dept'}</span>
          </div>
        </div>

        <div style={{ marginTop: '12px', padding: '14px', borderRadius: '14px', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--line-2)' }}>
          <h5 style={{ fontWeight: '800', color: 'var(--accent)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            Daily Devotional
          </h5>
          <p className="serif" style={{ fontSize: '1.05rem', fontStyle: 'italic', lineHeight: '1.4', color: 'var(--ink)' }}>
            "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."
          </p>
          <span style={{ display: 'block', textAlign: 'right', fontSize: '0.75rem', marginTop: '6px', fontWeight: '600', color: 'var(--ink-2)' }}>
            Jeremiah 29:11
          </span>
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
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Church Info Section */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, #7c5dfa 100%)',
          borderRadius: '24px',
          padding: '28px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(91, 63, 187, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="serif" style={{ margin: '0 0 8px 0', fontSize: '2.2rem', fontWeight: '400' }}>
              ⛪ Grace Community Church
            </h2>
            <p style={{ margin: '0 0 20px 0', opacity: 0.9, fontSize: '0.95rem', maxWidth: '480px', lineHeight: '1.5' }}>
              A vibrant community of believers dedicated to spiritual growth and serving our city.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '360px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Main Service</div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', marginTop: '2px' }}>Sunday 10 AM</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Members</div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', marginTop: '2px' }}>1,250+</div>
              </div>
            </div>
          </div>
          {/* Subtle background glow graphics */}
          <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'var(--gold)', opacity: 0.15, filter: 'blur(40px)', zIndex: 1 }}></div>
        </div>

        {/* Floating elements for prayer triggers */}
        {floatingEmojis.map(emoji => (
          <div
            key={emoji.id}
            className="prayer-emoji-rising"
            style={{ left: emoji.x, top: emoji.y }}
          >
            🙏
          </div>
        ))}

        {/* Announcements List */}
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => {
            const hasPrayed = prayedPosts.has(post.id);
            const totalPrayers = post.prayers + (hasPrayed ? 1 : 0);
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
                  <span className="post-scope-tag">{post.scope}</span>
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
                            <div className="pdf-meta-name">Weekly Announcement Document</div>
                            <div className="pdf-meta-size">PDF File Attachment</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setViewingPdfInline(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                            className="pdf-download-btn"
                          >
                            👁️ {showPdfInline ? 'Hide' : 'View'}
                          </button>
                          <a
                            href={`${backendUrl}/api/download?url=${encodeURIComponent(post.image)}`}
                            download
                            className="pdf-download-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            📥 Download
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
                    onClick={(e) => handlePrayClick(post.id, e)}
                    className={`post-action-button ${hasPrayed ? 'prayed' : ''} ${heartbeatActive[post.id] ? 'heartbeat-active' : ''}`}
                  >
                    <span>{hasPrayed ? '🙏' : '🙌'}</span>
                    <span>{totalPrayers} Prayers</span>
                  </button>
                  
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="post-action-button"
                  >
                    <span>💬</span>
                    <span>{commentCount(post.id)} Comments</span>
                  </button>
                  
                  <button onClick={() => onAction('share')} className="post-action-button">
                    <span>🔗</span>
                    <span>Share</span>
                  </button>
                </div>

                {expandedPost === post.id && (
                  <div className="comments-container">
                    <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '12px' }}>
                      {getPostComments(post.id).map(comment => (
                        <div key={comment.id} className="comment-bubble">
                          <div className="comment-author">{comment.author}</div>
                          <div className="comment-body">{comment.text}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Add a comment to the family..."
                        value={commentText[post.id] || ''}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
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
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 40px', backgroundColor: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--line-2)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🔔</span>
            <p style={{ color: 'var(--ink-3)', fontWeight: '600' }}>No updates in this channel yet.</p>
          </div>
        )}
      </main>

      {/* 3. Right Sidebar: Events & RSVP Widget */}
      <aside className="sidebar-widget right-sidebar">
        <div>
          <h3 className="serif" style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '4px' }}>
            📅 Upcoming Events
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', marginBottom: '12px' }}>
            Connect and fellowship with the community
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingEvents.map(event => {
              const rsvp = eventRSVPs[event.id];
              return (
                <div key={event.id} className="event-item">
                  <div className="event-date-badge">
                    {event.date}
                    <span>{event.month}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink)' }}>{event.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '2px' }}>
                      {event.time} • {event.loc}
                    </div>
                    <div className="rsvp-button-group">
                      <button
                        onClick={() => handleRSVP(event.id, 'going')}
                        className={`rsvp-btn ${rsvp === 'going' ? 'selected' : ''}`}
                      >
                        Going
                      </button>
                      <button
                        onClick={() => handleRSVP(event.id, 'maybe')}
                        className={`rsvp-btn ${rsvp === 'maybe' ? 'selected' : ''}`}
                      >
                        Maybe
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: '16px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => onAction && onAction('compose')}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            ➕ Compose Announcement
          </button>
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
