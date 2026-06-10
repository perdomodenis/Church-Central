import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as Icon from './Icons';
import { useLanguage } from '../../context/LanguageContext';

// --- TopBar Component ---
const RED_DOT_STYLE = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '10px',
  height: '10px',
  backgroundColor: '#ff3b30',
  borderRadius: '50%',
  border: '2px solid white',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
};

export const TopBar = ({ route, onNavigate, scope, scopeOptions, title, onScope, onMenu, onProfile, user, hasNewInbox = false, hasNewMessages = false }) => {
  const { t } = useLanguage();
  const level = user?.accessLevel || 1;
  const navItems = [
    { id: 'home', label: t('home') },
    ...(level >= 3 ? [{ id: 'members', label: t('church') }] : []),
    ...(level >= 2 ? [{ id: 'documents', label: t('documents') }] : []),
    ...(level >= 2 ? [{ id: 'schedule', label: t('schedule') }] : []),
    { id: 'appointment', label: t('appointments') },
    { id: 'events', label: t('events') },
    ...((level >= 3 || user?.isPA) ? [{ id: 'mgmt', label: t('management') }] : []),
    { id: 'baptism', label: t('baptism') },
  ];



  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderBottom: '1px solid #eee', zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      {/* Main TopBar */}
      <div style={{ ...topBarStyle, borderBottom: 'none', boxShadow: 'none' }}>
        {/* Mobile Hamburger */}
        <button onClick={onMenu} style={iconButtonStyle} className="mobile-only">
          <Icon.Menu />
        </button>

        {/* Desktop Logo / Title */}
        <div className="desktop-only" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent)', marginRight: '20px' }}>
          Church Central
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {/* Mobile title / dropdown */}
          <div className="mobile-only" style={{ flex: 1, textAlign: 'center' }}>
            {scopeOptions ? (
              <select
                value={scope}
                onChange={(e) => onScope(e.target.value)}
                style={scopeSelectStyle}
              >
                {scopeOptions.map(option => (
                  <option key={option} value={option}>{t(option.toLowerCase())}</option>
                ))}
              </select>
            ) : (
              <span style={titleStyle}>{title || 'Home'}</span>
            )}
          </div>
          
          {/* Desktop Navbar */}
          <div className="desktop-only" style={{ display: 'flex', gap: '15px', overflowX: 'auto', flex: 1, alignItems: 'center' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: route === item.id ? 'bold' : 'normal',
                  color: route === item.id ? 'var(--accent)' : '#333',
                  fontSize: '0.95rem',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  backgroundColor: route === item.id ? 'var(--accent-light, #EFE9FF)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
          <button onClick={() => onNavigate && onNavigate('inbox')} style={{...iconButtonStyle, position: 'relative'}} title="Inbox">
            <Icon.Inbox />
            {hasNewInbox && <div style={RED_DOT_STYLE} />}
          </button>
          <button onClick={() => onNavigate && onNavigate('messages')} style={{ ...iconButtonStyle, marginLeft: '4px', position: 'relative' }} title="Messages">
            <Icon.Feedback />
            {hasNewMessages && <div style={RED_DOT_STYLE} />}
          </button>
        </div>
        <button onClick={onProfile} style={iconButtonStyle} title="Profile">
          <Icon.User />
        </button>
      </div>
    </div>
  );
};

// --- MenuDrawer Component ---
export const MenuDrawer = ({ open, onClose, route, onNavigate, onLogout, user }) => {
  const { t } = useLanguage();
  const handleNavigate = (newRoute) => {
    onNavigate(newRoute);
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const level = user?.accessLevel || 1;

  return (
    <div style={drawerOverlayStyle(open)} onClick={onClose}>
      <div style={drawerContentStyle(open)} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: 'var(--accent)' }}>Church Central</h3>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 20px' }}>
          <MenuItem label={t('home')} active={route === 'home'} onClick={() => handleNavigate('home')} />
          {level >= 3 && <MenuItem label={t('church')} active={route === 'members'} onClick={() => handleNavigate('members')} />}
          {level >= 2 && <MenuItem label={t('documents')} active={route === 'documents'} onClick={() => handleNavigate('documents')} />}
          {level >= 2 && <MenuItem label={t('schedule')} active={route === 'schedule'} onClick={() => handleNavigate('schedule')} />}
          <MenuItem label={t('appointments')} active={route === 'appointment'} onClick={() => handleNavigate('appointment')} />
          <MenuItem label={t('events')} active={route === 'events'} onClick={() => handleNavigate('events')} />
          {(level >= 3 || user?.isPA) && <MenuItem label={t('management')} active={route === 'mgmt'} onClick={() => handleNavigate('mgmt')} />}
          <MenuItem label={t('baptism')} active={route === 'baptism'} onClick={() => handleNavigate('baptism')} />
          <MenuItem label={t('nls')} active={route === 'nls'} onClick={() => handleNavigate('nls')} />
          <MenuItem label={t('profile')} active={route === 'profile'} onClick={() => handleNavigate('profile')} />
          <MenuItem label={t('feedback')} active={route === 'feedback'} onClick={() => handleNavigate('feedback')} />
          {level >= 4 && <MenuItem label={t('debug')} active={route === 'debug'} onClick={() => handleNavigate('debug')} />}
          <div style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '20px' }}>
            <MenuItem label={t('signOut')} onClick={handleLogout} />
          </div>
        </nav>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 15px',
      borderRadius: '8px',
      backgroundColor: active ? 'var(--accent-light, #EFE9FF)' : 'transparent',
      color: active ? 'var(--accent)' : '#333',
      border: 'none',
      fontWeight: active ? 'bold' : 'normal',
      fontSize: '1rem',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'background-color 0.2s, color 0.2s',
    }}
  >
    {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
    {label}
  </button>
);

