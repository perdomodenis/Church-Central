import React, { useState, useEffect } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import { useNotification } from './context/NotificationContext';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './services/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { seedLiveData } from './services/liveData';
import { useLanguage } from './context/LanguageContext';
import LoadingScreen from './components/common/LoadingScreen';

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
  DocumentsScreen,
  NLSScreen
} from './components/screens';
import { getAllMembers } from './services/memberService';

// UI Components
import { TopHeader, Sheet, useToast } from './components/common/UI';
import { getAccessLevel } from './services/churchConstants';
import * as Icon from './components/common/Icons';

import { listMembers, upsertUserProfile } from './lib/dataconnect';

const runMigration = async () => {
  if (localStorage.getItem('migrationRun')) return;
  console.log("Starting messy database migration...");
  try {
    const res = await listMembers({ fetchPolicy: 'SERVER_ONLY' });
    const users = res.data.users;
    
    const COURT_MAP = {
      'Downtown Campus': 'Hope Court',
      'Main Campus': 'Praise Court',
      'South Campus': 'Glory Court'
    };
    const DEPT_MAP = {
      'Communications': 'Media Ministry',
      'Bible Study': 'Disciples Training Ministry (DTM)',
      'Community Outreach': 'Outreach',
      'Prayer Ministry': 'Prayer ministry',
      'Worship Team': 'Zamar',
      'Youth Ministry': 'Glorious Vessels of Virtue (GVV)'
    };
    
    for (const u of users) {
      let changed = false;
      let newCourt = u.court;
      let newDept = u.dept;
      
      if (COURT_MAP[u.court]) {
        newCourt = COURT_MAP[u.court];
        changed = true;
      }
      if (DEPT_MAP[u.dept]) {
        newDept = DEPT_MAP[u.dept];
        changed = true;
      }
      
      if (changed) {
        console.log(`Migrating user ${u.first} ${u.last}: ${u.court} -> ${newCourt}, ${u.dept} -> ${newDept}`);
        await upsertUserProfile({
          uid: u.uid,
          email: u.email,
          first: u.first,
          last: u.last,
          court: newCourt,
          dept: newDept
        });
      }
    }
    console.log("Migration complete!");
    localStorage.setItem('migrationRun', 'true');
    alert("Migration complete! You can refresh the page.");
  } catch (e) {
    console.error("Migration failed:", e);
    alert("Migration failed: " + e.message);
  }
};

const ACCENT_PRESETS = [
  ['oklch(45% 0.15 260)', 'oklch(95% 0.05 260)'], // Navy/Teal
  ['#C9974A', '#F6ECD8'],
  ['#2E6B5E', '#E1EFEB'],
  ['#1F4D8F', '#E3ECF7'],
  ['#B8385E', '#FAE3EA'],
  ['#0F172A', '#E2E6EE'],
];

