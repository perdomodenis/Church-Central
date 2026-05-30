import React, { useState } from 'react';
import Layout from '../common/Layout';
import Card from '../common/Card';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { 
  uploadDocumentFile, 
  saveDocumentMetadata 
} from '../../services/documentsService';
import './DocumentsUpload.css';

function DocumentsUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // What roles/groups can see this document
  const [targetRoles, setTargetRoles] = useState({
    admin: false,
    leader: false,
    member: true
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Only allow PDF, Word, Images
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Nur PDF, Word und Bilder erlaubt');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !title) {
      setError('Bitte Datei und Titel ausfüllen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload file
      const uploadedFile = await uploadDocumentFile(file, user.uid);

      // Step 2: Save metadata to database
      await saveDocumentMetadata({
        title,
        description,
        uploadedBy: user.email,
        uploadedById: user.uid,
        fileName: uploadedFile.fileName,
        downloadURL: uploadedFile.downloadURL,
        fileSize: uploadedFile.fileSize,
        fileType: uploadedFile.fileType,
        targetRoles,
        status: 'published'
      });

      setSuccess(true);
      setFile(null);
      setTitle('');
      setDescription('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="upload-page">
        <h1>📄 Dokument hochladen</h1>

        {success && (
          <div className="alert alert-success">
            ✅ Dokument erfolgreich hochgeladen!
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        <Card title="Neues Dokument hochladen">
          <form onSubmit={handleSubmit} className="upload-form">
            {/* Title Input */}
            <div className="form-group">
              <label htmlFor="title">Titel *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="z.B. Neue Kirchenrichtlinie"
                required
              />
            </div>

            {/* Description Input */}
            <div className="form-group">
              <label htmlFor="description">Beschreibung</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Was ist dieses Dokument?"
                rows="4"
              />
            </div>

            {/* File Input */}
            <div className="form-group">
              <label htmlFor="file">Datei hochladen *</label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                required
              />
              {file && (
                <p className="file-info">
                  ✓ Datei: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>

            {/* Permissions */}
            <div className="form-group">
              <label>Wer kann dies sehen? *</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={targetRoles.admin}
                    onChange={(e) =>
                      setTargetRoles({
                        ...targetRoles,
                        admin: e.target.checked
                      })
                    }
                  />
                  Administratoren
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={targetRoles.leader}
                    onChange={(e) =>
                      setTargetRoles({
                        ...targetRoles,
                        leader: e.target.checked
                      })
                    }
                  />
                  Leiter
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={targetRoles.member}
                    onChange={(e) =>
                      setTargetRoles({
                        ...targetRoles,
                        member: e.target.checked
                      })
                    }
                  />
                  Mitglieder
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-footer">
              <Button 
                type="submit" 
                loading={loading}
                disabled={!file || !title}
              >
                {loading ? 'Hochladen...' : 'Dokument hochladen'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default DocumentsUpload;
