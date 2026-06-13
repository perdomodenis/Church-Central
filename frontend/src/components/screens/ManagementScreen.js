import React, { useState, useEffect } from 'react';
import { approveAppointment, rejectAppointment, getPendingAppointments, getApprovedAppointments, getRejectedAppointments } from '../../services/appointmentService';
import { getDepartmentRequests, approveDepartmentRequest, rejectDepartmentRequest } from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { sendInboxNotificationByEmail } from '../../services/notificationService';
import DocumentsScreen from './DocumentsScreen';
import EventsScreen from './EventsScreen';
import ScheduleScreen from './ScheduleScreen';

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

const ManagementScreen = ({ 
  user, 
  openDocUploadOnMount, 
  setOpenDocUploadOnMount,
  openAddScheduleOnMount,
  setOpenAddScheduleOnMount,
  refreshKey,
  triggerRefresh
}) => {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  
  // Hub Navigation State
  const [activeSubTab, setActiveSubTab] = useState(
    (user?.accessLevel >= 3 || user?.isPA) ? 'admin' : 
    (user?.accessLevel >= 2) ? 'documents' : 'events'
  );

  const [activeTab, setActiveTab] = useState('pending');
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [rejectedAppointments, setRejectedAppointments] = useState([]);
  const [departmentRequests, setDepartmentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to filter appointments for PA routing or Pastor routing
  const filterAppointments = (list) => {
    if (!user) return [];
    
    // Level 4 (Admin, Bishop, Reverend) sees everything
    if (user.accessLevel >= 4) return list;
    
    // Filter by PA or Leader
    return list.filter(app => {
      // If current user is the PA for this request
      if (app.pa && app.pa.uid === user.uid) return true;
      // If current user is the target leader and the request has NO PA (it went directly to them)
      if (app.leader && app.leader.uid === user.uid && !app.pa) return true;
      
      return false;
    });
  };

  const displayPending = filterAppointments(pendingAppointments);
  const displayApproved = filterAppointments(approvedAppointments);
  const displayRejected = filterAppointments(rejectedAppointments);

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

  const handleApprove = async (id, selectedSlot, date, time) => {
    try {
      await approveAppointment(id, authUser?.displayName || 'Admin', selectedSlot, date, time);
      
      const appObj = pendingAppointments.find(app => app.id === id);
      if (appObj) {
        const approvedObj = {
          ...appObj,
          status: 'approved',
          approvedBy: authUser?.displayName || 'Admin',
          decidedAt: new Date().toISOString(),
          selectedSlot,
          date,
          time
        };
        setPendingAppointments(prev => prev.filter(app => app.id !== id));
        setApprovedAppointments(prev => [approvedObj, ...prev]);

        // Send inbox notification to the requester
        await sendInboxNotificationByEmail(appObj.requesterEmail, {
          sender: authUser?.displayName || 'CCI Staff',
          senderId: authUser?.uid || 'system',
          subject: 'Appointment Approved',
          preview: `Your appointment request has been approved for ${date} at ${time}.`,
          body: `Hi ${appObj.requester}!\n\nYour appointment request with ${appObj.staff} has been approved by ${authUser?.displayName || 'CCI Staff'}.\n\nScheduled Date & Time:\n- Date: ${date}\n- Time: ${time}\n\nThank you!`
        });
      }
      alert(t('appointmentApproved'));
    } catch (error) {
      alert(t('errorApproving'));
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      const reason = 'Not approved at this time';
      await rejectAppointment(id, authUser?.displayName || 'Admin', reason);
      
      const appObj = pendingAppointments.find(app => app.id === id);
      if (appObj) {
        const rejectedObj = {
          ...appObj,
          status: 'rejected',
          rejectedBy: authUser?.displayName || 'Admin',
          rejectionReason: reason,
          decidedAt: new Date().toISOString()
        };
        setPendingAppointments(prev => prev.filter(app => app.id !== id));
        setRejectedAppointments(prev => [rejectedObj, ...prev]);

        // Send inbox notification to the requester
        await sendInboxNotificationByEmail(appObj.requesterEmail, {
          sender: authUser?.displayName || 'CCI Staff',
          senderId: authUser?.uid || 'system',
          subject: 'Appointment Declined',
          preview: `Your appointment request with ${appObj.staff} was declined.`,
          body: `Hi ${appObj.requester}!\n\nYour appointment request with ${appObj.staff} could not be scheduled at this time.\n\nDecision by: ${authUser?.displayName || 'CCI Staff'}\nReason: ${reason}`
        });
      }
      alert(t('appointmentRejected'));
    } catch (error) {
      alert(t('errorRejecting'));
      console.error(error);
    }
  };

  const handleApproveDept = async (req) => {
    try {
      await approveDepartmentRequest(req.id, req.userId, req.departmentName, authUser?.displayName || 'Admin');
      
      setDepartmentRequests(prev => prev.map(r => r.id === req.id ? {
        ...r,
        status: 'approved',
        approvedBy: authUser?.displayName || 'Admin',
        decidedAt: new Date().toISOString()
      } : r));
      
      const deptNameTranslated = t(toCamelCase(req.departmentName)) || req.departmentName;
      alert(t('deptJoinedSuccess').replace('{name}', req.userName).replace('{dept}', deptNameTranslated));
    } catch (error) {
      alert(t('errorDeptApproval'));
      console.error(error);
    }
  };

  const handleRejectDept = async (id) => {
    try {
      await rejectDepartmentRequest(id, authUser?.displayName || 'Admin');
      
      setDepartmentRequests(prev => prev.map(r => r.id === id ? {
        ...r,
        status: 'rejected',
        rejectedBy: authUser?.displayName || 'Admin',
        decidedAt: new Date().toISOString()
      } : r));
      
      alert(t('deptRequestRejected'));
    } catch (error) {
      alert(t('errorDeptRejection'));
      console.error(error);
    }
  };

  return (
    <div className="management-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- HORIZONTAL NAV BAR --- */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px 20px',
        overflowX: 'auto',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--line)',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none'  // IE 10+
      }}>
        <style>{`
          .mgmt-nav-bar::-webkit-scrollbar { display: none; }
        `}</style>

        {(user?.accessLevel >= 3 || user?.isPA) && (
          <button 
            onClick={() => setActiveSubTab('admin')} 
            style={topTabStyle(activeSubTab === 'admin')}
          >
            Dashboard
          </button>
        )}
        
        {user?.accessLevel >= 2 && (
          <button 
            onClick={() => setActiveSubTab('documents')} 
            style={topTabStyle(activeSubTab === 'documents')}
          >
            Documents
          </button>
        )}

        <button 
          onClick={() => setActiveSubTab('events')} 
          style={topTabStyle(activeSubTab === 'events')}
        >
          Events
        </button>

        {user?.accessLevel >= 2 && (
          <button 
            onClick={() => setActiveSubTab('schedule')} 
            style={topTabStyle(activeSubTab === 'schedule')}
          >
            Schedule
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeSubTab === 'admin' && (user?.accessLevel >= 3 || user?.isPA) && (
          <div style={{ padding: '24px', paddingBottom: '80px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', color: 'var(--ink)' }}>{t('adminDashboard')}</h2>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', color: 'var(--ink-2)' }}>{t('adminDashboardSubtitle')}</p>
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
            {t('pending')} ({displayPending.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            style={tabButtonStyle(activeTab === 'approved')}
          >
            {t('approved')} ({displayApproved.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            style={tabButtonStyle(activeTab === 'rejected')}
          >
            {t('rejected')} ({displayRejected.length})
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
            {t('pending')} ({departmentRequests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('dept_history')}
            style={tabButtonStyle(activeTab === 'dept_history')}
          >
            {t('history')} ({departmentRequests.filter(r => r.status !== 'pending').length})
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
          displayPending.length > 0 ? (
            displayPending.map(app => (
              <div key={app.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{app.requester}</span>
                  <span style={tagStyle}>{t(app.type.toLowerCase().includes('pastoral') ? 'pastoralCounseling' : app.type.toLowerCase().includes('worship') ? 'worshipDiscussion' : 'guidanceCounseling')}</span>
                </div>
                <div style={detailStyle}>{t('with')}: <strong>{app.staff}</strong></div>
                {app.pa && (
                  <div style={{ ...detailStyle, color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
                    <span>🛡️ Sent to PA:</span>
                    <span>{app.pa.first} {app.pa.last}</span>
                  </div>
                )}
                
                <p style={{ fontSize: '0.9rem', margin: '12px 0', fontStyle: 'italic', color: '#555' }}>
                  "{app.reason}"
                </p>

                <div style={{ marginTop: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>
                    {t('selectSlotToApprove') || 'Select slot option to approve:'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                      onClick={() => handleApprove(app.id, 1, app.date1, app.time1)}
                      style={slotApproveButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f4f2ff';
                        e.currentTarget.style.color = 'var(--accent)';
                      }}
                    >
                      <span> Option 1: <strong>{app.date1}</strong> at <strong>{app.time1}</strong></span>
                      <span style={{ fontSize: '1rem' }}>➡️</span>
                    </button>
                    <button 
                      onClick={() => handleApprove(app.id, 2, app.date2, app.time2)}
                      style={slotApproveButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f4f2ff';
                        e.currentTarget.style.color = 'var(--accent)';
                      }}
                    >
                      <span> Option 2: <strong>{app.date2}</strong> at <strong>{app.time2}</strong></span>
                      <span style={{ fontSize: '1rem' }}>➡️</span>
                    </button>
                    <button 
                      onClick={() => handleApprove(app.id, 3, app.date3, app.time3)}
                      style={slotApproveButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f4f2ff';
                        e.currentTarget.style.color = 'var(--accent)';
                      }}
                    >
                      <span> Option 3: <strong>{app.date3}</strong> at <strong>{app.time3}</strong></span>
                      <span style={{ fontSize: '1rem' }}>➡️</span>
                    </button>
                  </div>
                </div>

                <div style={{ ...actionRowStyle, marginTop: '16px' }}>
                  <button onClick={() => handleReject(app.id)} style={{ ...secondaryButtonStyle, width: '100%', flex: 'none' }}>❌ {t('reject')}</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>{t('noPendingAppts')}</p>
            </div>
          )
        ) : activeTab === 'approved' ? (
          displayApproved.length > 0 ? (
            displayApproved.map(app => (
              <div key={app.id} style={{ ...cardStyle, borderLeft: '4px solid #4caf50' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>✅ {app.requester}</span>
                  <span style={{ ...tagStyle, backgroundColor: '#e8f5e9', color: '#2e7d32' }}>{t(app.type.toLowerCase().includes('pastoral') ? 'pastoralCounseling' : app.type.toLowerCase().includes('worship') ? 'worshipDiscussion' : 'guidanceCounseling')}</span>
                </div>
                <div style={detailStyle}>{t('with')}: <strong>{app.staff}</strong></div>
                <div style={detailStyle}>📅 <strong>{app.date}</strong> {t('at')} <strong>{app.time}</strong> {app.selectedSlot && `(Option ${app.selectedSlot})`}</div>
                {app.pa && (
                  <div style={{ ...detailStyle, color: 'var(--accent)', marginTop: '4px' }}>
                    🛡️ Managed by PA: {app.pa.first} {app.pa.last}
                  </div>
                )}
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
          displayRejected.length > 0 ? (
            displayRejected.map(app => (
              <div key={app.id} style={{ ...cardStyle, borderLeft: '4px solid #f44336' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>❌ {app.requester}</span>
                  <span style={{ ...tagStyle, backgroundColor: '#ffebee', color: '#c62828' }}>{t(app.type.toLowerCase().includes('pastoral') ? 'pastoralCounseling' : app.type.toLowerCase().includes('worship') ? 'worshipDiscussion' : 'guidanceCounseling')}</span>
                </div>
                <div style={detailStyle}>{t('with')}: <strong>{app.staff}</strong></div>
                <div style={detailStyle}>📅 Suggested: Option 1 ({app.date1}), Option 2 ({app.date2}), Option 3 ({app.date3})</div>
                {app.pa && (
                  <div style={{ ...detailStyle, color: 'var(--accent)', marginTop: '4px' }}>
                    🛡️ Managed by PA: {app.pa.first} {app.pa.last}
                  </div>
                )}
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
    )}

    {activeSubTab === 'documents' && user?.accessLevel >= 2 && (
      <DocumentsScreen 
        user={user} 
        openUploadOnMount={openDocUploadOnMount} 
        onCloseUploadOnMount={() => setOpenDocUploadOnMount(false)} 
      />
    )}

    {activeSubTab === 'events' && (
      <EventsScreen user={user} />
    )}

    {activeSubTab === 'schedule' && user?.accessLevel >= 2 && (
      <ScheduleScreen 
        user={user}
        refreshKey={refreshKey}
        onRefresh={triggerRefresh}
        openAddEventOnMount={openAddScheduleOnMount}
        onCloseAddEventOnMount={() => setOpenAddScheduleOnMount(false)}
      />
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

const slotApproveButtonStyle = {
  width: '100%',
  padding: '10px 14px',
  backgroundColor: '#f4f2ff',
  color: 'var(--accent)',
  border: '1px solid rgba(91, 63, 187, 0.2)',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '6px'
};

const topTabStyle = (isActive) => ({
  whiteSpace: 'nowrap',
  padding: '8px 16px',
  borderRadius: '20px',
  border: 'none',
  fontWeight: '600',
  fontSize: '0.95rem',
  cursor: 'pointer',
  backgroundColor: isActive ? 'var(--accent)' : 'var(--line)',
  color: isActive ? 'white' : 'var(--ink-2)',
  transition: 'all 0.2s',
  flexShrink: 0
});

export default ManagementScreen;