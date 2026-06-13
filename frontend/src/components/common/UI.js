import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as Icon from './Icons';
import { useLanguage } from '../../context/LanguageContext';

const RED_DOT_STYLE = {
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  width: '10px',
  height: '10px',
  backgroundColor: '#ff3b30',
  borderRadius: '50%',
  border: '2px solid white',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
};

export const TopHeader = ({ title, onProfile, user, hasNewInbox = false, hasNewMessages = false, onAction, route, onNavigate }) => {
  const { t } = useLanguage();
  const level = user?.accessLevel || 1;

  const tabs = [
    { id: 'home', icon: <Icon.Home />, label: t('home') || 'Home' },
    { id: 'mgmt', icon: <Icon.Management />, label: t('management') || 'Management' },
    { id: 'members', icon: <Icon.Church />, label: t('church') || 'Church' },
    { id: 'inbox', icon: <Icon.Inbox />, label: t('inbox') || 'Inbox' },
  ];

  return (
    <div style={{ ...topHeaderStyle, display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--ink)', minWidth: 'fit-content' }}>
        {title || 'Church Central'}
      </div>
      
      {/* Navigation Tabs - Center */}
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', gap: '8px', minWidth: '300px' }}>
        {tabs.map(tab => {
          const isActive = route === tab.id || (tab.id === 'menu' && !tabs.map(t=>t.id).includes(route) && route !== 'home' && route !== 'mgmt' && route !== 'members' && route !== 'inbox');
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ fontSize: '1.2rem', color: isActive ? 'var(--accent)' : 'var(--ink-3)' }}>
                {tab.icon}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: isActive ? '600' : '500', color: isActive ? 'var(--accent)' : 'var(--ink-3)' }} className="desktop-only">
                {tab.label}
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 'fit-content' }}>
        <button onClick={() => onAction && onAction('upload')} style={iconButtonStyle} title="New Post">
          <Icon.Plus />
        </button>
        <div style={{ position: 'relative' }} onClick={onProfile}>
           <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
             {user?.profilePhoto ? (
               <img src={user.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
               <span style={{ fontSize: '1.2rem', color: 'var(--accent)' }}><Icon.User /></span>
             )}
           </div>
           {(hasNewInbox || hasNewMessages) && <div style={RED_DOT_STYLE} />}
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
const topHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 20px',
  backgroundColor: 'var(--surface)',
  borderBottom: '1px solid var(--line)',
  zIndex: 1000,
  position: 'sticky',
  top: 0
};

const iconButtonStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: '8px',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: 'var(--ink-2)',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s',
};

const tabBarStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '8px 8px 24px 8px', // Extra padding at bottom for safe area
  backgroundColor: 'var(--surface)',
  borderTop: '1px solid var(--line)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  boxShadow: 'var(--shadow-2)',
};

const tabButtonStyle = (isActive) => ({
  background: 'none',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '8px',
  flex: 1,
});

const sheetOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.4)',
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 3000,
  backdropFilter: 'blur(2px)',
};

const sheetContentStyle = (height) => ({
  backgroundColor: 'var(--surface)',
  width: '100%',
  height: height,
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
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