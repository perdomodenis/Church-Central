import { storage, rtdb } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, push, set, get, query, orderByChild, equalTo, remove } from 'firebase/database';

/**
 * Uploads a file to Firebase Storage and saves its metadata in RTDB.
 */
export const uploadDocument = async (file, user, department = 'Global') => {
  try {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const fileRef = storageRef(storage, `documents/${department}/${filename}`);

    // Upload to Firebase Storage
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save metadata to Realtime Database
    const docData = {
      name: file.name,
      url: downloadURL,
      storagePath: snapshot.ref.fullPath,
      size: file.size,
      type: file.type,
      department: department,
      uploadedBy: user.uid,
      uploaderName: user.displayName || user.email || 'Unknown',
      uploadedAt: new Date().toISOString(),
    };

    const newDocRef = push(dbRef(rtdb, 'documents'));
    await set(newDocRef, docData);

    return { id: newDocRef.key, ...docData };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Fetches documents from RTDB.
 * If department is provided, filters by department. Otherwise fetches all (or global).
 */
export const getDocuments = async (department = null) => {
  try {
    let docsRef = dbRef(rtdb, 'documents');
    let snapshot;

    if (department && department !== 'Global') {
      const q = query(docsRef, orderByChild('department'), equalTo(department));
      snapshot = await get(q);
    } else {
      snapshot = await get(docsRef);
    }

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

/**
 * Deletes a document from Storage and RTDB.
 */
export const deleteDocument = async (docId, storagePath) => {
  try {
    // Delete from Storage
    const fileRef = storageRef(storage, storagePath);
    await deleteObject(fileRef);

    // Delete from RTDB
    await remove(dbRef(rtdb, `documents/${docId}`));
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
