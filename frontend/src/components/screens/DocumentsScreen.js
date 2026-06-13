import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDocuments, uploadDocument, deleteDocument } from '../../services/documentService';
import * as Icon from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';
import { COURTS as CHURCH_COURTS, DEPARTMENTS } from '../../services/churchConstants';

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

const formatSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const COURTS = ['Global', ...CHURCH_COURTS];

const isImageFile = (type, name) => {
  if (type && type.startsWith('image/')) return true;
  if (name) {
    const ext = name.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
  }
  return false;
};

const isPdfFile = (type, name) => {
  if (type && type === 'application/pdf') return true;
  if (name) {
    return name.toLowerCase().endsWith('.pdf');
  }
  return false;
};

const DocumentsScreen = ({ user, openUploadOnMount, onCloseUploadOnMount }) => {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI Navigation states
  const [activeCourt, setActiveCourt] = useState('Global');
  const [expandedDepts, setExpandedDepts] = useState({});
  const [previewDocId, setPreviewDocId] = useState(null);

  // Upload Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    purpose: '',
    project: '',
    court: 'Global',
    department: 'General'
  });

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all'); // 'all', 'pdf', 'image', 'other'
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', '7days', '30days', 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Load flags from mount
  useEffect(() => {
    if (openUploadOnMount) {
      // Prepopulate dropdowns with user data if available
      setUploadForm(prev => ({
        ...prev,
        court: user?.court || 'Global',
        department: user?.dept || 'General'
      }));
      setShowUploadModal(true);
      if (onCloseUploadOnMount) onCloseUploadOnMount();
    }
  }, [openUploadOnMount, user]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
      
      // Auto-expand the first department folder that has documents
      const initialCourtDocs = docs.filter(d => (d.court || 'Global') === 'Global');
      if (initialCourtDocs.length > 0) {
        const firstDept = initialCourtDocs[0].department || 'General';
        setExpandedDepts({ [firstDept]: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const newDoc = await uploadDocument(
        selectedFile,
        authUser,
        uploadForm.department,
        uploadForm.court,
        uploadForm.purpose,
        uploadForm.project
      );
      
      setDocuments(prev => [newDoc, ...prev]);
      
      // Switch to the newly uploaded document's Campus and expand its Department
      setActiveCourt(uploadForm.court);
      setExpandedDepts(prev => ({ ...prev, [uploadForm.department]: true }));
      
      // Reset upload states
      setSelectedFile(null);
      setUploadForm({
        purpose: '',
        project: '',
        court: user?.court || 'Global',
        department: user?.dept || 'General'
      });
      setShowUploadModal(false);
      alert(t('docUploadedSuccess'));
    } catch (err) {
      alert(t('docUploadError') + ': ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId, storagePath, uploaderId) => {
    if (uploaderId !== authUser.uid && user?.position !== 'Admin') {
      alert(t('deleteOwnDocsOnly'));
      return;
    }

    if (window.confirm(t('deleteDocConfirm'))) {
      try {
        await deleteDocument(docId, storagePath);
        setDocuments(prev => prev.filter(d => d.id !== docId));
        if (previewDocId === docId) setPreviewDocId(null);
      } catch (err) {
        alert(t('deleteDocError') + ': ' + err.message);
      }
    }
  };

  const toggleDept = (dept) => {
    setExpandedDepts(prev => ({ ...prev, [dept]: !prev[dept] }));
  };

  // Helper to determine if any filters are active
  const isFilterActive = searchQuery !== '' || fileTypeFilter !== 'all' || dateFilter !== 'all';

  // Helper matching functions
  const matchesSearch = (doc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (doc.name || '').toLowerCase().includes(q) ||
      (doc.court || '').toLowerCase().includes(q) ||
      (doc.department || '').toLowerCase().includes(q) ||
      (doc.uploaderName || '').toLowerCase().includes(q) ||
      (doc.purpose || '').toLowerCase().includes(q) ||
      (doc.projectName || '').toLowerCase().includes(q)
    );
  };

  const matchesFileType = (doc) => {
    if (fileTypeFilter === 'all') return true;
    const isImg = isImageFile(doc.type, doc.name);
    const isPdf = isPdfFile(doc.type, doc.name);
    if (fileTypeFilter === 'pdf') return isPdf;
    if (fileTypeFilter === 'image') return isImg;
    if (fileTypeFilter === 'other') return !isPdf && !isImg;
    return true;
  };

  const matchesDate = (doc) => {
    if (dateFilter === 'all') return true;
    if (!doc.uploadedAt) return false;
    const docDate = new Date(doc.uploadedAt);
    const now = new Date();
    if (dateFilter === 'today') {
      return docDate.toDateString() === now.toDateString();
    }
    if (dateFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return docDate >= sevenDaysAgo;
    }
    if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return docDate >= thirtyDaysAgo;
    }
    if (dateFilter === 'custom') {
      const docTime = docDate.getTime();
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      if (start && docTime < start) return false;
      if (end && docTime > end) return false;
      return true;
    }
    return true;
  };

  // 1. Process documents with filters (applied globally)
  const processedDocs = documents.filter(doc => 
    matchesSearch(doc) && matchesFileType(doc) && matchesDate(doc)
  );

  // 2. Tab badge counts based on processed documents
  const getTabMatchCount = (courtName) => {
    return processedDocs.filter(doc => (doc.court || 'Global') === courtName).length;
  };

  // 3. Filter processed documents for the currently selected court
  const filteredDocs = processedDocs.filter(doc => (doc.court || 'Global') === activeCourt);

  // Auto-expand folders when filters are active
  useEffect(() => {
    if (isFilterActive && processedDocs.length > 0) {
      const activeCourtMatchedDocs = processedDocs.filter(doc => (doc.court || 'Global') === activeCourt);
      const deptsToExpand = {};
      activeCourtMatchedDocs.forEach(doc => {
        deptsToExpand[doc.department || 'General'] = true;
      });
      setExpandedDepts(deptsToExpand);
    }
  }, [searchQuery, fileTypeFilter, dateFilter, startDate, endDate, activeCourt]);

  // Group filtered docs by department
  const groupedDocs = {};
  filteredDocs.forEach(doc => {
    const dept = doc.department || 'General';
    if (!groupedDocs[dept]) {
      groupedDocs[dept] = [];
    }
    groupedDocs[dept].push(doc);
  });

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--ink, #111)' }}>📁 {t('documents')}</h2>
          <p style={{ color: 'var(--ink-3, #666)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>{t('shareAccessFiles')}</p>
        </div>
        
        <button 
          onClick={() => {
            setUploadForm(prev => ({
              ...prev,
              court: user?.court || 'Global',
              department: user?.dept || 'General'
            }));
            setShowUploadModal(true);
          }}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(91, 63, 187, 0.15)',
            transition: 'all 0.2s'
          }}
        >
          {t('uploadButton')}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid var(--line-2, #eee)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '14px', fontSize: '1.1rem', color: '#888' }}>🔍</span>
          <input 
            type="text"
            placeholder="Search by name, campus, department, uploader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              borderRadius: '10px',
              border: '1px solid var(--line-2, #ddd)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              backgroundColor: '#fafafa'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                color: '#888',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* File Type Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#666' }}>File Type</label>
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--line-2, #ddd)',
                fontSize: '0.85rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="image">Images</option>
              <option value="other">Other Files</option>
            </select>
          </div>

          {/* Date Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#666' }}>Upload Date</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--line-2, #ddd)',
                fontSize: '0.85rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom Range...</option>
            </select>
          </div>

          {/* Custom Date Range Picker */}
          {dateFilter === 'custom' && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: '2 1 250px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#666' }}>From</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--line-2, #ddd)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#666' }}>To</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--line-2, #ddd)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campus Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--line-2, #eee)', paddingBottom: '12px' }}>
        {COURTS.map(court => (
          <button 
            key={court}
            onClick={() => {
              setActiveCourt(court);
              // Auto-expand first folder with items in this new court tab
              const courtItems = processedDocs.filter(d => (d.court || 'Global') === court);
              if (courtItems.length > 0) {
                const firstDept = courtItems[0].department || 'General';
                setExpandedDepts({ [firstDept]: true });
              } else {
                setExpandedDepts({});
              }
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeCourt === court ? 'var(--accent)' : 'transparent',
              color: activeCourt === court ? 'white' : 'var(--ink-2, #555)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <span>{court === 'Global' ? '🌐' : '⛪'}</span>
            <span>{t(toCamelCase(court)) || court}</span>
            <span style={{
              backgroundColor: activeCourt === court ? 'rgba(255,255,255,0.25)' : 'var(--accent-soft, #f4f2ff)',
              color: activeCourt === court ? 'white' : 'var(--accent)',
              fontSize: '0.75rem',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '700',
              marginLeft: '4px'
            }}>
              {getTabMatchCount(court)}
            </span>
          </button>
        ))}
      </div>

      {/* Main Body */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3, #999)' }}>
          <div className="spinner" style={{ marginBottom: '16px' }}>⌛</div>
          {t('loading')}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          backgroundColor: 'var(--surface, #fafafa)',
          borderRadius: '24px',
          border: '1px solid var(--line-2, #eee)',
          color: 'var(--ink-3, #999)'
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔍</span>
          <p style={{ fontWeight: '600', fontSize: '1rem', margin: 0 }}>
            {isFilterActive ? 'No documents match your search or filters' : t('noDocsFound')}
          </p>
          {isFilterActive && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFileTypeFilter('all');
                setDateFilter('all');
                setStartDate('');
                setEndDate('');
              }}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(91, 63, 187, 0.15)'
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(groupedDocs).map(([dept, docs]) => {
            const isExpanded = !!expandedDepts[dept];
            return (
              <div 
                key={dept} 
                style={{ 
                  borderRadius: '16px', 
                  backgroundColor: 'white', 
                  border: '1px solid var(--line-2, #eee)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
              >
                {/* Folder Header */}
                <button
                  onClick={() => toggleDept(dept)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '16px 20px',
                    backgroundColor: isExpanded ? 'var(--accent-soft, #f4f2ff)' : 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{isExpanded ? '📂' : '📁'}</span>
                    <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--ink, #111)' }}>
                      {t(toCamelCase(dept)) || dept}
                    </span>
                    <span style={{ 
                      backgroundColor: 'rgba(91, 63, 187, 0.1)', 
                      color: 'var(--accent)', 
                      fontSize: '0.8rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      {docs.length}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--ink-3)' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {/* Folder Content (Files) */}
                {isExpanded && (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #eee' }}>
                    {docs.map(doc => {
                      const isOwnerOrAdmin = doc.uploadedBy === authUser.uid || user?.position === 'Admin';
                      const isImage = isImageFile(doc.type, doc.name);
                      const isPdf = isPdfFile(doc.type, doc.name);
                      const isPreviewing = previewDocId === doc.id;
                      const downloadUrl = `${backendUrl}/api/download?url=${encodeURIComponent(doc.url)}`;

                      return (
                        <div 
                          key={doc.id} 
                          style={{ 
                            border: '1px solid var(--line-2, #f0f0f0)', 
                            borderRadius: '12px', 
                            padding: '14px',
                            backgroundColor: '#fafafa'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                            {/* File Icon / Small Preview */}
                            <div style={{ 
                              width: '50px', 
                              height: '50px', 
                              borderRadius: '8px', 
                              backgroundColor: 'white',
                              border: '1px solid #e0e0e0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              {isImage ? (
                                <img 
                                  src={doc.url} 
                                  alt={doc.name} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                              ) : isPdf ? (
                                '📄'
                              ) : (
                                '💾'
                              )}
                            </div>

                            {/* Details */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {doc.name}
                              </h4>
                              
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                                <span>Size: {formatSize(doc.size)}</span>
                                <span>•</span>
                                <span>By: {doc.uploaderName}</span>
                                <span>•</span>
                                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                              </div>

                              {/* Purpose & Project list */}
                              {(doc.purpose || doc.projectName) && (
                                <div style={{ 
                                  backgroundColor: 'white', 
                                  padding: '8px 12px', 
                                  borderRadius: '8px', 
                                  border: '1px solid #eee',
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                  marginBottom: '8px'
                                }}>
                                  {doc.purpose && (
                                    <div>
                                      <strong style={{ color: 'var(--ink)' }}>Purpose:</strong> {doc.purpose}
                                    </div>
                                  )}
                                  {doc.projectName && (
                                    <div>
                                      <strong style={{ color: 'var(--ink)' }}>Project:</strong> {doc.projectName}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <a 
                                  href={downloadUrl} 
                                  download
                                  style={{ 
                                    color: 'var(--accent)', 
                                    textDecoration: 'none', 
                                    fontSize: '0.8rem', 
                                    fontWeight: '700',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    backgroundColor: 'rgba(91, 63, 187, 0.05)',
                                    display: 'inline-block'
                                  }}
                                >
                                  {t('download')}
                                </a>

                                {(isImage || isPdf) && (
                                  <button
                                    onClick={() => setPreviewDocId(isPreviewing ? null : doc.id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--accent)',
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontWeight: '700',
                                      padding: '4px 8px',
                                    }}
                                  >
                                    {isPreviewing ? 'Close Preview' : 'Preview'}
                                  </button>
                                )}

                                {isOwnerOrAdmin && (
                                  <button 
                                    onClick={() => handleDelete(doc.id, doc.storagePath, doc.uploadedBy)}
                                    style={{ 
                                      background: 'none', 
                                      border: 'none', 
                                      color: '#f44336', 
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontWeight: '700',
                                      padding: '4px 8px',
                                      marginLeft: 'auto'
                                    }}
                                  >
                                    {t('delete')}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Preview Container */}
                          {isPreviewing && (
                            <div style={{ 
                              marginTop: '12px', 
                              borderTop: '1px solid #eee', 
                              paddingTop: '12px',
                              display: 'flex',
                              justifyContent: 'center'
                            }}>
                              {isImage ? (
                                <img 
                                  src={doc.url} 
                                  alt={doc.name} 
                                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #ddd' }} 
                                />
                              ) : isPdf ? (
                                <iframe 
                                  src={doc.url} 
                                  title={doc.name} 
                                  style={{ width: '100%', height: '400px', border: '1px solid #ddd', borderRadius: '8px' }} 
                                />
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div style={modalOverlayStyle} onClick={() => { if (!uploading) setShowUploadModal(false); }}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontWeight: '800', color: 'var(--ink)' }}>{t('uploadDocument')}</h3>
              <button 
                onClick={() => setShowUploadModal(false)} 
                disabled={uploading}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--ink-3)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* File Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={labelStyle}>File *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="file" 
                    id="modal-file-picker" 
                    onChange={handleFileChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="modal-file-picker"
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'var(--accent-soft)',
                      color: 'var(--accent)',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      border: '1px dashed var(--accent)',
                      fontSize: '0.85rem'
                    }}
                  >
                    Choose File
                  </label>
                  <span style={{ fontSize: '0.85rem', color: selectedFile ? 'var(--ink)' : 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                    {selectedFile ? `${selectedFile.name} (${formatSize(selectedFile.size)})` : 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Purpose */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={labelStyle}>{t('purposeOfUpload')}</label>
                <input 
                  type="text" 
                  name="purpose"
                  placeholder="e.g. Monthly Budget, Operations Review"
                  value={uploadForm.purpose}
                  onChange={handleFormChange}
                  disabled={uploading}
                  style={inputStyle}
                />
              </div>

              {/* Project */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={labelStyle}>{t('whichProject')}</label>
                <input 
                  type="text" 
                  name="project"
                  placeholder="e.g. Youth Camp 2026, Worship Rehearsal"
                  value={uploadForm.project}
                  onChange={handleFormChange}
                  disabled={uploading}
                  style={inputStyle}
                />
              </div>

              {/* Court/Campus Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={labelStyle}>{t('selectCourt')}</label>
                <select 
                  name="court"
                  value={uploadForm.court}
                  onChange={handleFormChange}
                  disabled={uploading}
                  style={inputStyle}
                >
                  {COURTS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Department Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={labelStyle}>{t('selectDepartment')}</label>
                <select 
                  name="department"
                  value={uploadForm.department}
                  onChange={handleFormChange}
                  disabled={uploading}
                  style={inputStyle}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--line-2, #eee)',
                    backgroundColor: '#f5f5f5',
                    color: 'var(--ink-2)',
                    fontWeight: '700',
                    cursor: uploading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: uploading || !selectedFile ? '#ccc' : 'var(--accent)',
                    color: 'white',
                    fontWeight: '700',
                    cursor: uploading || !selectedFile ? 'not-allowed' : 'pointer',
                    boxShadow: uploading || !selectedFile ? 'none' : '0 4px 12px rgba(91, 63, 187, 0.2)'
                  }}
                >
                  {uploading ? t('uploading') : t('uploadButton')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(20, 16, 40, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000,
  padding: '20px'
};

const modalContentStyle = {
  backgroundColor: 'white',
  borderRadius: '24px',
  width: '100%',
  maxWidth: '480px',
  padding: '28px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  border: '1px solid #f0f0f0'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid #eee'
};

const labelStyle = {
  fontSize: '0.85rem',
  fontWeight: '700',
  color: 'var(--ink-2, #333)'
};

const inputStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid var(--line-2, #ddd)',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'inherit'
};

export default DocumentsScreen;
