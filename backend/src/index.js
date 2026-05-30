const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin
// This assumes you have your service account or are running in a Firebase environment
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

/**
 * Milestone 5 Logic: User Categorization
 * Helper to fetch user attributes: Court, Department, and Position
 */
app.get('/api/user/:uid/context', async (req, res) => {
  const { uid } = req.params;

  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User categorization not found' });
    }

    const data = userDoc.data();
    res.json({
      location: data.location || 'Unknown Court',
      group: data.group || 'General Department',
      role: data.role || 'Member',
      permissions: data.permissions || []
    });
  } catch (error) {
    console.error('Error fetching user context:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Document Upload & Notification Logic (Milestone 6/7)
 */
app.post('/api/announcements', async (req, res) => {
  const { title, content, targetGroup, targetLocation } = req.body;
  
  try {
    const newAnnouncement = await db.collection('announcements').add({
      title,
      content,
      targetGroup,
      targetLocation,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ id: newAnnouncement.id, message: 'Announcement logic initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Church-Central Backend listening on port ${PORT}`);
});
