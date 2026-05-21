import React from 'react';
import './App.css';
import { auth, signOut } from './services/firebase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsList from './components/pages/EventList';
import Header from './components/common/Header';
import AuthPage from './components/pages/AuthPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

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
                    <button onClick={() => signOut(auth)}>Abmelden</button>
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
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
