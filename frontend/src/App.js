import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, onAuthStateChanged } from './services/firebase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsList from './components/pages/EventList';
import Header from './components/common/Header';

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
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
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
              </>
            }
          />
          <Route path="/events" element={<EventsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
