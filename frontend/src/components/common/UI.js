import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as Icon from './Icons';
import { useLanguage } from '../../context/LanguageContext';

export const TopHeader = ({ title, onProfile, user, hasNewInbox = false, hasNewMessages = false, onAction, route, onNavigate }) => {
  const { t } = useLanguage();
  const level = user?.accessLevel || 1;

  const tabs = [
    { id: 'home', icon: <Icon.Home />, label: t('home') || 'Home' },
    ...(level >= 2 ? [{ id: 'mgmt', icon: <Icon.Management />, label: t('management') || 'Management' }] : []),
    { id: 'members', icon: <Icon.Church />, label: t('church') || 'Church' },
    { id: 'inbox', icon: <Icon.Inbox />, label: t('inbox') || 'Inbox' },
  ];

  return (
    <div className="grace-header">
      <div className="grace-header-logo">
        {title || 'Church Central'}
      </div>
      
      {/* Navigation Tabs - Center */}
      <div className="grace-header-nav">
        {tabs.map(tab => {
          const isActive = route === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`grace-nav-btn ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon" style={{ position: 'relative' }}>
                {tab.icon}
                {tab.id === 'inbox' && hasNewInbox && <div className="grace-red-dot" style={{ top: -4, right: -4 }} />}
              </span>
              <span className="nav-label desktop-only">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grace-header-actions">
        <button onClick={() => onAction && onAction('upload')} className="grace-new-post-btn" title="New Post">
          <Icon.Plus />
        </button>
        <div onClick={onProfile} style={{ cursor: 'pointer' }}>
           <div className="grace-profile-avatar">
             {user?.profilePhoto ? (
               <img src={user.profilePhoto} alt="Profile" />
             ) : (
               <span className="avatar-initial">
                 {user?.first ? user.first[0].toUpperCase() : <Icon.User />}
               </span>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export const Sheet = ({ open, onClose, height = '50%', children }) => {
  const sheetRef = React.useRef(null);

  const handleTouchStart = useCallback((e) => {
    const startY = e.touches[0].clientY;
    const handleTouchMove = (moveEvent) => {
      const currentY = moveEvent.touches[0].clientY;
      if (currentY > startY + 50) { 
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
        <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--line)', borderRadius: '2px', margin: '12px auto' }} />
        {children}
      </div>
    </div>,
    document.body
  );
};

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback((message) => {
    setToastMessage(message);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setToastMessage('');
    }, 3000); 
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

// Styles
const sheetOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(42, 47, 77, 0.4)',
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 3000,
  backdropFilter: 'blur(2px)',
};

const sheetContentStyle = (height) => ({
  backgroundColor: 'var(--surface)',
  width: '100%',
  height: height,
  borderTopLeftRadius: 'var(--radius-lg)',
  borderTopRightRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-2)',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
});

const toastStyle = {
  position: 'fixed',
  bottom: '100px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'var(--ink)',
  color: 'var(--surface)',
  padding: '12px 24px',
  borderRadius: '12px',
  fontSize: '0.95rem',
  fontWeight: '600',
  zIndex: 4000,
  whiteSpace: 'nowrap',
  boxShadow: 'var(--shadow-2)',
  animation: 'fadeInOut 3s forwards',
};

try {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    const fadeInOutKeyframes = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        10% { opacity: 1; transform: translateX(-50%) translateY(0); }
        90% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
      }
    `;
    styleSheet.insertRule(fadeInOutKeyframes, styleSheet.cssRules.length);
  }
} catch (e) {}