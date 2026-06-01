import React, { useState } from 'react';

const CATEGORIES = ['Suggestion', 'Bug Report', 'Praise', 'Other'];

const FeedbackScreen = () => {
  const [category, setCategory] = useState('Suggestion');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Logic for sending feedback to a backend or service would go here
    console.log('Feedback submitted:', { category, rating, message });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="feedback-screen" style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🙏</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>Thank You!</h2>
        <p style={{ opacity: 0.7, lineHeight: '1.5', maxWidth: '300px' }}>
          Your feedback helps us make Church Central better for everyone in our community.
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setRating(0);
            setMessage('');
          }}
          style={{ 
            marginTop: '32px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Send More Feedback
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-screen" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Share Feedback</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>We value your thoughts on how to improve our digital home.</p>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Rate your Experience</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: rating >= star ? '#FFD700' : '#ddd',
                  transition: 'color 0.2s'
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: '1px solid',
                  borderColor: category === cat ? 'var(--accent)' : '#ddd',
                  backgroundColor: category === cat ? 'var(--accent)' : 'white',
                  color: category === cat ? 'white' : '#666',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            required
            style={textareaStyle}
          />
        </div>

        <button type="submit" style={submitButtonStyle}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

const cardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' };
const labelStyle = { fontSize: '0.9rem', fontWeight: '700', color: '#111' };
const textareaStyle = { width: '100%', height: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '8px', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit', outlineColor: 'var(--accent)', resize: 'none' };
const submitButtonStyle = { width: '100%', padding: '14px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

export default FeedbackScreen;