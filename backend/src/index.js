const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const multer = require('multer');
const { getDataConnect } = require('firebase-admin/data-connect');
const { connectorConfig, getUserProfile, createAnnouncement } = require('./lib/dataconnect');

// Initialize Firebase Admin
admin.initializeApp({
  storageBucket: 'church-central-992a7.firebasestorage.app'
});
const adminDc = getDataConnect(connectorConfig);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Configure multer to hold files in memory temporarily
const upload = multer({ storage: multer.memoryStorage() });

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
app.post('/api/announcements', upload.single('file'), async (req, res) => {
  const { title, content, targetGroup, authorUid } = req.body;
  const file = req.file;

  try {
    let uploadedImageUrlOrPdf = '';

    if (file) {
      // 1. Upload the file to Firebase Storage from the backend
      const bucket = admin.storage().bucket();
      const blob = bucket.file(`announcements/${Date.now()}_${file.originalname}`);
      const blobStream = blob.createWriteStream({ metadata: { contentType: file.mimetype } });

      // Wait for upload to finish
      await new Promise((resolve, reject) => {
        blobStream.on('error', reject);
        blobStream.on('finish', resolve);
        blobStream.end(file.buffer);
      });

      // 2. Make the file public or get the download URL
      const [url] = await blob.getSignedUrl({
        action: 'read',
        expires: '03-09-2476' // Far future date
      });
      uploadedImageUrlOrPdf = url;
    }

    // 3. Save everything to your database
    const response = await createAnnouncement(adminDc, {
      content: content || title || '',
      scope: targetGroup || 'News',
      category: 'Announcement',
      imageUrl: uploadedImageUrlOrPdf || '',
      authorUid: authorUid || 'pastor_001'
    });

    res.status(201).json({
      id: response?.data?.announcement_insert?.id || response?.id,
      message: 'Announcement successfully created with file!'
    });

  } catch (error) {
    console.error('Backend Crash Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Church-Central Backend listening on port ${PORT}`);
});
