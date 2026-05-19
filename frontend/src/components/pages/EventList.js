import React from 'react';
import Layout from '../common/Layout';
import Card from '../common/Card';
import Button from '../common/Button';
import { useEvents } from '../../context/EventContext';
import './EventList.css';

function EventsList() {
    const { events, loading, error } = useEvents();

    if (loading) return <Layout><div>Loading events...</div></Layout>
    if (error) return <Layout><div>Error loading events: {error}</div></Layout>

    return (
    <Layout>
      <div className="events-list">
        <h1>Upcoming Events</h1>

        {events.length === 0 ? (
          <p>No events yet. Please check back later.</p>
        ) : (
            <div className="events-grid">
                {events.map(event => (
                    <Card
                    key={event.id}
                    title={event.title}
                    footer={
<Button variant="primary">View Details</Button>
                }
              >
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EventsList;
