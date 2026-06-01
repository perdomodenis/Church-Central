import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDocuments, uploadDocument, deleteDocument } from '../../services/documentService';
import * as Icon from '../common/Icons';

const DocumentsScreen = ({ user }) => {
  const { user: authUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterDept, setFilterDept] = useState('Global');
  
  // Available departments based on user (or could be fetched)
  const departments = ['Global', user?.dept || 'General', 'Leadership', 'Media'].filter((v, i, a) => a.indexOf(v) === i);

  useEffect(() => {
    fetchDocs();
  }, [filterDept]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments(filterDept === 'All' ? null : filterDept);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const newDoc = await uploadDocument(file, authUser, filterDept === 'All' ? 'Global' : filterDept);
      setDocuments(prev => [newDoc, ...prev]);
      alert('Document uploaded successfully!');
    } catch (err) {
      alert('Error uploading document: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = null; // Reset input
    }
  };

  const handleDelete = async (docId, storagePath, uploaderId) => {
    if (uploaderId !== authUser.uid && user?.position !== 'Admin') {
      alert('You can only delete your own documents.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(docId, storagePath);
        setDocuments(prev => prev.filter(d => d.id !== docId));
      } catch (err) {
        alert('Error deleting document: ' + err.message);
      }
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#111' }}>📁 Documents</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Share and access files</p>
        </div>
        
        <div>
          <input 
            type="file" 
            id="file-upload" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
            disabled={uploading}
          />
          <label 
            htmlFor="file-upload"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'inline-block',
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? 'Uploading...' : '+ Upload'}
          </label>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button 
          onClick={() => setFilterDept('All')}
          style={filterButtonStyle(filterDept === 'All')}
        >
          All
        </button>
        {departments.map(dept => (
          <button 
            key={dept}
            onClick={() => setFilterDept(dept)}
            style={filterButtonStyle(filterDept === dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Documents List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>Loading documents...</div>
      ) : documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          No documents found in this section.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {documents.map(doc => {
            const isOwnerOrAdmin = doc.uploadedBy === authUser.uid || user?.position === 'Admin';
            
            return (
              <div key={doc.id} style={docCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(91, 63, 187, 0.1)', 
                    color: 'var(--accent)', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📄
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#666' }}>
                      <span>{formatSize(doc.size)}</span>
                      <span>•</span>
                      <span>{doc.uploaderName}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '10px', color: '#555', fontWeight: '600' }}>
                    {doc.department}
                  </span>
                  <div style={{ flex: 1 }} />
                  
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--accent)', 
                      textDecoration: 'none', 
                      fontSize: '0.85rem', 
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(91, 63, 187, 0.05)'
                    }}
                  >
                    Download
                  </a>
                  
                  {isOwnerOrAdmin && (
                    <button 
                      onClick={() => handleDelete(doc.id, doc.storagePath, doc.uploadedBy)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#f44336', 
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        padding: '4px 8px'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const filterButtonStyle = (active) => ({
  padding: '6px 16px',
  borderRadius: '20px',
  border: 'none',
  backgroundColor: active ? 'var(--accent)' : '#f0f0f0',
  color: active ? 'white' : '#555',
  fontWeight: active ? '700' : '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s'
});

const docCardStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  border: '1px solid #f0f0f0'
};

export default DocumentsScreen;
