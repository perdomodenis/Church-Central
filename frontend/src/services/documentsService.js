import { 
  collection, 
  addDoc, 
  getDocs,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

// Lädt dokument file zu Firebase Storage hoch und gibt die Datei-URL zurück
export async function uploadDocumentFile(file, userId) {
  if (!file) throw new Error('Keine Datei ausgewählt');
  
  // prüft maximale Dateigröße (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Datei ist zu groß. Maximum: 10MB');
  }

  try {
    // Kreiert einen einmaligen Dateinamen mit User-ID und Timestamp
    const fileName = `${userId}_${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `documents/${fileName}`);

    // lädt es zur Firebase Storage hoch
    const snapshot = await uploadBytes(fileRef, file);
    
    // Holt den Download-Link der hochgeladenen Datei
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      fileName,
      downloadURL,
      fileSize: file.size,
      fileType: file.type
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Sichert die Dokumenten-Metadaten in Firestore
export async function saveDocumentMetadata(docData) {
  try {
    const docRef = await addDoc(
      collection(db, 'documents'), 
      {
        ...docData,
        uploadedAt: new Date(),
        updatedAt: new Date()
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
}

// Holt alle documents
export async function getDocuments() {
  try {
    const snapshot = await getDocs(collection(db, 'documents'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

// Löscht ein document
export async function deleteDocument(docId, fileStoragePath) {
  try {
    // Löscht das document aus Firestore
    await deleteDoc(doc(db, 'documents', docId));
    
    // Löscht die Datei aus Firebase Storage
    if (fileStoragePath) {
      const fileRef = ref(storage, fileStoragePath);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}