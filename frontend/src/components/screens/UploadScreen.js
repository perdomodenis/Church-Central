import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createAnnouncement } from '../../lib/dataconnect';
import { storage } from '../../services/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const SCOPE_OPTIONS = ['News', 'Department', 'District', 'Court', 'Leaders', 'All'];

const UploadScreen = ({ onCancel, onDone }) => {
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('News');
  const [attachments, setAttachments] = useState([]);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handlePhotoSelect = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
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
      });
    }
  };

  const handleVideoSelect = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAttachments(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: 'video',
            name: file.name,
            data: event.target.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && attachments.length === 0) return;
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = '';
      const photoAttachment = attachments.find(a => a.type === 'photo');
      if (photoAttachment && photoAttachment.file) {
        const file = photoAttachment.file;
        const fileRef = storageRef(storage, `announcements/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }

      await createAnnouncement({
        content,
        scope,
        category: 'Update',
        imageUrl: imageUrl || null,
        authorUid: user.uid
      });

      onDone();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-screen" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: '100%',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Create a Post</h2>
        <button
          onClick={onCancel}
          style={{
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#666'
          }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Share with:</label>
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
                  borderColor: scope === opt ? 'var(--accent)' : '#ddd',
                  backgroundColor: scope === opt ? 'var(--accent)' : 'white',
                  color: scope === opt ? 'white' : '#666',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Message</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something to the community..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #ddd',
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
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoSelect}
          style={{ display: 'none' }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoSelect}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={() => photoInputRef.current?.click()}
          >
            📷 Photo
          </button>
          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={() => videoInputRef.current?.click()}
          >
            🎥 Video
          </button>
        </div>

        {attachments.length > 0 && (
          <div>
            <label style={labelStyle}>Attachments ({attachments.length})</label>
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
                      backgroundColor: '#f0f0f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}>
                      🎥
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
                  <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {att.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} style={submitButtonStyle}>
          {loading ? 'Posting...' : `Post to ${scope}`}
        </button>
      </form>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#111', marginBottom: '4px' };
const submitButtonStyle = { width: '100%', padding: '16px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const secondaryButtonStyle = { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: 'white', color: '#444', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

export default UploadScreen;