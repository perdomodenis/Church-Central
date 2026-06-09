import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getUserPhotos } from '../../services/photoService';
import { createDirectChat } from '../../services/chatService';

const toCamelCase = (str) => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .split(/[\s-]+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

const MemberProfileScreen = ({ member, user, onBack, onMessage, onNavigate }) => {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [member]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const userPhotos = await getUserPhotos(member.uid);
      setPhotos(userPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
    setLoading(false);
  };

  const handleStartChat = async () => {
    setMessaging(true);
    try {
      await createDirectChat(user.uid, member.uid, `${user.first} ${user.last}`, `${member.first} ${member.last}`);
      onMessage();
    } catch (error) {
      console.error('Error starting chat:', error);
    }
    setMessaging(false);
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      <div style={{ position: 'relative', paddingTop: '20px' }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            zIndex: 10
          }}
        >
          ←
        </button>

        {member.profilePhoto && (
          <img
            src={member.profilePhoto}
            alt="Profile"
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover'
            }}
          />
        )}

        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              backgroundColor: 'var(--accent)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: '800',
              margin: '-60px auto 16px',
              backgroundImage: member.profilePhoto ? `url(${member.profilePhoto})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: '4px solid white'
            }}
          >
            {!member.profilePhoto && member.first?.[0]}
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 8px 0', color: '#111' }}>
            {member.first} {member.last}
          </h1>

          {member.email && (
            <p style={{ fontSize: '0.95rem', color: '#666', margin: '0 0 16px 0' }}>
              {member.email}
            </p>
          )}

            <div style={{
              backgroundColor: '#f9f9f9',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'left',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Active / Absent Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Status</span>
                <span style={{
                  backgroundColor: member.status === 'offline' ? '#ffebee' : '#e8f5e9',
                  color: member.status === 'offline' ? '#c62828' : '#2e7d32',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: member.status === 'offline' ? '#c62828' : '#2e7d32'
                  }} />
                  {member.status === 'offline' ? 'Absent' : 'Active'}
                </span>
              </div>

              {/* Role */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Role</span>
                <span style={{ color: '#555', fontSize: '0.9rem', fontWeight: '600' }}>
                  {member.position || 'Member'}
                </span>
              </div>

              {/* Department(s) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Department</span>
                <span style={{ color: '#555', fontSize: '0.9rem' }}>
                  {member.dept || 'General'}
                </span>
              </div>

              {/* Court(s) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Court</span>
                <span style={{ color: '#555', fontSize: '0.9rem' }}>
                  {member.court || member.campus || 'Main Campus'}
                </span>
              </div>

              {/* Current Project */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Current Project</span>
                <span style={{ color: '#555', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  {member.currentProject || 'General Outreach'}
                </span>
              </div>

              {/* Active as member since */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Active Member Since</span>
                <span style={{ color: '#555', fontSize: '0.9rem' }}>
                  {member.joined ? new Date(member.joined).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '2025-01-01'}
                </span>
              </div>

              {/* Sub Groups */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '4px' }}>
                <div style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem', marginBottom: '8px' }}>Sub Groups</div>
                <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>• School of the Word Class:</span>
                    <span style={{ fontWeight: '600', color: '#444' }}>{member.schoolClass || 'School of the Word - Level 1'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>• District:</span>
                    <span style={{ fontWeight: '600', color: '#444' }}>{member.district || 'Central District'}</span>
                  </div>
                </div>
              </div>
            </div>

          {member.bio && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #eee'
            }}>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333', margin: 0 }}>
                {member.bio}
              </p>
            </div>
          )}

          <button
            onClick={handleStartChat}
            disabled={messaging}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: messaging ? 'not-allowed' : 'pointer',
              opacity: messaging ? 0.7 : 1,
              marginBottom: '12px'
            }}
          >
            💬 {t('sendMessage')}
          </button>
        </div>
      </div>

      {/* Galería de fotos */}
      <div style={{ padding: '24px', paddingTop: '0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', color: '#111' }}>
          {t('photos')}
        </h3>

        {loading ? (
          <p style={{ color: '#999', fontSize: '0.9rem' }}>{t('loadingPhotos')}</p>
        ) : photos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
            {photos.map((photo, index) => (
              <div
                key={photo.name}
                onClick={() => setSelectedPhotoIndex(index)}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={photo.url}
                  alt="Member photo"
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>{t('noPhotosYet')}</p>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhotoIndex !== null && photos.length > 0 && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
          >
            <img
              src={photos[selectedPhotoIndex].url}
              alt="Full size photo"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />

            {photos.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '20px',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length)}
                  style={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#333'
                  }}
                >
                  ‹
                </button>

                <button
                  onClick={() => setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length)}
                  style={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#333'
                  }}
                >
                  ›
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedPhotoIndex(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfileScreen;
