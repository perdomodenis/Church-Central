import React from 'react';
import * as Icon from '../common/Icons';

const MOCK_POSTS = [
  {
    id: 1,
    author: 'Church Media',
    time: '2 hours ago',
    content: 'Join us this Sunday for our special service "Walking in Faith". We look forward to seeing the whole family!',
    scope: 'News',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    prayers: 12
  },
  {
    id: 2,
    author: 'Youth Ministry',
    time: '5 hours ago',
    content: 'The regional youth retreat registrations are now open! Early bird discount ends this Friday.',
    scope: 'Department',
    prayers: 45
  },
  {
    id: 3,
    author: 'Admin Office',
    time: '1 day ago',
    content: 'New maintenance updates for the district office building are scheduled for next Monday.',
    scope: 'District',
    prayers: 3
  }
];

const FeedScreen = ({ scope, onAction }) => {
  // Filter posts based on scope. "All" (Todos) shows everything.
  const filteredPosts = scope === 'All' || scope === 'Todos' 
    ? MOCK_POSTS 
    : MOCK_POSTS.filter(post => post.scope === scope);

  return (
    <div className="feed-screen" style={{ padding: '12px' }}>
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <div key={post.id} className="post-card" style={cardStyle}>
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
                <span style={{ marginRight: '4px' }}>🙏</span> Pray
              </button>
              <button onClick={() => onAction('comment')} style={actionButtonStyle}>
                <span style={{ marginRight: '4px' }}>💬</span> Comment
              </button>
              <button onClick={() => onAction('share')} style={actionButtonStyle}>
                <span style={{ marginRight: '4px' }}>🔗</span> Share
              </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          <p>No updates in this category yet.</p>
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