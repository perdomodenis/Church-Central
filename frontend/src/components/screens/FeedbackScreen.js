import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Suggestion', 'Bug Report', 'Praise', 'Other'];

const FeedbackScreen = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [category, setCategory] = useState('Suggestion');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const feedbackPayload = {
      category,
      rating,
      message,
      isAnonymous,
      submittedAt: new Date().toISOString()
    };

    if (!isAnonymous && user) {
      feedbackPayload.user = {
        uid: user.uid,
        name: `${user.first} ${user.last}`.trim() || user.email || 'Unknown',
        email: user.email
      };
    }

    // Logic for sending feedback to a backend or service would go here
    console.log('Feedback submitted:', feedbackPayload);
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>{t('thankYou')}</h2>
        <p style={{ opacity: 0.7, lineHeight: '1.5', maxWidth: '300px' }}>
          {t('feedbackSuccessMessage')}
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setRating(0);
            setMessage('');
            setIsAnonymous(false);
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
          {t('sendMoreFeedback')}
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-screen" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>{t('shareFeedback')}</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{t('valueThoughts')}</p>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>{t('rateExperience')}</label>
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
          <label style={labelStyle}>{t('category')}</label>
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
                {t(cat === 'Suggestion' ? 'suggestion' : cat === 'Bug Report' ? 'bugReport' : cat === 'Praise' ? 'praise' : 'other')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>{t('message')}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('tellUsMind')}
            required
            style={textareaStyle}
          />
        </div>

        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }}
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '18px',
              height: '18px',
              accentColor: 'var(--accent)',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '0.9rem', color: '#555', userSelect: 'none', fontWeight: '500' }}>
            {t('submitAnonymously')}
          </span>
        </div>

        <button type="submit" style={submitButtonStyle}>
          {t('submitFeedback')}
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