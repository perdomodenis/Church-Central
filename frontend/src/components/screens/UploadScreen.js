import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createAnnouncement } from '../../lib/dataconnect';
import { storage } from '../../services/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const SCOPE_OPTIONS = ['News', 'Department', 'District', 'Court', 'Leaders', 'Reverends', 'Admins', 'All'];

const UploadScreen = ({ onCancel, onDone }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('News');
  const [postAs, setPostAs] = useState('myself'); // 'myself', 'church', 'dept', 'court'
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  // Authorization checks
  const userPosition = user?.position || 'Member';
  const userDept = user?.dept || '';
  const userCourt = user?.court || '';

  const canPostAsChurch = ['Bishop', 'Reverend', 'Admin', 'Pastor'].includes(userPosition);
  const canPostAsDept = userDept && ['Bishop', 'Reverend', 'Admin', 'Pastor', 'Leader', 'Co-Leader'].includes(userPosition);
  const canPostAsCourt = userCourt && ['Bishop', 'Reverend', 'Admin', 'Pastor', 'Leader', 'Co-Leader'].includes(userPosition);

  const showPostAsSelector = canPostAsChurch || canPostAsDept || canPostAsCourt;

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const type = file.type.startsWith('image/')
          ? 'photo'
          : file.type.startsWith('video/')
            ? 'video'
            : 'document';

        if (type === 'photo') {
          const reader = new FileReader();
          reader.onload = (event) => {
            setAttachments(prev => [...prev, {
              id: Date.now() + Math.random(),
              type: 'photo',
              name: file.name,
              data: event.target.result,
              file: file
            }]);
          };
          reader.readAsDataURL(file);
        } else {
          setAttachments(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: type,
            name: file.name,
            data: null,
            file: file
          }]);
        }
      });
    }
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && attachments.length === 0) return;
    if (!user) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('targetGroup', scope); // Maps to 'targetGroup' in your backend req.body
      
      let authorUid = user.uid;
      let authorFirst = '';
      let authorLast = '';

      if (postAs === 'church') {
        authorUid = 'church_grace_community';
        authorFirst = 'Grace Community';
        authorLast = 'Church';
      } else if (postAs === 'dept') {
        authorUid = `dept_${userDept.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        authorFirst = userDept;
        authorLast = 'Department';
      } else if (postAs === 'court') {
        authorUid = `court_${userCourt.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        authorFirst = userCourt;
        authorLast = 'District';
      }

      formData.append('authorUid', authorUid);
      if (authorFirst) {
        formData.append('authorFirst', authorFirst);
        formData.append('authorLast', authorLast);
      }

      // 2. Attach the file if it exists
      const firstAttachment = attachments[0];
      if (firstAttachment && firstAttachment.file) {
        formData.append('file', firstAttachment.file); // Maps to upload.single('file') in backend
      }

      // 3. Send it to your Node.js Express server instead of Firebase directly
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/announcements`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Success:', data);

      onDone();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div className="upload-screen" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--ink)' }}>{t('createPost')}</h2>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'var(--line-2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'var(--ink-2)'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {showPostAsSelector && (
            <div>
              <label style={labelStyle}>{t('postAs')}</label>
              <select
                value={postAs}
                onChange={(e) => setPostAs(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--ink)',
                  outlineColor: 'var(--accent)',
                  marginTop: '4px'
                }}
              >
                <option value="myself">{user ? `${user.first} ${user.last}` : t('myself')}</option>
                {canPostAsChurch && <option value="church">Grace Community Church</option>}
                {canPostAsDept && <option value="dept">{`${userDept} ${t('department')}`}</option>}
                {canPostAsCourt && <option value="court">{`${userCourt} ${t('district')}`}</option>}
              </select>
            </div>
          )}

          <div>
            <label style={labelStyle}>{t('shareWith')}</label>
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '8px',
              padding: '8px 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {SCOPE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setScope(opt)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: '1px solid',
                    borderColor: scope === opt ? 'var(--accent)' : 'var(--line)',
                    backgroundColor: scope === opt ? 'var(--accent)' : 'var(--surface)',
                    color: scope === opt ? 'var(--accent-ink)' : 'var(--ink-2)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {t(opt.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t('message')}</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('writeSomethingCommunity')}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                backgroundColor: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: '1rem',
                resize: 'none',
                marginTop: '8px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                outlineColor: 'var(--accent)'
              }}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={() => fileInputRef.current?.click()}
            >
              {t('addDocument')}
            </button>
          </div>

          {attachments.length > 0 && (
            <div>
              <label style={labelStyle}>{t('attachments')} ({attachments.length})</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {attachments.map(att => (
                  <div key={att.id} style={{ position: 'relative' }}>
                    {att.type === 'photo' ? (
                      <img
                        src={att.data}
                        alt={att.name}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100px',
                        backgroundColor: 'var(--line-2)',
                        color: 'var(--ink-2)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}>
                        {att.type === 'video' ? '🎥' : '📄'}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      ✕
                    </button>
                    <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0', color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {att.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={submitButtonStyle}>
            {loading ? t('posting') : `${t('postTo')} ${t(scope.toLowerCase())}`}
          </button>
        </form>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000,
  padding: '16px',
  boxSizing: 'border-box',
  backdropFilter: 'blur(2px)'
};

const modalStyle = {
  backgroundColor: 'var(--surface)',
  color: 'var(--ink)',
  width: '100%',
  maxWidth: '520px',
  borderRadius: '20px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: 'var(--shadow-2)',
  boxSizing: 'border-box',
  border: '1px solid var(--line)',
  animation: 'slideUp 0.25s ease-out'
};

const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--ink)', marginBottom: '4px' };
const submitButtonStyle = { width: '100%', padding: '16px', backgroundColor: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: 'var(--shadow-1)' };
const secondaryButtonStyle = { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)', color: 'var(--ink-2)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

export default UploadScreen;