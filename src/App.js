import React, { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import EventsList from './components/pages/EventsList';

// Inside routes:
<Route path="/events" element={<EventsList />} />
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "church-central-992a7.firebaseapp.com",
  projectId: "church-central-992a7",
  storageBucket: "church-central-992a7.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading">Lädt...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🙏 Church-Central</h1>
        <p>Event Planning & Information Sharing</p>
      </header>

      {user ? (
        <div className="dashboard">
          <p>Willkommen, {user.email}!</p>
          <button onClick={() => auth.signOut()}>Abmelden</button>
        </div>
      ) : (
        <div className="login">
          <p>Bitte melden Sie sich an, um fortzufahren.</p>
          <a href="/login">Zur Anmeldung</a>
        </div>
      )}
    </div>
  );
}

export default App;
