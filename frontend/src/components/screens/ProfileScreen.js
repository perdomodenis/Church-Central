import React, { useState, useEffect } from 'react';
import { uploadPhoto, getUserPhotos, deletePhoto } from '../../services/photoService';
import { updateProfilePhoto, updateUserProfile, getUserProfile } from '../../services/userService';

const ProfileScreen = ({ user, onUpdateUser, onSettings, onLogout }) => {
  const initials = `${user.first?.[0] || ''}${user.last?.[0] || ''}`.toUpperCase() || '??';
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [profileData, setProfileData] = useState({
    profilePhoto: null,
    bio: ''
  });
  const [editBio, setEditBio] = useState('');
  const [editUser, setEditUser] = useState({
    first: user.first || '',
    last: user.last || '',
    court: user.court || '',
    dept: user.dept || '',
    position: user.position || '',
    interests: user.interests || []
  });
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    loadPhotos();
    loadProfileData();
  }, [user?.uid]);

  const loadPhotos = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const userPhotos = await getUserPhotos(user.uid);
      setPhotos(userPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
    setLoading(false);
  };

  const loadProfileData = async () => {
    if (!user?.uid) return;
    try {
      const data = await getUserProfile(user.uid);
      setProfileData(data);
      setEditBio(data.bio || '');
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user?.uid) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadPhoto(user.uid, files[i]);
      }
      await loadPhotos();
    } catch (error) {
      console.error('Error uploading photos:', error);
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDeletePhoto = async (fileName) => {
    if (!user?.uid) return;
    try {
      await deletePhoto(user.uid, fileName);
      await loadPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    setUploading(true);
    try {
      const url = await updateProfilePhoto(user.uid, file);
      setProfileData(d => ({ ...d, profilePhoto: url }));
    } catch (error) {
      console.error('Error uploading profile photo:', error);
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleSaveBio = async () => {
    if (!user?.uid) return;
    try {
      await updateUserProfile(user.uid, { bio: editBio });
      setProfileData(d => ({ ...d, bio: editBio }));
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving bio:', error);
    }
  };

  const handleSaveProfileInfo = async () => {
    if (!user?.uid) return;
    try {
      await updateUserProfile(user.uid, {
        first: editUser.first,
        last: editUser.last,
        court: editUser.court,
        dept: editUser.dept,
        position: editUser.position,
        interests: editUser.interests
      });
      onUpdateUser(editUser);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile info:', error);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !editUser.interests.includes(newInterest)) {
      setEditUser(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setEditUser(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  return (
    <div className="profile-screen" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* Header / Avatar Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <label style={{ position: 'relative', cursor: 'pointer', display: 'inline-block' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <div style={{
            ...avatarStyle,
            backgroundImage: profileData.profilePhoto ? `url(${profileData.profilePhoto})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontSize: profileData.profilePhoto ? 0 : '2.5rem'
          }}>
            {!profileData.profilePhoto && initials}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: 'var(--accent)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            📷
          </div>
        </label>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '12px 0 4px 0', color: '#111' }}>
          {user.first} {user.last}
        </h2>
        <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>{user.email}</p>
      </div>

      {/* Church Details Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ ...sectionTitleStyle, margin: 0 }}>Community Info</h3>
          <button
            onClick={() => {
              if (isEditingProfile) {
                handleSaveProfileInfo();
              } else {
                setIsEditingProfile(true);
              }
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            {isEditingProfile ? 'Save' : 'Edit'}
          </button>
        </div>

        {isEditingProfile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                value={editUser.first}
                onChange={(e) => setEditUser(prev => ({ ...prev, first: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                value={editUser.last}
                onChange={(e) => setEditUser(prev => ({ ...prev, last: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Location / Court</label>
              <input
                type="text"
                value={editUser.court}
                onChange={(e) => setEditUser(prev => ({ ...prev, court: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Department</label>
              <input
                type="text"
                value={editUser.dept}
                onChange={(e) => setEditUser(prev => ({ ...prev, dept: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Position</label>
              <input
                type="text"
                value={editUser.position}
                onChange={(e) => setEditUser(prev => ({ ...prev, position: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
        ) : (
          <>
            <div style={infoRowStyle}>
              <span style={labelStyle}>Name</span>
              <span style={valueStyle}>{editUser.first} {editUser.last}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>Location / Court</span>
              <span style={valueStyle}>{editUser.court || 'Not specified'}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>Department</span>
              <span style={valueStyle}>{editUser.dept || 'Not specified'}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>Position</span>
              <span style={valueStyle}>{editUser.position || 'Not specified'}</span>
            </div>
          </>
        )}
      </div>

      {/* Bio Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ ...sectionTitleStyle, margin: 0 }}>About Me</h3>
          <button
            onClick={() => {
              if (isEditMode) {
                handleSaveBio();
              } else {
                setIsEditMode(true);
              }
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            {isEditMode ? 'Save' : 'Edit'}
          </button>
        </div>

        {isEditMode ? (
          <textarea
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder="Write something about yourself..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        ) : (
          <p style={{
            color: profileData.bio ? '#111' : '#999',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            margin: 0,
            fontStyle: profileData.bio ? 'normal' : 'italic'
          }}>
            {profileData.bio || 'No description yet. Click Edit to add one.'}
          </p>
        )}
      </div>

      {/* Interests Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={sectionTitleStyle}>Interests</h3>
          <button
            onClick={() => setIsEditingProfile(isEditingProfile ? false : 'interests')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            {isEditingProfile ? 'Done' : 'Edit'}
          </button>
        </div>

        {isEditingProfile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add new interest"
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                style={{...inputStyle, flex: 1}}
              />
              <button
                onClick={handleAddInterest}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                +
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {editUser.interests.length > 0 ? (
                editUser.interests.map((interest, idx) => (
                  <div key={idx} style={{ ...interestTagStyle, display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px' }}>
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: 0
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>No interests added yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {editUser.interests && editUser.interests.length > 0 ? (
              editUser.interests.map((interest, idx) => (
                <span key={idx} style={interestTagStyle}>
                  {interest}
                </span>
              ))
            ) : (
              <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>No interests added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Photos Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={sectionTitleStyle}>My Photos</h3>

        <label style={{ display: 'block', marginBottom: '16px' }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <div style={{
            padding: '12px 16px',
            backgroundColor: uploading ? '#e0e0e0' : 'var(--accent)',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}>
            {uploading ? 'Uploading...' : '+ Add Photo'}
          </div>
        </label>

        {loading ? (
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Loading photos...</p>
        ) : photos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {photos.map((photo, index) => (
              <div key={photo.name} style={{ position: 'relative', cursor: 'pointer' }}>
                <img
                  src={photo.url}
                  alt="User photo"
                  onClick={() => setSelectedPhotoIndex(index)}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>No photos yet.</p>
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
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src={photos[selectedPhotoIndex].url}
              alt="Full size photo"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '75vh',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />

            {/* Navigation and Delete Controls */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '20px',
              alignItems: 'center'
            }}>
              {/* Previous Button */}
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                ‹
              </button>

              {/* Delete Button */}
              <button
                onClick={() => {
                  const photoToDelete = photos[selectedPhotoIndex].name;
                  handleDeletePhoto(photoToDelete);
                  setSelectedPhotoIndex(null);
                }}
                style={{
                  backgroundColor: '#e74c3c',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                🗑️ Delete
              </button>

              {/* Next Button */}
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                ›
              </button>
            </div>

            {/* Close Button */}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={onSettings} style={primaryButtonStyle}>
          Account Settings
        </button>
        <button onClick={onLogout} style={logoutButtonStyle}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

// Styles
const avatarStyle = {
  width: '220px',
  height: '220px',
  borderRadius: '110px',
  backgroundColor: 'var(--accent)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '4rem',
  fontWeight: '800',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '32px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const sectionTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#111',
  margin: '0 0 16px 0',
  borderBottom: '1px solid #eee',
  paddingBottom: '8px'
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const labelStyle = { color: '#666', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px', display: 'block' };
const valueStyle = { color: '#111', fontSize: '0.9rem', fontWeight: '700' };

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
};

const interestTagStyle = {
  backgroundColor: 'rgba(91, 63, 187, 0.08)',
  color: 'var(--accent)',
  padding: '6px 14px',
  borderRadius: '100px',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const primaryButtonStyle = { width: '100%', padding: '16px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' };

const logoutButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#FFF0F0', color: '#D32F2F', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' };

export default ProfileScreen;