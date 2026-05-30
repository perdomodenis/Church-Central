import React, { useState, useEffect } from 'react';
import { approveAppointment, rejectAppointment, getPendingAppointments, getApprovedAppointments, getRejectedAppointments } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

const PENDING_APPOINTMENTS = [
  {
    id: 1,
    requester: 'Alice Smith',
    staff: 'James Peterson',
    date: 'Jun 10, 2025',
    time: '11:00 AM',
    reason: 'Spiritual guidance regarding career changes.',
    type: 'Guidance'
  },
  {
    id: 2,
    requester: 'Bob Johnson',
    staff: 'Rachel Thompson',
    date: 'Jun 15, 2025',
    time: '4:00 PM',
    reason: 'Worship planning discussion.',
    type: 'Discussion'
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
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingAppointments, setPendingAppointments] = useState(PENDING_APPOINTMENTS);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [rejectedAppointments, setRejectedAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const pending = await getPendingAppointments();
      const approved = await getApprovedAppointments();
      const rejected = await getRejectedAppointments();

      if (pending.length > 0) setPendingAppointments(pending);
      if (approved.length > 0) setApprovedAppointments(approved);
      if (rejected.length > 0) setRejectedAppointments(rejected);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await approveAppointment(id, authUser?.displayName || 'Admin');
      setPendingAppointments(prev => prev.filter(app => app.id !== id));
      alert('✅ Appointment approved!');
      await loadAppointments();
    } catch (error) {
      alert('Error approving appointment');
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAppointment(id, authUser?.displayName || 'Admin', 'Not approved at this time');
      setPendingAppointments(prev => prev.filter(app => app.id !== id));
      alert('❌ Appointment rejected!');
      await loadAppointments();
    } catch (error) {
      alert('Error rejecting appointment');
      console.error(error);
    }
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
        marginBottom: '20px',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={tabButtonStyle(activeTab === 'pending')}
        >
          ⏳ Pending ({pendingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          style={tabButtonStyle(activeTab === 'approved')}
        >
          ✅ Approved ({approvedAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          style={tabButtonStyle(activeTab === 'rejected')}
        >
          ❌ Rejected ({rejectedAppointments.length})
        </button>
      </div>

      {/* Content */}
      <div className="mgmt-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Loading...
          </div>
        ) : activeTab === 'pending' ? (
          pendingAppointments.length > 0 ? (
            pendingAppointments.map(app => (
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
                  <button onClick={() => handleReject(app.id)} style={secondaryButtonStyle}>❌ Reject</button>
                  <button onClick={() => handleApprove(app.id)} style={primaryButtonStyle}>✅ Approve</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>No pending appointments</p>
            </div>
          )
        ) : activeTab === 'approved' ? (
          approvedAppointments.length > 0 ? (
            approvedAppointments.map(app => (
              <div key={app.id} style={{...cardStyle, borderLeft: '4px solid #4caf50'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>✅ {app.requester}</span>
                  <span style={{...tagStyle, backgroundColor: '#e8f5e9', color: '#2e7d32'}}>{app.type}</span>
                </div>
                <div style={detailStyle}>With: <strong>{app.staff}</strong></div>
                <div style={detailStyle}>📅 {app.date} at {app.time}</div>
                <div style={{fontSize: '0.8rem', color: '#4caf50', marginTop: '8px'}}>Approved by: {app.approvedBy}</div>
                <div style={{fontSize: '0.8rem', color: '#4caf50'}}>Decided: {new Date(app.decidedAt).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>No approved appointments</p>
            </div>
          )
        ) : (
          rejectedAppointments.length > 0 ? (
            rejectedAppointments.map(app => (
              <div key={app.id} style={{...cardStyle, borderLeft: '4px solid #f44336'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>❌ {app.requester}</span>
                  <span style={{...tagStyle, backgroundColor: '#ffebee', color: '#c62828'}}>{app.type}</span>
                </div>
                <div style={detailStyle}>With: <strong>{app.staff}</strong></div>
                <div style={detailStyle}>📅 {app.date} at {app.time}</div>
                <div style={{fontSize: '0.8rem', color: '#f44336', marginTop: '8px'}}>Rejected by: {app.rejectedBy}</div>
                <div style={{fontSize: '0.8rem', color: '#f44336'}}>Decided: {new Date(app.decidedAt).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>No rejected appointments</p>
            </div>
          )
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