// --- FabMenu Component ---
export const FabMenu = ({ onAction, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const level = user?.accessLevel || 1;

  const handleActionClick = (action) => {
    onAction(action);
    setIsOpen(false);
  };

  return (
    <div style={fabContainerStyle}>
      {isOpen && (
        <div style={fabActionsStyle}>
          {level >= 3 && (
            <FabAction icon="📅" label="Add Schedule" onClick={() => handleActionClick('add_schedule')} />
          )}
          <FabAction icon="⬆️" label={t('upload')} onClick={() => handleActionClick('upload')} />
          <FabAction icon="📄" label={t('uploadDocument')} onClick={() => handleActionClick('upload_doc')} />
          <FabAction icon="💡" label={t('feedback')} onClick={() => handleActionClick('feedback')} />
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} style={fabButtonStyle}>
        <Icon.Plus />
      </button>
    </div>
  );
};

const FabAction = ({ icon, label, onClick }) => (
  <button onClick={onClick} style={fabActionButtonStyle}>
    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
    <span style={{ marginLeft: '8px' }}>{label}</span>
  </button>
);

// --- Sheet Component ---
export const Sheet = ({ open, onClose, height = '50%', children }) => {
  const sheetRef = React.useRef(null);

  const handleTouchStart = useCallback((e) => {
    const startY = e.touches[0].clientY;
    const handleTouchMove = (moveEvent) => {
      const currentY = moveEvent.touches[0].clientY;
      if (currentY > startY + 50) { // Swipe down threshold
        onClose();
      }
    };
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div style={sheetOverlayStyle} onClick={onClose}>
      <div 
        ref={sheetRef}
        style={sheetContentStyle(height)} 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

// --- useToast Hook ---
export const useToast = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback((message) => {
    setToastMessage(message);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setToastMessage('');
    }, 3000); // Toast disappears after 3 seconds
  }, []);

  const ToastNode = isVisible ? (
    ReactDOM.createPortal(
      <div style={toastStyle}>
        {toastMessage}
      </div>,
      document.body
    )
  ) : null;

  return { show, node: ToastNode };
};

// --- Styles ---
const topBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 16px',
  backgroundColor: 'white',
  borderBottom: '1px solid #eee',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  zIndex: 1000,
};

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: 'var(--accent)',
  padding: '5px',
};

const scopeSelectStyle = {
  border: 'none',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: 'var(--accent)',
  backgroundColor: 'transparent',
  textAlign: 'center',
  cursor: 'pointer',
  padding: '5px 10px',
  borderRadius: '5px',
  outline: 'none',
};

const titleStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#333',
};

const drawerOverlayStyle = (open) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: open ? 'rgba(0,0,0,0.5)' : 'transparent',
  visibility: open ? 'visible' : 'hidden',
  transition: 'background-color 0.3s, visibility 0.3s',
  zIndex: 2000,
});

const drawerContentStyle = (open) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: '280px',
  backgroundColor: 'white',
  transform: open ? 'translateX(0)' : 'translateX(-100%)',
  transition: 'transform 0.3s ease-out',
  boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  zIndex: 2001,
  display: 'flex',
  flexDirection: 'column',
});

const fabContainerStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1500,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '10px',
};

const fabButtonStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent)',
  color: 'white',
  fontSize: '2rem',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const fabActionsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '10px',
};

const fabActionButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'white',
  color: '#333',
  padding: '8px 15px',
  borderRadius: '20px',
  border: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '500',
};

const sheetOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 3000,
};

const sheetContentStyle = (height) => ({
  backgroundColor: 'white',
  width: '100%',
  height: height,
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
});

const toastStyle = {
  position: 'fixed',
  bottom: '80px', // Above the FabMenu
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#333',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  zIndex: 4000,
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  animation: 'fadeInOut 3s forwards', // Simple animation
};

// Add a basic keyframe animation for toast
const styleSheet = document.styleSheets[0];
const fadeInOutKeyframes = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    10% { opacity: 1; transform: translateX(-50%) translateY(0); }
    90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
  }
`;
styleSheet.insertRule(fadeInOutKeyframes, styleSheet.cssRules.length);