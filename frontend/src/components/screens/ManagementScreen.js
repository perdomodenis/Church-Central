import React, { useState } from 'react';

const PENDING_APPOINTMENTS = [
  {
    id: 1,
    requester: 'Alice Smith',
    staff: 'Pastor John Doe',
    date: 'Nov 02, 2023',
    time: '11:00 AM',
    reason: 'Spiritual guidance regarding career changes.',
    type: 'Guidance'
  },
  {
    id: 2,
    requester: 'Bob Johnson',
    staff: 'Counseling Department',
    date: 'Nov 05, 2023',
    time: '4:00 PM',
    reason: 'Family counseling session request.',
    type: 'Counseling'
  }
];

const PENDING_POSTS = [
  {
    id: 101,
    author: 'Sarah Parker',
    scope: 'News',
    content: 'Does anyone have a contact for a reliable local plumber? The church kitchen sink is acting up again.',
    time: '1 hour ago'
  },
  {
    id: 102,
    author: 'Tom Brown',
    scope: 'Department',
    content: 'Reminder: Worship team rehearsal moved to Thursday night this week!',
    time: '3 hours ago'
  }
];

const ManagementScreen = () => {
  const [activeTab, setActiveTab] = useState('appointments');

  const handleAction = (type, id, action) => {
    console.log(`${action} ${type} with ID: ${id}`);
    alert(`${type} ${action === 'approve' ? 'approved' : 'rejected'}.`);
  };

  return (
    <div className="management-screen" style={{ padding: '16px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Admin Dashboard</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Review and manage community requests and content.</p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        backgroundColor: '#eee', 
        padding: '4px', 
        borderRadius: '10px', 
        marginBottom: '20px' 
      }}>
        <button 
          onClick={() => setActiveTab('appointments')}
          style={tabButtonStyle(activeTab === 'appointments')}
        >
          Appointments
        </button>
        <button 
          onClick={() => setActiveTab('posts')}
          style={tabButtonStyle(activeTab === 'posts')}
        >
          Posts
        </button>
      </div>

      {/* Content */}
      <div className="mgmt-content">
        {activeTab === 'appointments' ? (
          PENDING_APPOINTMENTS.map(app => (
            <div key={app.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{app.requester}</span>
                <span style={tagStyle}>{app.type}</span>
              </div>
              <div style={detailStyle}>With: <strong>{app.staff}</strong></div>
              <div style={detailStyle}>📅 {app.date} at {app.time}</div>
              <p style={{ fontSize: '0.9rem', margin: '12px 0', fontStyle: 'italic', color: '#555' }}>
                "{app.reason}"
              </p>
              <div style={actionRowStyle}>
                <button onClick={() => handleAction('Appointment', app.id, 'reject')} style={secondaryButtonStyle}>Reject</button>
                <button onClick={() => handleAction('Appointment', app.id, 'approve')} style={primaryButtonStyle}>Approve</button>
              </div>
            </div>
          ))
        ) : (
          PENDING_POSTS.map(post => (
            <div key={post.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{post.author}</span>
                <span style={tagStyle}>{post.scope}</span>
              </div>
              <div style={detailStyle}>{post.time}</div>
              <p style={{ fontSize: '0.9rem', margin: '12px 0', lineHeight: '1.4' }}>
                {post.content}
              </p>
              <div style={actionRowStyle}>
                <button onClick={() => handleAction('Post', post.id, 'reject')} style={secondaryButtonStyle}>Delete</button>
                <button onClick={() => handleAction('Post', post.id, 'approve')} style={primaryButtonStyle}>Publish</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styles
const tabButtonStyle = (isActive) => ({
  flex: 1,
  padding: '10px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  backgroundColor: isActive ? 'white' : 'transparent',
  color: isActive ? 'var(--accent)' : '#666',
  transition: 'all 0.2s'
});

const cardStyle = {
  backgroundColor: 'white',
  padding: '16px',
  borderRadius: '16px',
  marginBottom: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const detailStyle = { fontSize: '0.85rem', color: '#666', marginBottom: '2px' };

const tagStyle = { fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent)', backgroundColor: 'var(--accent-light, #EFE9FF)', padding: '2px 8px', borderRadius: '100px' };

const actionRowStyle = { display: 'flex', gap: '10px', marginTop: '16px' };

const primaryButtonStyle = { flex: 1, padding: '10px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };

const secondaryButtonStyle = { flex: 1, padding: '10px', backgroundColor: '#f5f5f5', color: '#666', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };

export default ManagementScreen;