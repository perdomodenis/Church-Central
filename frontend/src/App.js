import React, { useState, useEffect } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import { useNotification } from './context/NotificationContext';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './services/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { seedLiveData } from './services/liveData';
import { useLanguage } from './context/LanguageContext';

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
  DebugScreen,
  DocumentsScreen,
  NLSScreen
} from './components/screens';
import { getAllMembers } from './services/memberService';

// UI Components
import { TopBar, MenuDrawer, FabMenu, Sheet, useToast } from './components/common/UI';
import { getAccessLevel } from './services/churchConstants';
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
  const { t } = useLanguage();
  const { hasNewInbox } = useNotification();

  // Route state machine
  const [route, setRoute] = useState(() => localStorage.getItem('lastRoute') || 'login');

  useEffect(() => {
    localStorage.setItem('lastRoute', route);
  }, [route]);

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const handleNavigate = (newRoute) => {
    if (newRoute === 'home' && route === 'home') {
      triggerRefresh();
    } else {
      setRoute(newRoute);
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [openDocUploadOnMount, setOpenDocUploadOnMount] = useState(false);
  const [openAddScheduleOnMount, setOpenAddScheduleOnMount] = useState(false);
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
          
          let isPA = false;
          try {
            const allMembers = await getAllMembers();
            isPA = allMembers.some(m => m.pa?.uid === authUser.uid);
          } catch (err) {
            console.error('Error checking if user is PA:', err);
          }

          const dbUserData = {
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
            interests: currentProfile.interests || [],
            paUid: currentProfile.pa?.uid || null
          };

          const userData = {
            ...dbUserData,
            isPA,
            accessLevel: getAccessLevel(currentProfile.position || 'Member')
          };

          setUser(userData);

          // Guarantee user exists in PostgreSQL to satisfy foreign key constraints
          await updateUserProfile(authUser.uid, dbUserData);
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
            interests: [],
            accessLevel: getAccessLevel('Member')
          });
        }
        setRoute(prev => ['login', 'signup', 'welcome', 'forgot', 'forgot-sent'].includes(prev) ? 'home' : prev);
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

  // Auto-load live data on first mount (only once per device)
  // useEffect(() => {
  //   const hasLoadedData = localStorage.getItem('liveDataLoaded');
  //   if (!hasLoadedData && authUser) {
  //     // Set the flag synchronously *before* the async call to prevent
  //     // React 18 StrictMode or rapid refreshes from triggering it twice.
  //     localStorage.setItem('liveDataLoaded', 'true');
  //     
  //     seedLiveData().then(() => {
  //       console.log('✅ Live data loaded automatically');
  //     }).catch(err => {
  //       console.error('Error loading live data:', err);
  //     });
  //   }
  // }, [authUser]);

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
    } else if (action === 'upload_doc') {
      setOpenDocUploadOnMount(true);
      setRoute('documents');
    } else if (action === 'feedback') {
      setRoute('feedback');
    } else if (action === 'add_schedule') {
      setOpenAddScheduleOnMount(true);
      setRoute('schedule');
    }
  };

  const onAction = (kind) => {
    if (kind === 'comment') toast.show('Comments will be available soon');
    else if (kind === 'pray') toast.show('❤️ Post liked');
    else if (kind === 'share') toast.show('Link copied');
    else if (kind === 'compose') setUploadOpen(true);
  };

  const level = user?.accessLevel || 1;

  let scopeOptions = ['News', 'District', 'Court'];
  if (level >= 2) {
    scopeOptions = ['News', 'Department', 'District', 'Court'];
  }
  if (level >= 3) {
    scopeOptions.push('Leaders');
  }
  if (level >= 4) {
    scopeOptions.push('All');
  }

  const inAuth = ['login', 'signup', 'welcome', 'forgot', 'forgot-sent'].includes(route);

  // Render screen
  let body;
  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  const AccessDenied = ({ requiredLevel }) => (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Access Denied</h2>
      <p>This feature requires Access Level {requiredLevel}.<br/>Your current level is {level}.</p>
    </div>
  );

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
    body = <WelcomeScreen name={signupData.first || 'friend'} onContinue={() => handleNavigate('home')} />;
  } else if (route === 'home') {
    body = <FeedScreen scope={scope} onScope={setScope} onAction={onAction} user={user} refreshKey={refreshKey} />;
  } else if (route === 'inbox') {
    body = <InboxScreen />;
  } else if (route === 'messages') {
    body = <MessagesScreen user={user} />;
  } else if (route === 'documents') {
    body = level >= 2 ? (
      <DocumentsScreen 
        user={user} 
        openUploadOnMount={openDocUploadOnMount} 
        onCloseUploadOnMount={() => setOpenDocUploadOnMount(false)} 
      />
    ) : <AccessDenied requiredLevel={2} />;
  } else if (route === 'schedule') {
    body = level >= 2 ? (
      <ScheduleScreen 
        user={user}
        openAddEventOnMount={openAddScheduleOnMount}
        onCloseAddEventOnMount={() => setOpenAddScheduleOnMount(false)}
      />
    ) : <AccessDenied requiredLevel={2} />;
  } else if (route === 'appointment') {
    body = <AppointmentScreen user={user} />;
  } else if (route === 'events') {
    body = <EventsScreen user={user} />;
  } else if (route === 'mgmt') {
    body = (level >= 3 || user.isPA) ? <ManagementScreen user={user} /> : <AccessDenied requiredLevel={3} />;
  } else if (route === 'feedback') {
    body = <FeedbackScreen />;
  } else if (route === 'baptism') {
    body = level >= 2 ? <BaptismScreen user={user} /> : <AccessDenied requiredLevel={2} />;
  } else if (route === 'nls') {
    body = <NLSScreen user={user} />;
  } else if (route === 'group') {
    body = <SimpleScreen icon={<Icon.Spark />} title="New Life Steps" subtitle="Your discipleship journey" />;
  } else if (route === 'profile') {
    body = <ProfileScreen user={user} onUpdateUser={setUser} onSettings={() => handleNavigate('settings')} onLogout={() => { auth.signOut(); handleNavigate('login'); }} />;
  } else if (route === 'settings') {
    body = (
      <SettingsScreen
        user={user}
        onBack={() => handleNavigate('profile')}
        accentColor={accentColor} setAccentColor={setAccentColor}
        darkMode={darkMode} setDarkMode={setDarkMode}
      />
    );
  } else if (route === 'members') {
    body = level >= 3 ? <MemberSearchScreen user={user} onSelectMember={(m) => { setSelectedMember(m); handleNavigate('member-profile'); }} onNavigate={handleNavigate} /> : <AccessDenied requiredLevel={3} />;
  } else if (route === 'member-profile') {
    body = level >= 3 ? <MemberProfileScreen member={selectedMember} user={user} onBack={() => handleNavigate('members')} onMessage={() => handleNavigate('messages')} onNavigate={handleNavigate} onUpdateMember={(m) => setSelectedMember(m)} /> : <AccessDenied requiredLevel={3} />;
  } else if (route === 'debug') {
    body = level >= 4 ? <DebugScreen onBack={() => handleNavigate('home')} /> : <AccessDenied requiredLevel={4} />;
  } else {
    body = <FeedScreen scope={scope} onScope={setScope} onAction={onAction} user={user} refreshKey={refreshKey} />;
  }

  return (
    <div className="App app-root" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!inAuth && (
        <TopBar
          route={route}
          onNavigate={handleNavigate}
          scope={scope}
          scopeOptions={route === 'home' ? scopeOptions : null}
          user={user}
          hasNewInbox={hasNewInbox}
          title={
            route === 'inbox' ? t('inbox') :
            route === 'messages' ? t('messages') :
            route === 'schedule' ? t('schedule') :
            route === 'appointment' ? t('appointments') :
            route === 'events' ? t('events') :
            route === 'mgmt' ? t('management') :
            route === 'baptism' ? t('baptism') :
            route === 'profile' ? t('profile') :
            route === 'settings' ? t('settings') :
            route === 'feedback' ? t('feedback') :
            route === 'nls' ? t('nls') : ''
          }
          onScope={setScope}
          onMenu={() => setMenuOpen(true)}
          onProfile={() => handleNavigate('profile')}
        />
      )}

      <div className="nice-scroll" style={{ flex: 1, overflow: 'auto', paddingTop: inAuth ? 0 : 6, position: 'relative' }}>
        {body}
      </div>

      {!inAuth && <FabMenu onAction={handleFab} user={user} />}

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        route={route}
        onNavigate={handleNavigate}
        onLogout={() => { setMenuOpen(false); auth.signOut(); handleNavigate('login'); }}
        user={user}
      />

      {uploadOpen && (
        <UploadScreen
          user={user}
          onCancel={() => setUploadOpen(false)}
          onDone={() => {
            setUploadOpen(false);
            triggerRefresh();
            toast.show('Shared with the family!');
          }}
        />
      )}

      {toast.node}
    </div>
  );
}

export default App;
