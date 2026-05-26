import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import './Header.css';

function Header() {
    const {user} = useAuth();

    return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <h1>Church Central</h1>
        </Link>

        {/* Navigation */}
        <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            {user && <Link to="/dashboard">Dashboard</Link>}
        </nav>

        {/* User info */}
        {user&& (
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            </div>
        )}
      </div>
    </header>
  );
}

export default Header;