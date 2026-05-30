import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as Icon from './Icons';

// --- TopBar Component ---
export const TopBar = ({ scope, scopeOptions, title, onScope, onMenu, onProfile }) => {
  return (
    <div style={topBarStyle}>
      <button onClick={onMenu} style={iconButtonStyle}>
        <Icon.Menu />
      </button>
      <div style={{ flex: 1, textAlign: 'center' }}>
        {scopeOptions ? (
          <select
            value={scope}
            onChange={(e) => onScope(e.target.value)}
            style={scopeSelectStyle}
          >
            {scopeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <span style={titleStyle}>{title}</span>
        )}
      </div>
      <button onClick={onProfile} style={iconButtonStyle}>
        <Icon.User />
      </button>
    </div>
  );
};

// --- MenuDrawer Component ---
export const MenuDrawer = ({ open, onClose, route, onNavigate, onLogout }) => {
  const handleNavigate = (newRoute) => {
    onNavigate(newRoute);
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div style={drawerOverlayStyle(open)} onClick={onClose}>
      <div style={drawerContentStyle(open)} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: 'var(--accent)' }}>Church Central</h3>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 20px' }}>
          <MenuItem icon={<Icon.Home />} label="Home" active={route === 'home'} onClick={() => handleNavigate('home')} />
          <MenuItem icon={<Icon.Inbox />} label="Inbox" active={route === 'inbox'} onClick={() => handleNavigate('inbox')} />
          <MenuItem icon="💬" label="Messages" active={route === 'messages'} onClick={() => handleNavigate('messages')} />
          <MenuItem icon="👥" label="Members" active={route === 'members'} onClick={() => handleNavigate('members')} />
          <MenuItem icon={<Icon.Calendar />} label="Schedule" active={route === 'schedule'} onClick={() => handleNavigate('schedule')} />
          <MenuItem icon={<Icon.Appointment />} label="Appointments" active={route === 'appointment'} onClick={() => handleNavigate('appointment')} />
          <MenuItem icon={<Icon.Calendar />} label="Events" active={route === 'events'} onClick={() => handleNavigate('events')} />
          <MenuItem icon={<Icon.Management />} label="Management" active={route === 'mgmt'} onClick={() => handleNavigate('mgmt')} />
          <MenuItem icon="💧" label="Baptism" active={route === 'baptism'} onClick={() => handleNavigate('baptism')} />
          <MenuItem icon={<Icon.Profile />} label="Profile" active={route === 'profile'} onClick={() => handleNavigate('profile')} />
          <MenuItem icon={<Icon.Feedback />} label="Feedback" active={route === 'feedback'} onClick={() => handleNavigate('feedback')} />
          <MenuItem icon="🔧" label="Debug" active={route === 'debug'} onClick={() => handleNavigate('debug')} />
          <div style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '20px' }}>
            <MenuItem label="Sign Out" onClick={handleLogout} />
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
export const FabMenu = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (action) => {
    onAction(action);
    setIsOpen(false);
  };

  return (
    <div style={fabContainerStyle}>
      {isOpen && (
        <div style={fabActionsStyle}>
          <FabAction icon="⬆️" label="Upload" onClick={() => handleActionClick('upload')} />
          <FabAction icon="👥" label="Invite Member" onClick={() => handleActionClick('member')} />
          <FabAction icon="💡" label="Feedback" onClick={() => handleActionClick('feedback')} />
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
  appearance: 'none', // Remove default arrow
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