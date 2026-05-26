import React from 'react';
import Layout from '../common/Layout';
import Card from '../common/Card';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="home">
        <h1>Willkommen bei Church Central</h1>
        
        {user && (
          <p className="welcome-text">
            Hallo, {user.email}! 👋
          </p>
        )}

        <section className="hero">
          <h2>Bleiben Sie mit Ihrer Gemeinde verbunden</h2>
          <p>Verwalten Sie Veranstaltungen, teilen Sie Dokumente und bleiben Sie informiert.</p>
          <Link to="/events">
            <Button>Veranstaltungen ansehen</Button>
          </Link>
        </section>

        <section className="info-grid">
          <Card title="📅 Veranstaltungen">
            <p>Besuchen Sie alle Gemeindeveranstaltungen und melden Sie sich an.</p>
            <Link to="/events" className="link">
              Zu Veranstaltungen →
            </Link>
          </Card>

          <Card title="📄 Dokumente">
            <p>Greifen Sie auf wichtige Dokumente und Ankündigungen zu.</p>
            <Link to="/documents" className="link">
              Zu Dokumenten →
            </Link>
          </Card>

          <Card title="👥 Profil">
            <p>Verwalten Sie Ihr Profil und Benachrichtigungen.</p>
            <Link to="/profile" className="link">
              Zum Profil →
            </Link>
          </Card>
        </section>
      </div>
    </Layout>
  );
}

export default Home;