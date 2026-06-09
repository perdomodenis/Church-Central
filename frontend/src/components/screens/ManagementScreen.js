import React, { useState, useEffect } from 'react';
import { approveAppointment, rejectAppointment, getPendingAppointments, getApprovedAppointments, getRejectedAppointments } from '../../services/appointmentService';
import { getDepartmentRequests, approveDepartmentRequest, rejectDepartmentRequest } from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

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

const ManagementScreen = () => {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [rejectedAppointments, setRejectedAppointments] = useState([]);
  const [departmentRequests, setDepartmentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const pendingDeptRequests = departmentRequests.filter(r => r.status === 'pending');
  const historyDeptRequests = departmentRequests.filter(r => r.status !== 'pending');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pending, approved, rejected, deptReqs] = await Promise.all([
        getPendingAppointments(),
        getApprovedAppointments(),
        getRejectedAppointments(),
        getDepartmentRequests()
      ]);

      setPendingAppointments(pending);
      setApprovedAppointments(approved);
      setRejectedAppointments(rejected);
      setDepartmentRequests(deptReqs);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveAppointment(id, authUser?.displayName || 'Admin');
      setPendingAppointments(prev => prev.filter(app => app.id !== id));
      alert(t('appointmentApproved'));
      await loadData();
    } catch (error) {
      alert(t('errorApproving'));
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAppointment(id, authUser?.displayName || 'Admin', 'Not approved at this time');
      setPendingAppointments(prev => prev.filter(app => app.id !== id));
      alert(t('appointmentRejected'));
      await loadData();
    } catch (error) {
      alert(t('errorRejecting'));
      console.error(error);
    }
  };

  const handleApproveDept = async (req) => {
    try {
      await approveDepartmentRequest(req.id, req.userId, req.departmentName, authUser?.displayName || 'Admin');
      const deptNameTranslated = t(toCamelCase(req.departmentName)) || req.departmentName;
      alert(t('deptJoinedSuccess').replace('{name}', req.userName).replace('{dept}', deptNameTranslated));
      await loadData();
    } catch (error) {
      alert(t('errorDeptApproval'));
      console.error(error);
    }
  };

  const handleRejectDept = async (id) => {
    try {
      await rejectDepartmentRequest(id, authUser?.displayName || 'Admin');
      alert(t('deptRequestRejected'));
      await loadData();
    } catch (error) {
      alert(t('errorDeptRejection'));
      console.error(error);
    }
  };

  return (
    <div className="management-screen" style={{ padding: '16px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>{t('adminDashboard')}</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{t('adminDashboardSubtitle')}</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <select
          value={activeTab.includes('dept') ? 'dept' : 'appts'}
          onChange={(e) => setActiveTab(e.target.value === 'dept' ? 'dept_pending' : 'pending')}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: '600' }}
        >
          <option value="appts">{t('appointments')}</option>
          <option value="dept">{t('departmentRequests')}</option>
        </select>
      </div>

      {/* Tabs */}
      {activeTab.includes('appts') || !activeTab.includes('dept') ? (
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
            ⏳ {t('pending')} ({pendingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            style={tabButtonStyle(activeTab === 'approved')}
          >
            ✅ {t('approved')} ({approvedAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            style={tabButtonStyle(activeTab === 'rejected')}
          >
            ❌ {t('rejected')} ({rejectedAppointments.length})
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          backgroundColor: '#eee',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '20px',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveTab('dept_pending')}
            style={tabButtonStyle(activeTab === 'dept_pending')}
          >
            ⏳ {t('pending')} ({departmentRequests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('dept_history')}
            style={tabButtonStyle(activeTab === 'dept_history')}
          >
            📚 {t('history')} ({departmentRequests.filter(r => r.status !== 'pending').length})
          </button>
        </div>
      )}

      {/* Content */}
      <div className="mgmt-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            {t('loading')}
          </div>
        ) : activeTab === 'pending' ? (
          pendingAppointments.length > 0 ? (
            pendingAppointments.map(app => (
              <div key={app.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{app.requester}</span>
                  <span style={tagStyle}>{t(app.type.toLowerCase().includes('pastoral') ? 'pastoralCounseling' : app.type.toLowerCase().includes('worship') ? 'worshipDiscussion' : 'guidanceCounseling')}</span>
                </div>
                <div style={detailStyle}>{t('with')}: <strong>{app.staff}</strong></div>
                <div style={detailStyle}>📅 {app.date} {t('at')} {app.time}</div>
                <p style={{ fontSize: '0.9rem', margin: '12px 0', fontStyle: 'italic', color: '#555' }}>
                  "{app.reason}"
                </p>
                <div style={actionRowStyle}>
                  <button onClick={() => handleReject(app.id)} style={secondaryButtonStyle}>❌ {t('reject')}</button>
                  <button onClick={() => handleApprove(app.id)} style={primaryButtonStyle}>✅ {t('approve')}</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>{t('noPendingAppts')}</p>
            </div>
          )
        ) : activeTab === 'approved' ? (
          approvedAppointments.length > 0 ? (
            approvedAppointments.map(app => (
              <div key={app.id} style={{ ...cardStyle, borderLeft: '4px solid #4caf50' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>✅ {app.requester}</span>
                  <span style={{ ...tagStyle, backgroundColor: '#e8f5e9', color: '#2e7d32' }}>{t(app.type.toLowerCase().includes('pastoral') ? 'pastoralCounseling' : app.type.toLowerCase().includes('worship') ? 'worshipDiscussion' : 'guidanceCounseling')}</span>
                </div>
                <div style={detailStyle}>{t('with')}: <strong>{app.staff}</strong></div>
                <div style={detailStyle}>📅 {app.date} {t('at')} {app.time}</div>
                <div style={{ fontSize: '0.8rem', color: '#4caf50', marginTop: '8px' }}>{t('approvedBy')}: {app.approvedBy}</div>
                <div style={{ fontSize: '0.8rem', color: '#4caf50' }}>{t('decided')}: {new Date(app.decidedAt).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>{t('noApprovedAppts')}</p>
            </div>
          )
        ) : activeTab === 'rejected' ? (
          rejectedAppointments.length > 0 ? (
            rejectedAppointments.map(app => (
              <div key={app.id} style={{ ...cardStyle, borderLeft: '4px solid #f44336' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>❌ {app.requester}</span>
                  <span style={{ ...tagStyle, backgroundColor: '#ffebee', color: '#c62828' }}>{t(app.type.toLowerCase().includes('pastoral') ? 'pastoralCounseling' : app.type.toLowerCase().includes('worship') ? 'worshipDiscussion' : 'guidanceCounseling')}</span>
                </div>
                <div style={detailStyle}>{t('with')}: <strong>{app.staff}</strong></div>
                <div style={detailStyle}>📅 {app.date} {t('at')} {app.time}</div>
                <div style={{ fontSize: '0.8rem', color: '#f44336', marginTop: '8px' }}>{t('rejectedBy')}: {app.rejectedBy}</div>
                <div style={{ fontSize: '0.8rem', color: '#f44336' }}>{t('decided')}: {new Date(app.decidedAt).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>{t('noRejectedAppts')}</p>
            </div>
          )
        ) : activeTab === 'dept_pending' ? (
          pendingDeptRequests.length > 0 ? (
            pendingDeptRequests.map(req => (
              <div key={req.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{req.userName}</span>
                  <span style={{ ...tagStyle, backgroundColor: 'rgba(91, 63, 187, 0.1)' }}>{t('deptJoin')}</span>
                </div>
                <div style={detailStyle}>{t('requestsToJoin')} <strong>{t(toCamelCase(req.departmentName)) || req.departmentName}</strong></div>
                <div style={detailStyle}>{t('requested')}: {new Date(req.requestedAt).toLocaleString()}</div>
                <div style={actionRowStyle}>
                  <button onClick={() => handleRejectDept(req.id)} style={secondaryButtonStyle}>❌ {t('reject')}</button>
                  <button onClick={() => handleApproveDept(req)} style={primaryButtonStyle}>✅ {t('approve')}</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>{t('noPendingDeptRequests')}</p>
            </div>
          )
        ) : activeTab === 'dept_history' ? (
          historyDeptRequests.length > 0 ? (
            historyDeptRequests.map(req => (
              <div key={req.id} style={{ ...cardStyle, borderLeft: req.status === 'approved' ? '4px solid #4caf50' : '4px solid #f44336' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {req.status === 'approved' ? '✅' : '❌'} {req.userName}
                  </span>
                  <span style={{ ...tagStyle, backgroundColor: req.status === 'approved' ? '#e8f5e9' : '#ffebee', color: req.status === 'approved' ? '#2e7d32' : '#c62828' }}>{req.status === 'approved' ? t('approved') : t('rejected')}</span>
                </div>
                <div style={detailStyle}>{t('requestsToJoin')} <strong>{t(toCamelCase(req.departmentName)) || req.departmentName}</strong></div>
                <div style={detailStyle}>{t('requested')}: {new Date(req.requestedAt).toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', color: req.status === 'approved' ? '#4caf50' : '#f44336', marginTop: '8px' }}>
                  {req.status === 'approved' ? t('approvedBy') : t('rejectedBy')}: {req.status === 'approved' ? req.approvedBy : req.rejectedBy}
                </div>
                <div style={{ fontSize: '0.8rem', color: req.status === 'approved' ? '#4caf50' : '#f44336' }}>
                  {t('decided')}: {new Date(req.decidedAt).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>{t('noDeptRequestHistory')}</p>
            </div>
          )
        ) : null}
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