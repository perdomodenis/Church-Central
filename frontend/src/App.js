import React, { useState, useEffect } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './services/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { seedLiveData } from './services/liveData';

// Auth Screens
import { LoginScreen, SignupScreen, WelcomeScreen, ForgotScreen, ForgotSent } from './components/auth';

// Main Screens
import {
  FeedScreen,
  InboxScreen,
  ScheduleScreen,
  AppointmentScreen,
  ManagementScreen,
  UploadScreen,
  ProfileScreen,
  SettingsScreen,
  FeedbackScreen,
  SimpleScreen,
  BaptismScreen,
  EventsScreen,
  MessagesScreen,
  MemberSearchScreen,
  MemberProfileScreen,
  DebugScreen
} from './components/screens';

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

  // Update user on authUser change and sync with PostgreSQL
  useEffect(() => {
    const syncProfile = async () => {
      if (authUser) {
        const email = authUser.email || '';
        const displayName = authUser.displayName || '';
        const first = displayName.split(' ')[0] || email.split('@')[0] || 'User';
        const last = displayName.split(' ').slice(1).join(' ') || '';

        try {
          const { getUserProfile, updateUserProfile } = await import('./services/userService');
          
          // Fetch current profile in PostgreSQL
          const currentProfile = await getUserProfile(authUser.uid);
          
          const userData = {
            uid: authUser.uid,
            email: currentProfile.email || email,
            first: currentProfile.first || first,
            last: currentProfile.last || last,
            zip: currentProfile.zip || '',
            city: currentProfile.city || '',
            court: currentProfile.court || 'Main Campus',
            dept: currentProfile.dept || 'General',
            position: currentProfile.position || 'Member',
            bio: currentProfile.bio || '',
            profilePhoto: currentProfile.profilePhoto || '',
            joined: currentProfile.joined || new Date().toISOString().split('T')[0],
            status: currentProfile.status || 'online',
            lastActive: new Date().toISOString(),
            recentActivity: currentProfile.recentActivity || '',
            interests: currentProfile.interests || []
          };

          setUser(userData);

          // Guarantee user exists in PostgreSQL to satisfy foreign key constraints
          await updateUserProfile(authUser.uid, userData);
        } catch (err) {
          console.error('Error syncing user profile to PostgreSQL:', err);
          // Fallback local state if DB connection fails
          setUser({
            uid: authUser.uid,
            email,
            first,
            last,
            court: 'Main Campus',
            dept: 'General',
            position: 'Member',
            interests: []
          });
        }
        setRoute('home');
      } else if (!authLoading) {
        setRoute('login');
      }
    };

    syncProfile();
  }, [authUser, authLoading]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const [accent] = ACCENT_PRESETS.find(p => p[0] === accentColor) || ACCENT_PRESETS[0];
    root.style.setProperty('--accent', accent);
    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [accentColor, darkMode]);

  // Auto-load live data on first mount (only once)
  useEffect(() => {
    const hasLoadedData = sessionStorage.getItem('liveDataLoaded');
    if (!hasLoadedData && authUser) {
      seedLiveData().then(() => {
        sessionStorage.setItem('liveDataLoaded', 'true');
        console.log('✅ Live data loaded automatically');
      }).catch(err => {
        console.log('Note: Live data already exists or will be loaded from Firebase');
      });
    }
  }, [authUser]);

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
      const credential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.pw);
      const newUser = credential.user;

      // Save custom signup fields to PostgreSQL immediately
      const profileData = {
        uid: newUser.uid,
        email: signupData.email,
        first: signupData.first,
        last: signupData.last,
        zip: signupData.zip || '',
        city: signupData.city || '',
        court: signupData.court || 'Main Campus',
        dept: signupData.dept || 'General',
        position: signupData.position || 'Member',
        joined: new Date().toISOString().split('T')[0],
        status: 'online',
        lastActive: new Date().toISOString(),
        interests: signupData.interests || []
      };

      const { updateUserProfile } = await import('./services/userService');
      await updateUserProfile(newUser.uid, profileData);

      setUser(profileData);
      setRoute('welcome');
      toast.show('Account created!');
    } catch (error) {
      toast.show('Error: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      setUser(u => ({
        ...u,
        uid: googleUser.uid,
        email: googleUser.email || '',
        first: googleUser.displayName?.split(' ')[0] || 'User',
        last: googleUser.displayName?.split(' ').slice(1).join(' ') || '',
      }));

      toast.show('Welcome with Google!');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      toast.show('Google login error: ' + error.message);
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
        onGoogleLogin={handleGoogleLogin}
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
