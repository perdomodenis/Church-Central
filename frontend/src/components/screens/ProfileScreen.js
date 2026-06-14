import React, { useState, useEffect } from 'react';
import { uploadPhoto, getUserPhotos, deletePhoto } from '../../services/photoService';
import { updateProfilePhoto, updateUserProfile, getUserProfile } from '../../services/userService';
import { COURTS, DEPARTMENTS, ROLES, DISTRICTS, SOW_CLASSES, getAccessLevel } from '../../services/churchConstants';
import { requestDepartmentJoin } from '../../services/departmentService';
import { useLanguage } from '../../context/LanguageContext';
import { getAllMembers } from '../../services/memberService';

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

const ProfileScreen = ({ user, onUpdateUser, onSettings, onFeedback, onLogout }) => {
  const { t } = useLanguage();
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
    courts: user.courts || [],
    dept: user.dept || '',
    depts: user.depts || [],
    district: user.district || '',
    gender: user.gender || '',
    schoolClass: user.schoolClass || '',
    position: user.position || '',
    interests: user.interests || [],
    paUid: user.pa?.uid || user.paUid || ''
  });
  const [newInterest, setNewInterest] = useState('');
  const [notifications, setNotifications] = useState({
    events: true,
    videoCalls: true,
    news: false,
    documents: true
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadPhotos();
    loadProfileData();
    loadMembers();
  }, [user?.uid]);

  useEffect(() => {
    setEditUser({
      first: user.first || '',
      last: user.last || '',
      court: user.court || '',
      courts: user.courts || [],
      dept: user.dept || '',
      depts: user.depts || [],
      district: user.district || '',
      gender: user.gender || '',
      schoolClass: user.schoolClass || '',
      position: user.position || '',
      interests: user.interests || [],
      paUid: user.pa?.uid || user.paUid || ''
    });
  }, [user]);

  const loadMembers = async () => {
    try {
      const allMembers = await getAllMembers();
      setMembers(allMembers.filter(m => m.uid !== user?.uid));
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

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
      await Promise.all(Array.from(files).map(file => uploadPhoto(user.uid, file)));
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
      const updates = {
        first: editUser.first,
        last: editUser.last,
        courts: editUser.courts || [],
        court: editUser.courts?.[0] || '',
        district: editUser.district || '',
        gender: editUser.gender || '',
        schoolClass: editUser.schoolClass || '',
        position: editUser.position,
        interests: editUser.interests,
        paUid: editUser.paUid || null
      };

      const newDepts = (editUser.depts || []).filter(d => !(user.depts || []).includes(d));
      if (newDepts.length > 0) {
        await Promise.all(newDepts.map(newDept => requestDepartmentJoin(user.uid, `${editUser.first} ${editUser.last}`, newDept)));
        alert(`Department join request(s) sent for review: ${newDepts.join(', ')}`);
        
        updates.depts = (editUser.depts || []).filter(d => (user.depts || []).includes(d) || d === 'General');
        updates.dept = updates.depts[0] || 'General';
      } else {
        updates.depts = editUser.depts;
        updates.dept = editUser.depts?.[0] || '';
      }

      await updateUserProfile(user.uid, updates);

      const freshProfile = await getUserProfile(user.uid);

      const updatedUser = {
        ...user,
        ...editUser,
        gender: freshProfile.gender || '',
        schoolClass: freshProfile.schoolClass || '',
        depts: freshProfile.depts || [],
        dept: freshProfile.dept || '',
        pa: freshProfile.pa || null,
        accessLevel: getAccessLevel(editUser.position || 'Member'),
        authorizedPostAsChurch: freshProfile.authorizedPostAsChurch || false,
        authorizedPostAsDept: freshProfile.authorizedPostAsDept || false,
        authorizedPostAsCourt: freshProfile.authorizedPostAsCourt || false,
        authorizedCreateProgram: freshProfile.authorizedCreateProgram || false
      };
      onUpdateUser(updatedUser);
      
      setEditUser({
        first: updatedUser.first,
        last: updatedUser.last,
        court: updatedUser.court,
        courts: updatedUser.courts,
        dept: updatedUser.dept,
        depts: updatedUser.depts,
        district: updatedUser.district,
        gender: updatedUser.gender,
        schoolClass: updatedUser.schoolClass,
        position: updatedUser.position,
        interests: updatedUser.interests,
        paUid: updatedUser.pa?.uid || updatedUser.paUid || ''
      });
      
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
          <h3 style={{ ...sectionTitleStyle, margin: 0 }}>{t('communityInfo')}</h3>
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
            {isEditingProfile ? t('save') : t('edit')}
          </button>
        </div>

        {isEditingProfile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>{t('firstName')}</label>
              <input
                type="text"
                value={editUser.first}
                onChange={(e) => setEditUser(prev => ({ ...prev, first: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('lastName')}</label>
              <input
                type="text"
                value={editUser.last}
                onChange={(e) => setEditUser(prev => ({ ...prev, last: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('courts') || 'Courts'}</label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                {COURTS.map(opt => {
                  const selected = editUser.courts?.includes(opt);
                  return (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(editUser.courts || []), opt]
                            : (editUser.courts || []).filter(item => item !== opt);
                          setEditUser(prev => ({ ...prev, courts: updated }));
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{t(toCamelCase(opt)) || opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('departments') || 'Departments'}</label>
              <div style={{
                maxHeight: '150px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '4px',
                backgroundColor: 'white'
              }}>
                {DEPARTMENTS.map(opt => {
                  const selected = editUser.depts?.includes(opt);
                  return (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(editUser.depts || []), opt]
                            : (editUser.depts || []).filter(item => item !== opt);
                          setEditUser(prev => ({ ...prev, depts: updated }));
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{t(toCamelCase(opt)) || opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('district') || 'District'}</label>
              <select
                value={editUser.district}
                onChange={(e) => setEditUser(prev => ({ ...prev, district: e.target.value }))}
                style={selectStyle}
              >
                <option value="" disabled>Select District</option>
                {DISTRICTS.map(opt => (
                  <option key={opt} value={opt}>{t(toCamelCase(opt)) || opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t('gender') || 'Gender'}</label>
              <select
                value={editUser.gender}
                onChange={(e) => setEditUser(prev => ({ ...prev, gender: e.target.value }))}
                style={selectStyle}
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">{t('male') || 'Male'}</option>
                <option value="Female">{t('female') || 'Female'}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t('schoolClass') || 'School of the Word Class'}</label>
              <select
                value={editUser.schoolClass}
                onChange={(e) => setEditUser(prev => ({ ...prev, schoolClass: e.target.value }))}
                style={selectStyle}
              >
                <option value="" disabled>Select SOW Class</option>
                {SOW_CLASSES.map(opt => (
                  <option key={opt} value={opt}>{t(toCamelCase(opt)) || opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t('positionLabel')}</label>
              <select
                value={editUser.position}
                onChange={(e) => setEditUser(prev => ({ ...prev, position: e.target.value }))}
                style={selectStyle}
              >
                <option value="" disabled>{t('selectPosition')}</option>
                {ROLES.map(opt => (
                  <option key={opt} value={opt}>{t(toCamelCase(opt)) || opt}</option>
                ))}
              </select>
            </div>
            {getAccessLevel(editUser.position) >= 3 && (
              <div>
                <label style={labelStyle}>{t('assignPA')}</label>
                <select
                  value={editUser.paUid}
                  onChange={(e) => setEditUser(prev => ({ ...prev, paUid: e.target.value }))}
                  style={selectStyle}
                >
                  <option value="">{t('noPASelected')}</option>
                  {members.map(m => (
                    <option key={m.uid} value={m.uid}>{m.first} {m.last} ({m.position || 'Member'})</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={infoRowStyle}>
              <span style={labelStyle}>{t('name')}</span>
              <span style={valueStyle}>{editUser.first} {editUser.last}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>{t('courts') || 'Courts'}</span>
              <span style={valueStyle}>
                {editUser.courts && editUser.courts.length > 0
                  ? editUser.courts.map(c => t(toCamelCase(c)) || c).join(', ')
                  : editUser.court ? t(toCamelCase(editUser.court)) : t('notSpecified')}
              </span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>{t('departments') || 'Departments'}</span>
              <span style={valueStyle}>
                {editUser.depts && editUser.depts.length > 0
                  ? editUser.depts.map(d => t(toCamelCase(d)) || d).join(', ')
                  : editUser.dept ? t(toCamelCase(editUser.dept)) : t('notSpecified')}
              </span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>{t('district') || 'District'}</span>
              <span style={valueStyle}>
                {editUser.district ? t(toCamelCase(editUser.district)) || editUser.district : t('notSpecified')}
              </span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>{t('gender') || 'Gender'}</span>
              <span style={valueStyle}>
                {editUser.gender ? t(toCamelCase(editUser.gender)) || editUser.gender : t('notSpecified')}
              </span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>{t('schoolClass') || 'School of the Word Class'}</span>
              <span style={valueStyle}>
                {editUser.schoolClass ? t(toCamelCase(editUser.schoolClass)) || editUser.schoolClass : t('notSpecified')}
              </span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>{t('positionLabel')}</span>
              <span style={valueStyle}>{editUser.position ? t(toCamelCase(editUser.position)) : t('notSpecified')}</span>
            </div>

            {getAccessLevel(user.position) >= 3 && (
              <div style={infoRowStyle}>
                <span style={labelStyle}>{t('personalAssistant')}</span>
                <span style={valueStyle}>
                  {user.pa ? `${user.pa.first} ${user.pa.last}` : t('notSpecified')}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bio Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ ...sectionTitleStyle, margin: 0 }}>{t('aboutMe')}</h3>
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
            {isEditMode ? t('save') : t('edit')}
          </button>
        </div>

        {isEditMode ? (
          <textarea
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder={t('writeAboutSelf')}
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
            {profileData.bio || t('noDescriptionYet')}
          </p>
        )}
      </div>

      {/* Interests Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={sectionTitleStyle}>{t('interests')}</h3>
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
            {isEditingProfile ? t('done') : t('edit')}
          </button>
        </div>

        {isEditingProfile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder={t('addNewInterest')}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                style={{ ...inputStyle, flex: 1 }}
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
                editUser.interests.map((interest, item) => (
                  <div key={item.id} style={{ ...interestTagStyle, display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px' }}>
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
                      
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>{t('noInterestsYet')}</p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {editUser.interests && editUser.interests.length > 0 ? (
              editUser.interests.map((interest, item) => (
                <span key={item.id} style={interestTagStyle}>
                  {interest}
                </span>
              ))
            ) : (
              <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>{t('noInterestsYet')}</p>
            )}
          </div>
        )}
      </div>

      {/* Notifications Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>{t('notificationPreferences')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={labelStyle}>{t('specificEvents')}</span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{t('getNotifiedEvents')}</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.events}
              onChange={() => setNotifications(prev => ({ ...prev, events: !prev.events }))}
              style={{ transform: 'scale(1.2)', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={labelStyle}>{t('videoConferences')}</span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{t('getLinksVideo')}</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.videoCalls}
              onChange={() => setNotifications(prev => ({ ...prev, videoCalls: !prev.videoCalls }))}
              style={{ transform: 'scale(1.2)', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={labelStyle}>{t('generalNews')}</span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{t('updatesNewsFeed')}</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.news}
              onChange={() => setNotifications(prev => ({ ...prev, news: !prev.news }))}
              style={{ transform: 'scale(1.2)', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={sectionTitleStyle}>{t('myPhotos')}</h3>

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
            {uploading ? t('uploading') : t('addPhoto')}
          </div>
        </label>

        {loading ? (
          <p style={{ color: '#999', fontSize: '0.9rem' }}>{t('loadingPhotos')}</p>
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
                  if (window.confirm(t('deletePhotoConfirm'))) {
                    handleDeletePhoto(photoToDelete);
                    setSelectedPhotoIndex(null);
                  }
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
                 {t('delete')}
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
        <button onClick={onFeedback} style={secondaryButtonStyle}>
          {t('feedback')}
        </button>
        <button onClick={onSettings} style={primaryButtonStyle}>
          {t('accountSettings')}
        </button>
        <button onClick={onLogout} style={logoutButtonStyle}>
          {t('signOut')}
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

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  color: '#333'
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

const secondaryButtonStyle = { width: '100%', padding: '16px', backgroundColor: 'var(--surface)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' };

const logoutButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#FFF0F0', color: '#D32F2F', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' };

export default ProfileScreen;