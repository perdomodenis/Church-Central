import React from 'react';
import Layout from '../common/Layout';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

function Home() {
  const { user } = useAuth();

    return (
        <Layout>
            <div className="home">
                <h1>Welcome to the Home Page</h1>
                user && <p>Hello, {user.name}!</p>

                <section className="hero">
                    <h2>Stay Connected</h2>
                <p>Join events, view announcements, and connect with other members of our community.</p>
                </section>

                <section className="upcoming-events">
                    <h2>Upcoming Events</h2>
                    <p>Events will appear once you build the Events page.</p>
                </section>
            </div>
        </Layout>
    );
}

export default Home;