function App() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { hasNewInbox, hasNewMessages } = useNotification();

  // Loading screen state
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [windowLoaded, setWindowLoaded] = useState(document.readyState === 'complete');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [fadeState, setFadeState] = useState('visible');

  // Track page window load
  useEffect(() => {
    runMigration();
    if (document.readyState === 'complete') {
      setWindowLoaded(true);
      return;
    }
    const handleLoad = () => setWindowLoaded(true);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const isFullyLoaded = windowLoaded && profileLoaded;

  useEffect(() => {
    if (isFullyLoaded) {
      // 1.2s minimum duration ensures the user can read the scripture verse
      const timer = setTimeout(() => {
        setFadeState('fade-out');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isFullyLoaded]);

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

  const [uploadOpen, setUploadOpen] = useState(false);
  const [openDocUploadOnMount, setOpenDocUploadOnMount] = useState(false);
  const [openAddScheduleOnMount, setOpenAddScheduleOnMount] = useState(false);
  const [scope, setScope] = useState('News');
  const [selectedMember, setSelectedMember] = useState(null);
  const toast = useToast();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  // Theme
  const [accentColor, setAccentColor] = useState('oklch(45% 0.15 260)');
  const [darkMode, setDarkMode] = useState(false);

  // User data
  const [user, setUser] = useState({
    first: '', last: '', email: '',
    court: '', position: '', dept: '', interests: [],
    gender: '', schoolClass: '',
  });

  // Signup flow
  const [signupStep, setSignupStep] = useState(1);
  const [signupData, setSignupData] = useState({
    first: '', last: '', email: '', zip: '', city: '', pw: '', pw2: '',
    court: '', courts: [], position: '', dept: '', depts: [], district: 'District 1', interests: [],
    gender: '', schoolClass: '',
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
            court: currentProfile.court || 'Glory Court',
            dept: currentProfile.dept || 'General',
            position: currentProfile.position || 'Member',
            bio: currentProfile.bio || '',
            profilePhoto: currentProfile.profilePhoto || '',
            joined: currentProfile.joined || new Date().toISOString().split('T')[0],
            status: currentProfile.status || 'online',
            lastActive: new Date().toISOString(),
            recentActivity: currentProfile.recentActivity || '',
            interests: currentProfile.interests || [],
            paUid: currentProfile.pa?.uid || null,
            gender: currentProfile.gender || '',
            schoolClass: currentProfile.schoolClass || '',
            authorizedPostAsChurch: currentProfile.authorizedPostAsChurch || false,
            authorizedPostAsDept: currentProfile.authorizedPostAsDept || false,
            authorizedPostAsCourt: currentProfile.authorizedPostAsCourt || false,
            authorizedCreateProgram: currentProfile.authorizedCreateProgram || false
          };

          const userData = {
            ...dbUserData,
            isPA,
            accessLevel: getAccessLevel(currentProfile.position || 'Member')
          };

          setUser(userData);

          // Guarantee user exists in PostgreSQL to satisfy foreign key constraints
          await updateUserProfile(authUser.uid, dbUserData);

          try {
            const { syncUserChatGroups } = await import('./services/chatService');
            await syncUserChatGroups(userData);
          } catch (err) {
            console.error('Error syncing groups in App.js:', err);
          }
        } catch (err) {
          console.error('Error syncing user profile to PostgreSQL:', err);
          // Fallback local state if DB connection fails
          setUser({
            uid: authUser.uid,
            email,
            first,
            last,
            court: 'Glory Court',
            dept: 'General',
            position: 'Member',
            interests: [],
            accessLevel: getAccessLevel('Member')
          });
        }
        setRoute(prev => ['login', 'signup', 'welcome', 'forgot', 'forgot-sent'].includes(prev) ? 'home' : prev);
        setProfileLoaded(true);
      } else if (!authLoading) {
        setRoute('login');
        setProfileLoaded(true);
      }
    };

    syncProfile();
  }, [authUser, authLoading]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const [accent, accentSoft] = ACCENT_PRESETS.find(p => p[0] === accentColor) || ACCENT_PRESETS[0];
    root.style.setProperty('--accent', accent);
    if (accentSoft) root.style.setProperty('--accent-soft', accentSoft);
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
      
      // Determine chosen departments that need approval
      const chosenDepts = signupData.depts && signupData.depts.length > 0 ? signupData.depts : (signupData.dept ? [signupData.dept] : []);
      const deptsToRequest = chosenDepts.filter(d => d && d !== 'General');

      const profileData = {
        uid: newUser.uid,
        email: signupData.email,
        first: signupData.first,
        last: signupData.last,
        zip: signupData.zip || '',
        city: signupData.city || '',
        court: signupData.courts?.[0] || signupData.court || 'Glory Court',
        courts: signupData.courts || ['Glory Court'],
        dept: 'General',
        depts: ['General'],
        district: signupData.district || 'District 1',
        gender: signupData.gender || '',
        schoolClass: signupData.schoolClass || '',
        position: signupData.position || 'Member',
        joined: new Date().toISOString().split('T')[0],
        status: 'online',
        lastActive: new Date().toISOString(),
        interests: signupData.interests || []
      };

      const { updateUserProfile } = await import('./services/userService');
      await updateUserProfile(newUser.uid, profileData);

      if (deptsToRequest.length > 0) {
        const { requestDepartmentJoin } = await import('./services/departmentService');
        for (const dept of deptsToRequest) {
          try {
            await requestDepartmentJoin(newUser.uid, `${signupData.first} ${signupData.last}`.trim(), dept);
          } catch (err) {
            console.error(`Failed to request joining department ${dept}:`, err);
          }
        }
      }

      setUser(profileData);
      setRoute('welcome');
      if (deptsToRequest.length > 0) {
        toast.show(`Account created! Request to join ${deptsToRequest.join(', ')} pending approval.`);
      } else {
        toast.show('Account created!');
      }
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
  if (user?.schoolClass) {
    scopeOptions.push('Class');
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

  const handleTransitionEnd = (e) => {
    if (e.propertyName === 'opacity' && fadeState === 'fade-out') {
      setShowLoadingScreen(false);
    }
  };

  if (!profileLoaded) {
    return (
      <LoadingScreen 
        fadeState={fadeState} 
        onTransitionEnd={handleTransitionEnd} 
      />
    );
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
    body = (
      <FeedScreen 
        scope={scope} 
        onScope={setScope} 
        onAction={onAction} 
        user={user} 
        refreshKey={refreshKey} 
        onSelectMember={(m) => {
          setSelectedMember(m);
          handleNavigate('member-profile');
        }}
      />
    );
  } else if (route === 'inbox') {
    body = <InboxScreen />;
  } else if (route === 'messages') {
    body = <MessagesScreen user={user} />;
  } else if (route === 'mgmt') {
    body = <ManagementScreen 
      user={user} 
      openDocUploadOnMount={openDocUploadOnMount} 
      setOpenDocUploadOnMount={setOpenDocUploadOnMount}
      openAddScheduleOnMount={openAddScheduleOnMount}
      setOpenAddScheduleOnMount={setOpenAddScheduleOnMount}
      refreshKey={refreshKey}
      triggerRefresh={triggerRefresh}
    />;
  } else if (route === 'feedback') {
    body = <FeedbackScreen />;
  } else if (route === 'group') {
    body = <SimpleScreen icon={<Icon.Spark />} title="New Life Steps" subtitle="Your discipleship journey" />;
  } else if (route === 'profile') {
    body = <ProfileScreen user={user} onUpdateUser={setUser} onSettings={() => handleNavigate('settings')} onFeedback={() => handleNavigate('feedback')} onLogout={() => { auth.signOut(); handleNavigate('login'); }} />;
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
    body = <MemberSearchScreen user={user} onSelectMember={(m) => { setSelectedMember(m); handleNavigate('member-profile'); }} onNavigate={handleNavigate} />;
  } else if (route === 'member-profile') {
    body = <MemberProfileScreen member={selectedMember} user={user} onBack={() => handleNavigate(level >= 3 ? 'members' : 'home')} onMessage={() => handleNavigate('messages')} onNavigate={handleNavigate} onUpdateMember={(m) => setSelectedMember(m)} />;
  } else {
    body = <FeedScreen scope={scope} onScope={setScope} onAction={onAction} user={user} refreshKey={refreshKey} />;
  }

  return (
    <div className="App app-root" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showLoadingScreen && (
        <LoadingScreen 
          fadeState={fadeState} 
          onTransitionEnd={handleTransitionEnd} 
        />
      )}
      {!inAuth && (
        <TopHeader
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
            route === 'nls' ? t('nls') :
            route === 'documents' ? t('documents') :
            route === 'members' ? t('church') :
            route === 'menu' ? 'Menu' : 'Church Central'
          }
          user={user}
          hasNewInbox={hasNewInbox}
          hasNewMessages={hasNewMessages}
          onProfile={() => handleNavigate('profile')}
          onAction={handleFab}
          route={route}
          onNavigate={handleNavigate}
        />
      )}

      <div className="nice-scroll" style={{ flex: 1, overflow: 'auto', paddingTop: inAuth ? 0 : 6, paddingBottom: inAuth ? 0 : 24, position: 'relative' }}>
        {body}
      </div>

      {!inAuth && (
        <button 
          onClick={() => setIsMessagesOpen(!isMessagesOpen)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-hover)',
            zIndex: 2000,
            cursor: 'pointer',
            border: 'none',
            transition: 'transform 0.2s'
          }}
        >
          <span style={{ fontSize: '1.8rem' }}><Icon.Message /></span>
          {hasNewMessages && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '12px',
              height: '12px',
              backgroundColor: '#ff3b30',
              borderRadius: '50%',
              border: '2px solid var(--accent)'
            }} />
          )}
        </button>
      )}

      {isMessagesOpen && (
        <div className="messages-overlay-panel">
          <MessagesScreen user={user} onClose={() => setIsMessagesOpen(false)} isOverlay={true} />
        </div>
      )}

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

