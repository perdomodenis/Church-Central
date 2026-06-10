import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getUserPhotos } from '../../services/photoService';
import { createDirectChat } from '../../services/chatService';
import { updateUserProfile } from '../../services/userService';

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

const MemberProfileScreen = ({ member, user, onBack, onMessage, onNavigate, onUpdateMember }) => {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [messaging, setMessaging] = useState(false);
  const [memberState, setMemberState] = useState(member);
  const [savingPermissions, setSavingPermissions] = useState(false);

  useEffect(() => {
    setMemberState(member);
  }, [member]);

  useEffect(() => {
    loadPhotos();
  }, [memberState]);

  const handleToggleCheckbox = (field, checked) => {
    setMemberState(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSavePermissions = async () => {
    setSavingPermissions(true);
    try {
      await updateUserProfile(memberState.uid, {
        authorizedPostAsChurch: !!memberState.authorizedPostAsChurch,
        authorizedPostAsDept: !!memberState.authorizedPostAsDept,
        authorizedPostAsCourt: !!memberState.authorizedPostAsCourt
      });
      alert(t('permissionsSavedAlert'));
      if (onUpdateMember) {
        onUpdateMember({
          ...member,
          ...memberState
        });
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Failed to save permissions');
    } finally {
      setSavingPermissions(false);
    }
  };

  const loadPhotos = async () => {
    if (!memberState?.uid) return;
    setLoading(true);
    try {
      const userPhotos = await getUserPhotos(memberState.uid);
      setPhotos(userPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
    setLoading(false);
  };

  const handleStartChat = async () => {
    if (!memberState?.uid) return;
    setMessaging(true);
    try {
      await createDirectChat(user.uid, memberState.uid, `${user.first} ${user.last}`, `${memberState.first} ${memberState.last}`);
      onMessage();
    } catch (error) {
      console.error('Error starting chat:', error);
    }
    setMessaging(false);
  };

  const canAuthorize = user && (user.accessLevel >= 3 || ['Bishop', 'Reverend', 'Admin', 'Pastor', 'Deacon', 'Leader', 'Co-Leader'].includes(user.position));

  if (!memberState) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>{t('loading')}</div>;
  }

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

        {memberState.profilePhoto && (
          <img
            src={memberState.profilePhoto}
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
              backgroundImage: memberState.profilePhoto ? `url(${memberState.profilePhoto})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: '4px solid white'
            }}
          >
            {!memberState.profilePhoto && memberState.first?.[0]}
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 8px 0', color: '#111' }}>
            {memberState.first} {memberState.last}
          </h1>

          {memberState.email && (
            <p style={{ fontSize: '0.95rem', color: '#666', margin: '0 0 16px 0' }}>
              {memberState.email}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Status</span>
                <span style={{
                  color: memberState.status === 'offline' ? '#e11d48' : '#16a34a',
                  fontSize: '0.95rem',
                  fontWeight: '800'
                }}>
                  {memberState.status === 'offline' ? 'Absent' : 'Active'}
                </span>
              </div>

              {/* Role */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Role</span>
                <span style={{ color: '#555', fontSize: '0.9rem', fontWeight: '600' }}>
                  {memberState.position || 'Member'}
                </span>
              </div>

              {/* Department(s) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>{t('departments') || 'Departments'}</span>
                <span style={{ color: '#555', fontSize: '0.9rem' }}>
                  {memberState.depts && memberState.depts.length > 0
                    ? memberState.depts.map(d => t(toCamelCase(d)) || d).join(', ')
                    : memberState.dept ? t(toCamelCase(memberState.dept)) || memberState.dept : 'General'}
                </span>
              </div>

              {/* Court(s) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>{t('courts') || 'Courts'}</span>
                <span style={{ color: '#555', fontSize: '0.9rem' }}>
                  {memberState.courts && memberState.courts.length > 0
                    ? memberState.courts.map(c => t(toCamelCase(c)) || c).join(', ')
                    : memberState.court ? t(toCamelCase(memberState.court)) || memberState.court : 'Glory Court'}
                </span>
              </div>

              {/* Current Project */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Current Project</span>
                <span style={{ color: '#555', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  {memberState.currentProject || 'General Outreach'}
                </span>
              </div>

              {/* Active as member since */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>Active Member Since</span>
                <span style={{ color: '#555', fontSize: '0.9rem' }}>
                  {memberState.joined ? new Date(memberState.joined).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '2025-01-01'}
                </span>
              </div>

              {/* Sub Groups */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '4px' }}>
                <div style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem', marginBottom: '8px' }}>Sub Groups</div>
                <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>• School of the Word Class:</span>
                    <span style={{ fontWeight: '600', color: '#444' }}>
                      {memberState.schoolClass ? t(toCamelCase(memberState.schoolClass)) || memberState.schoolClass : t('notSpecified')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>• District:</span>
                    <span style={{ fontWeight: '600', color: '#444' }}>
                      {memberState.district ? t(toCamelCase(memberState.district)) || memberState.district : t('notSpecified')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>• Gender:</span>
                    <span style={{ fontWeight: '600', color: '#444' }}>
                      {memberState.gender ? t(toCamelCase(memberState.gender)) || memberState.gender : t('notSpecified')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          {/* Posting Permissions Controls for Administrators */}
          {canAuthorize && user.uid !== memberState.uid && (
            <div style={{
              backgroundColor: 'rgba(91, 63, 187, 0.04)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'left',
              border: '1px solid rgba(91, 63, 187, 0.15)',
              boxShadow: '0 4px 12px rgba(91, 63, 187, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <h3 style={{ margin: 0, color: 'var(--ink)', fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔑 {t('authorizationControls')}
              </h3>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.82rem', margin: 0 }}>
                {t('authControlDesc')}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--ink)' }}>
                  <input
                    type="checkbox"
                    checked={!!memberState.authorizedPostAsChurch}
                    onChange={(e) => handleToggleCheckbox('authorizedPostAsChurch', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                  />
                  📢 {t('postAsChurch')}
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--ink)' }}>
                  <input
                    type="checkbox"
                    checked={!!memberState.authorizedPostAsDept}
                    onChange={(e) => handleToggleCheckbox('authorizedPostAsDept', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                  />
                  💼 {t('postAsDept')} ({memberState.dept || 'General'})
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--ink)' }}>
                  <input
                    type="checkbox"
                    checked={!!memberState.authorizedPostAsCourt}
                    onChange={(e) => handleToggleCheckbox('authorizedPostAsCourt', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                  />
                  District ({memberState.court || memberState.campus || 'Glory Court'})
                </label>
              </div>

              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={savingPermissions}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: savingPermissions ? '#ccc' : 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: savingPermissions ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  boxShadow: 'var(--shadow-1)',
                  transition: 'opacity 0.2s'
                }}
              >
                {savingPermissions ? 'Saving...' : t('savePermissions')}
              </button>
            </div>
          )}

          {memberState.bio && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #eee'
            }}>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333', margin: 0 }}>
                {memberState.bio}
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
