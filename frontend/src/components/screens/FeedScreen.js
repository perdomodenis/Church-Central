import React, { useState, useEffect } from 'react';
import { rtdb } from '../../services/firebase';
import { ref, onValue } from 'firebase/database';
import * as Icon from '../common/Icons';

// Fallback mock posts if no data in Firebase
const FALLBACK_POSTS = [
  {
    id: 1,
    author: 'Church Media',
    time: '2 hours ago',
    content: 'Join us this Sunday for our special service "Walking in Faith". We look forward to seeing the whole family!',
    scope: 'News',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    prayers: 12,
    comments: [
      { id: 1, author: 'Maria Lopez', text: 'Cannot wait! This is going to be amazing!' },
      { id: 2, author: 'John Smith', text: 'Will there be childcare available?' }
    ]
  },
  {
    id: 2,
    author: 'Youth Ministry',
    time: '5 hours ago',
    content: 'The regional youth retreat registrations are now open! Early bird discount ends this Friday.',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    prayers: 45,
    comments: [
      { id: 1, author: 'David Garcia', text: 'What is the cost for this year?' },
      { id: 2, author: 'Sarah Johnson', text: 'I already signed my kids up!' }
    ]
  },
  {
    id: 3,
    author: 'Admin Office',
    time: '1 day ago',
    content: 'New maintenance updates for the district office building are scheduled for next Monday.',
    scope: 'District',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    prayers: 3,
    comments: [
      { id: 1, author: 'Robert Wilson', text: 'Will the office be closed that day?' }
    ]
  },
  {
    id: 4,
    author: 'Music Ministry',
    time: '1 day ago',
    content: 'Exciting announcement! We are looking for new members for our choir and worship band. All skill levels welcome!',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    prayers: 28,
    comments: [
      { id: 1, author: 'Catherine Martinez', text: 'I would love to join the choir!' }
    ]
  },
  {
    id: 5,
    author: 'Community Outreach',
    time: '2 days ago',
    content: 'Thank you all who participated in last week\'s food drive! We collected 500 lbs of food for the local food bank.',
    scope: 'News',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    prayers: 67,
    comments: [
      { id: 1, author: 'Elena Rodriguez', text: 'Great work everyone!' },
      { id: 2, author: 'Michael Brown', text: 'When is the next community service event?' }
    ]
  },
  {
    id: 6,
    author: 'Bible Study Group',
    time: '2 days ago',
    content: 'Join us Wednesday evenings at 7 PM for our in-depth study of Psalms. Newcomers always welcome!',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80',
    prayers: 34,
    comments: [
      { id: 1, author: 'Thomas Anderson', text: 'What translation will we be using?' }
    ]
  },
  {
    id: 7,
    author: 'Leadership Team',
    time: '3 days ago',
    content: 'Nominations for church leadership positions are now open. If you feel called to serve, please submit your application by the end of the month.',
    scope: 'News',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    prayers: 19,
    comments: [
      { id: 1, author: 'Patricia Davis', text: 'How do I submit my nomination?' }
    ]
  },
  {
    id: 8,
    author: 'Children\'s Ministry',
    time: '3 days ago',
    content: 'Vacation Bible School dates are set for June 15-19. Sign up your kids for a week of fun, learning, and fellowship!',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1503454537688-e0ce8a41f600?auto=format&fit=crop&w=800&q=80',
    prayers: 56,
    comments: [
      { id: 1, author: 'Jessica White', text: 'Are volunteer spots available?' },
      { id: 2, author: 'Christopher Lee', text: 'My kids loved VBS last year!' }
    ]
  },
  {
    id: 9,
    author: 'Missions Committee',
    time: '4 days ago',
    content: 'Our mission trip to Honduras is confirmed! We will be building a school with a local community. Pray with us!',
    scope: 'News',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    prayers: 89,
    comments: [
      { id: 1, author: 'Amanda Harris', text: 'I want to join the mission trip! How can I sign up?' },
      { id: 2, author: 'Kenneth Taylor', text: 'Praise God for this opportunity!' }
    ]
  },
  {
    id: 10,
    author: 'Worship Team',
    time: '4 days ago',
    content: 'This Sunday\'s theme is "Gratitude and Grace". Come ready to worship and lift up your praises!',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    prayers: 42,
    comments: [
      { id: 1, author: 'Rachel Green', text: 'Looking forward to it!' }
    ]
  },
  {
    id: 11,
    author: 'Community Care',
    time: '5 days ago',
    content: 'We are organizing a meal train for the Johnson family. If you can help, please sign up on our board at the entrance.',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
    prayers: 71,
    comments: [
      { id: 1, author: 'Linda Martin', text: 'I can bring a meal next week!' }
    ]
  },
  {
    id: 12,
    author: 'Marriage & Family Ministry',
    time: '5 days ago',
    content: 'Couples retreat coming in July! Experience a weekend of renewal, fun activities, and quality time with your spouse.',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
    prayers: 38,
    comments: [
      { id: 1, author: 'Mark Williams', text: 'My wife and I are very interested!' }
    ]
  },
  {
    id: 13,
    author: 'Young Adults Group',
    time: '6 days ago',
    content: 'Game night this Friday at 7 PM! Bring your competitive spirit and a snack to share. All ages 18-35 welcome!',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    prayers: 15,
    comments: [
      { id: 1, author: 'Nicole Foster', text: 'Count me in!' }
    ]
  },
  {
    id: 14,
    author: 'Prayer Ministry',
    time: '6 days ago',
    content: 'Prayer meeting every Tuesday evening at 6 PM. Come share your prayer requests and intercede for our community.',
    scope: 'News',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80',
    prayers: 53,
    comments: [
      { id: 1, author: 'Gloria Santos', text: 'I will be there this week!' }
    ]
  },
  {
    id: 15,
    author: 'Pastoral Care',
    time: '1 week ago',
    content: 'Congratulations to all our graduates! We are so proud of your accomplishments. Your church family celebrates with you!',
    scope: 'News',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    prayers: 44,
    comments: [
      { id: 1, author: 'James Mitchell', text: 'Congratulations to all!' }
    ]
  },
  {
    id: 16,
    author: 'Children\'s Education',
    time: '1 week ago',
    content: 'Sunday school classes resume next month with new curriculum. Register your children online to save their spot!',
    scope: 'Department',
    image: 'https://images.unsplash.com/photo-1503454537688-e0ce8a41f600?auto=format&fit=crop&w=800&q=80',
    prayers: 26,
    comments: [
      { id: 1, author: 'Sophia Chen', text: 'What age groups will be available?' }
    ]
  },
  {
    id: 17,
    author: 'Benevolence Fund',
    time: '1 week ago',
    content: 'Our benevolence fund helps church members during times of financial hardship. If you need assistance, please reach out to our office confidentially.',
    scope: 'District',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    prayers: 31,
    comments: [
      { id: 1, author: 'Warren Bell', text: 'Thank you for this important ministry!' }
    ]
  },
  {
    id: 18,
    author: 'Church Anniversary',
    time: '1 week ago',
    content: 'Join us in celebrating 50 years of God\'s faithfulness! Special service and celebration day coming next month. More details coming soon!',
    scope: 'News',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    prayers: 127,
    comments: [
      { id: 1, author: 'Susan Price', text: 'What an amazing milestone!' },
      { id: 2, author: 'Edward Clark', text: 'Looking forward to the celebration!' }
    ]
  }
];

