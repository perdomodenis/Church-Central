const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const { getDataConnect } = require('firebase-admin/data-connect');
const { connectorConfig, getUserProfile, createAnnouncement } = require('./lib/dataconnect');

// Initialize Firebase Admin
admin.initializeApp();
const adminDc = getDataConnect(connectorConfig);

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
    const response = await getUserProfile(adminDc, { uid });
    const user = response.data?.user;

    if (!user) {
      return res.status(404).json({ error: 'User categorization not found' });
    }

    res.json({
      location: user.court || 'Unknown Court',
      group: user.dept || 'General Department',
      role: user.position || 'Member',
      permissions: []
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
  const { title, content, targetGroup, authorUid } = req.body;
  
  try {
    const response = await createAnnouncement(adminDc, {
      content: content || title || '',
      scope: targetGroup || 'News',
      category: 'Announcement',
      imageUrl: '',
      authorUid: authorUid || 'pastor_001'
    });

    res.status(201).json({ id: response.data?.announcement_insert?.id, message: 'Announcement logic initialized' });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Church-Central Backend listening on port ${PORT}`);
});
