import React, { useState, useEffect } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './services/firebase';

// Auth Screens
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';
import WelcomeScreen from './components/auth/WelcomeScreen';
import ForgotScreen from './components/auth/ForgotScreen';
import ForgotSent from './components/auth/ForgotSent';

// Main Screens
import FeedScreen from './components/screens/FeedScreen';
import InboxScreen from './components/screens/InboxScreen';
import ScheduleScreen from './components/screens/ScheduleScreen';
import AppointmentScreen from './components/screens/AppointmentScreen';
import ManagementScreen from './components/screens/ManagementScreen';
import UploadScreen from './components/screens/UploadScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import FeedbackScreen from './components/screens/FeedbackScreen';
import SimpleScreen from './components/screens/SimpleScreen';
import BaptismScreen from './components/screens/BaptismScreen';
import EventsScreen from './components/screens/EventsScreen';
import MessagesScreen from './components/screens/MessagesScreen';
import MemberSearchScreen from './components/screens/MemberSearchScreen';
import MemberProfileScreen from './components/screens/MemberProfileScreen';
import DebugScreen from './components/screens/DebugScreen';

// UI Components
import { TopBar, MenuDrawer, FabMenu, Sheet, useToast } from './components/common/UI';
import * as Icon from './components/common/Icons';

const ACCENT_PRESETS = [
  ['#5B3FBB', '#EFE9FF'],
  ['#C9974A', '#F6ECD8'],
  ['#2E6B5E', '#E1EFEB'],
  ['#1F4D8F', '#E3ECF7'],
  ['#B8385E', '#FAE3EA'],
  ['#0F172A', '#E2E6EE'],
];

