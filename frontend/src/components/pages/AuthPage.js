import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../../services/firebase';

function AuthPage({ mode = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [court, setCourt] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    if (isRegister && password !== confirmPassword) {
      setError('Passwörter müssen übereinstimmen.');
      setSubmitting(false);
      return;
    }

    try {
      if (isRegister) {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            court,
            department,
            role,
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Registrierung fehlgeschlagen.');
        }

        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Fehler beim Anmelden.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isRegister ? 'Registrieren' : 'Anmelden'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Passwort
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {isRegister && (
            <>
              <label>
                Passwort bestätigen
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
              <label>
                Court / Standort
                <input
                  type="text"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  placeholder="z. B. Glory Court"
                />
              </label>
              <label>
                Departement
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="z. B. Youth"
                />
              </label>
              <label>
                Rolle
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="z. B. Member"
                />
              </label>
            </>
          )}

          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Bitte warten...' : isRegister ? 'Registrieren' : 'Anmelden'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? (
            <p>
              Bereits Mitglied? <Link to="/login">Hier anmelden</Link>
            </p>
          ) : (
            <p>
              Noch kein Konto? <Link to="/register">Registrieren</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
