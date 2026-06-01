import React, { useState, useEffect } from 'react';
import * as Icon from '../common/Icons';
import { listFeedPosts } from '../../lib/dataconnect';

const isPdfUrl = (url) => {
  if (!url) return false;
  try {
    const urlWithoutQuery = url.split('?')[0];
    return urlWithoutQuery.toLowerCase().endsWith('.pdf');
  } catch (e) {
    return url.toLowerCase().includes('.pdf');
  }
};

const FeedScreen = ({ scope, onAction, user }) => {
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [posts, setPosts] = useState([]);
  const [postComments, setPostComments] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

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
    if (scope === 'All' || scope === 'Todos') return true;
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
              isPdfUrl(post.image) ? (
                <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <iframe
                    src={post.image}
                    title={`PDF ${post.id}`}
                    style={{ width: '100%', height: '300px', border: '1px solid #ddd', borderRadius: '8px' }}
                  />
                  <div>
                    <a
                      href={`${backendUrl}/api/download?url=${encodeURIComponent(post.image)}`}
                      download
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#f0f4f8',
                        color: 'var(--accent)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        border: '1px solid #d0e0f0'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      📥 Download PDF
                    </a>
                  </div>
                </div>
              ) : (
                <img
                  src={post.image}
                  alt="Post content"
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', objectFit: 'cover', maxHeight: '200px' }}
                />
              )
            )}

            <div style={{ display: 'flex', borderTop: '1px solid #eee', paddingTop: '12px', gap: '16px' }}>
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
              isPdfUrl(selectedPost.image) ? (
                <div style={{ padding: '24px 24px 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <iframe
                    src={selectedPost.image}
                    title={`PDF-detail-${selectedPost.id}`}
                    style={{ width: '100%', height: '450px', border: '1px solid #ddd', borderRadius: '8px' }}
                  />
                  <div>
                    <a
                      href={`${backendUrl}/api/download?url=${encodeURIComponent(selectedPost.image)}`}
                      download
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#f0f4f8',
                        color: 'var(--accent)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        border: '1px solid #d0e0f0'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      📥 Download PDF
                    </a>
                  </div>
                </div>
              ) : (
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
              )
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