function App() {
  const { user: authUser, loading: authLoading } = useAuth();

  // Route state machine
  const [route, setRoute] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [scope, setScope] = useState('News');
  const [selectedMember, setSelectedMember] = useState(null);
  const toast = useToast();

  // Theme
  const [accentColor, setAccentColor] = useState('#5B3FBB');
  const [darkMode, setDarkMode] = useState(false);

  // User data
  const [user, setUser] = useState({
    first: '', last: '', email: '',
    court: '', position: '', dept: '', interests: [],
  });

  // Signup flow
  const [signupStep, setSignupStep] = useState(1);
  const [signupData, setSignupData] = useState({
    first: '', last: '', email: '', zip: '', city: '', pw: '', pw2: '',
    court: '', position: '', dept: '', interests: [],
  });

  // Update user on authUser change
  useEffect(() => {
    if (authUser) {
      setUser(u => ({
        ...u,
        uid: authUser.uid,
        email: authUser.email || authUser.displayName || 'User',
        first: authUser.displayName?.split(' ')[0] || 'User',
        last: authUser.displayName?.split(' ')[1] || '',
      }));
      setRoute('home');
    } else if (!authLoading) {
      setRoute('login');
    }
  }, [authUser, authLoading]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const [accent] = ACCENT_PRESETS.find(p => p[0] === accentColor) || ACCENT_PRESETS[0];
    root.style.setProperty('--accent', accent);
    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [accentColor, darkMode]);

  const handleLogin = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.show('Welcome!');
    } catch (error) {
      toast.show('Login error: ' + error.message);
    }
  };

  const handleSignup = async () => {
    try {
      if (signupData.pw !== signupData.pw2) {
        toast.show('Passwords do not match');
        return;
      }
      await createUserWithEmailAndPassword(auth, signupData.email, signupData.pw);
      setUser(u => ({ ...u, ...signupData }));
      setRoute('welcome');
      toast.show('Account created!');
    } catch (error) {
      toast.show('Error: ' + error.message);
    }
  };

  const handleFab = (action) => {
    if (action === 'upload' || action === 'post') {
      setUploadOpen(true);
    } else if (action === 'member') {
      toast.show('Invite link copied');
    } else if (action === 'feedback') {
      setRoute('feedback');
    }
  };

  const onAction = (kind) => {
    if (kind === 'comment') toast.show('Comments will be available soon');
    else if (kind === 'pray') toast.show('🙏 Praying with you');
    else if (kind === 'share') toast.show('Link copied');
  };

  const scopeOptions = ['News', 'Department', 'District', 'Court', 'Leaders', 'All'];
  const inAuth = ['login', 'signup', 'welcome', 'forgot', 'forgot-sent'].includes(route);

  // Render screen
  let body;
  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (route === 'login') {
    body = (
      <LoginScreen
        onLogin={handleLogin}
        onSignup={() => { setSignupStep(1); setRoute('signup'); }}
        onForgot={() => setRoute('forgot')}
      />
    );
  } else if (route === 'forgot') {
    body = <ForgotScreen onBack={() => setRoute('login')} onSent={(em) => { setSignupData(d => ({ ...d, email: em })); setRoute('forgot-sent'); }} />;
  } else if (route === 'forgot-sent') {
    body = <ForgotSent email={signupData.email} onBack={() => setRoute('login')} />;
  } else if (route === 'signup') {
    body = (
      <SignupScreen
        step={signupStep}
        data={signupData}
        onChange={(p) => setSignupData(d => ({ ...d, ...p }))}
        onNext={() => {
          if (signupStep < 3) setSignupStep(s => s + 1);
          else handleSignup();
        }}
        onBack={() => { if (signupStep > 1) setSignupStep(s => s - 1); else setRoute('login'); }}
      />
    );
  } else if (route === 'welcome') {
    body = <WelcomeScreen name={signupData.first || 'friend'} onContinue={() => setRoute('home')} />;
  } else if (route === 'home') {
    body = <FeedScreen scope={scope} onAction={onAction} />;
  } else if (route === 'inbox') {
    body = <InboxScreen />;
  } else if (route === 'messages') {
    body = <MessagesScreen user={user} />;
  } else if (route === 'schedule') {
    body = <ScheduleScreen />;
  } else if (route === 'appointment') {
    body = <AppointmentScreen />;
  } else if (route === 'events') {
    body = <EventsScreen user={user} />;
  } else if (route === 'mgmt') {
    body = <ManagementScreen />;
  } else if (route === 'upload') {
    body = <UploadScreen onCancel={() => setRoute('home')} onDone={() => setRoute('home')} />;
  } else if (route === 'feedback') {
    body = <FeedbackScreen />;
  } else if (route === 'baptism') {
    body = <BaptismScreen user={user} />;
  } else if (route === 'nls') {
    body = <SimpleScreen icon={<Icon.Spark />} title="New Life Steps" subtitle="Your discipleship journey" />;
  } else if (route === 'profile') {
    body = <ProfileScreen user={user} onUpdateUser={setUser} onSettings={() => setRoute('settings')} onLogout={() => { auth.signOut(); setRoute('login'); }} />;
  } else if (route === 'settings') {
    body = (
      <SettingsScreen
        user={user}
        onBack={() => setRoute('profile')}
        accentColor={accentColor} setAccentColor={setAccentColor}
        darkMode={darkMode} setDarkMode={setDarkMode}
      />
    );
  } else if (route === 'members') {
    body = <MemberSearchScreen user={user} onSelectMember={(m) => { setSelectedMember(m); setRoute('member-profile'); }} onNavigate={setRoute} />;
  } else if (route === 'member-profile') {
    body = <MemberProfileScreen member={selectedMember} user={user} onBack={() => setRoute('members')} onMessage={() => setRoute('messages')} onNavigate={setRoute} />;
  } else if (route === 'debug') {
    body = <DebugScreen onBack={() => setRoute('home')} />;
  } else {
    body = <FeedScreen scope={scope} onAction={onAction} />;
  }

  return (
    <div className="App app-root" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!inAuth && (
        <TopBar
          scope={scope}
          scopeOptions={route === 'home' ? scopeOptions : null}
          title={
            route === 'inbox' ? 'Inbox' :
            route === 'messages' ? 'Messages' :
            route === 'schedule' ? 'Schedule' :
            route === 'appointment' ? 'Appointment' :
            route === 'events' ? 'Events' :
            route === 'mgmt' ? 'Management' :
            route === 'baptism' ? 'Baptism' :
            route === 'profile' ? 'Profile' :
            route === 'settings' ? 'Settings' :
            route === 'upload' ? 'Share' :
            route === 'feedback' ? 'Feedback' :
            route === 'nls' ? 'New Steps' : ''
          }
          onScope={setScope}
          onMenu={() => setMenuOpen(true)}
          onProfile={() => setRoute('profile')}
        />
      )}

      <div className="nice-scroll" style={{ flex: 1, overflow: 'auto', paddingTop: inAuth ? 0 : 6, position: 'relative' }}>
        {body}
      </div>

      {!inAuth && route !== 'upload' && <FabMenu onAction={handleFab} />}

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        route={route}
        onNavigate={setRoute}
        onLogout={() => { setMenuOpen(false); auth.signOut(); setRoute('login'); }}
      />

      <Sheet open={uploadOpen} onClose={() => setUploadOpen(false)} height="92%">
        {uploadOpen && <UploadScreen onCancel={() => setUploadOpen(false)} onDone={() => { setUploadOpen(false); toast.show('Shared with the family!'); }} />}
      </Sheet>

      {toast.node}
    </div>
  );
}

export default App;