const FeedScreen = ({ scope, onAction }) => {
  const [posts, setPosts] = useState([]);
  const [postComments, setPostComments] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  // Load posts from Firebase
  useEffect(() => {
    const feedRef = ref(rtdb, 'feed');
    const unsubscribe = onValue(feedRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const postsArray = Object.values(data).sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setPosts(postsArray);
      } else {
        setPosts(FALLBACK_POSTS);
      }
    }, (error) => {
      console.error('Error loading feed:', error);
      setPosts(FALLBACK_POSTS);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = scope === 'All' || scope === 'Todos'
    ? posts
    : posts.filter(post => post.scope === scope);

  const handleAddComment = (postId) => {
    const text = commentText[postId] || '';
    if (!text.trim()) return;

    setPostComments(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || posts.find(p => p.id === postId)?.comments || []),
        {
          id: Date.now(),
          author: 'You',
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

  return (
    <div className="feed-screen" style={{ padding: '12px', paddingBottom: '100px' }}>
      {/* Church Info Section */}
      <div style={{
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        color: 'white',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
      }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', fontWeight: '800' }}>⛪ Grace Community Church</h2>
        <p style={{ margin: '0 0 16px 0', opacity: 0.9, fontSize: '0.95rem' }}>
          A vibrant community of believers dedicated to spiritual growth and serving our city.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Main Service</div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Sunday 10 AM</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Active Members</div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>1,250+</div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', color: '#111' }}>📅 Upcoming Events</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 1, emoji: '🕊️', title: 'Sunday Service', time: 'Tomorrow at 10:00 AM', location: 'Main Campus & Downtown Campus' },
            { id: 2, emoji: '🎒', title: 'Youth Summer Camp', time: 'June 21-25, 2025', location: 'Registration closing soon' },
            { id: 3, emoji: '📖', title: 'Bible Study', time: 'Every Wednesday at 7:00 PM', location: 'Psalms Deep Dive - All welcome' }
          ].map(event => (
            <div key={event.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderLeft: '4px solid ' + (event.id === 1 ? 'var(--accent)' : '#667eea')
            }}>
              <div style={{ fontWeight: '700', color: '#111', marginBottom: '4px' }}>{event.emoji} {event.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>{event.time}</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>{event.location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', color: '#111' }}>📰 News & Updates</h3>
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <div
            key={post.id}
            className="post-card"
            style={{...cardStyle, cursor: 'pointer'}}
            onClick={() => setSelectedPost(post)}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={avatarStyle}>
                {post.author[0]}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{post.author}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{post.time} • {post.scope}</div>
              </div>
            </div>

            <p style={{ lineHeight: '1.5', marginBottom: '12px', fontSize: '0.95rem' }}>
              {post.content}
            </p>

            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', objectFit: 'cover', maxHeight: '200px' }}
              />
            )}

            <div style={{ display: 'flex', borderTop: '1px solid #eee', paddingTop: '12px', gap: '16px' }}>
              <button onClick={() => onAction('pray')} style={actionButtonStyle}>
                <span style={{ marginRight: '4px' }}>🙏</span> {post.prayers}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedPost(expandedPost === post.id ? null : post.id);
                }}
                style={actionButtonStyle}
              >
                <span style={{ marginRight: '4px' }}>💬</span> {commentCount(post.id)}
              </button>
              <button onClick={() => onAction('share')} style={actionButtonStyle}>
                <span style={{ marginRight: '4px' }}>🔗</span> Share
              </button>
            </div>

            {expandedPost === post.id && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '12px' }}>
                  {getPostComments(post.id).map(comment => (
                    <div key={comment.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{comment.author}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{comment.text}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '20px',
                      border: '1px solid #ddd',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      backgroundColor: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          <p>No updates in this category yet.</p>
        </div>
      )}

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
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            overflowY: 'auto'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedPost(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#333',
                zIndex: 10
              }}
            >
              ×
            </button>

            {selectedPost.image && (
              <img
                src={selectedPost.image}
                alt="Post"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px'
                }}
              />
            )}

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{...avatarStyle, width: '50px', height: '50px', fontSize: '1.2rem'}}>
                  {selectedPost.author[0]}
                </div>
                <div style={{ marginLeft: '12px' }}>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{selectedPost.author}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{selectedPost.time}</div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>Category: {selectedPost.scope}</div>
                </div>
              </div>

              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#111',
                marginBottom: '24px',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedPost.content}
              </p>

              <div style={{
                display: 'flex',
                gap: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid #eee',
                marginBottom: '24px'
              }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                    {selectedPost.prayers}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Prayers</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                    {getPostComments(selectedPost.id).length}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Comments</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Comments</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {getPostComments(selectedPost.id).length > 0 ? (
                  getPostComments(selectedPost.id).map(comment => (
                    <div key={comment.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{comment.author}</div>
                      <div style={{ fontSize: '0.9rem', color: '#333', marginTop: '6px', lineHeight: '1.5' }}>{comment.text}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>No comments yet.</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[selectedPost.id] || ''}
                  onChange={(e) => setCommentText(prev => ({ ...prev, [selectedPost.id]: e.target.value }))}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={() => {
                    handleAddComment(selectedPost.id);
                    setCommentText(prev => ({ ...prev, [selectedPost.id]: '' }));
                  }}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '20px',
  backgroundColor: 'var(--accent)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: '12px'
};

const actionButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.9rem',
  color: '#666',
  display: 'flex',
  alignItems: 'center',
  fontWeight: '500'
};

export default FeedScreen;
