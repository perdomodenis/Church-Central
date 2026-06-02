import React, { useState } from 'react';

const SCOPE_OPTIONS = ['News', 'Department', 'District', 'Court', 'Leaders', 'All'];

const UploadScreen = ({ onCancel, onDone }) => {
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('News');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // In a production environment, this is where you would call 
    // Firebase Firestore to save the post and Firebase Storage for images.
    console.log('Publishing post:', { 
      content, 
      scope, 
      timestamp: new Date() 
    });
    
    onDone();
  };

  return (
    <div className="upload-screen" style={{ 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',
      height: '100%',
      boxSizing: 'border-box'
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
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

        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Message</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something to the community..."
            required
            style={{
              width: '100%',
              height: '180px',
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

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            style={secondaryButtonStyle}
            onClick={() => alert('Media upload functionality coming soon!')}
          >
            📷 Photo
          </button>
          <button 
            type="button" 
            style={secondaryButtonStyle}
            onClick={() => alert('File attachment functionality coming soon!')}
          >
            📎 File
          </button>
        </div>

        <button type="submit" style={submitButtonStyle}>
          Post to {scope}
        </button>
      </form>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#111', marginBottom: '4px' };
const submitButtonStyle = { width: '100%', padding: '16px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const secondaryButtonStyle = { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: 'white', color: '#444', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

export default UploadScreen;