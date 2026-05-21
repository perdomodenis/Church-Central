const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

function initializeFirebaseAdmin() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    return;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    return;
  }

  throw new Error(
    'Firebase Admin credentials are not configured. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_ADMIN_* env vars.'
  );
}

initializeFirebaseAdmin();

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/register', async (req, res) => {
  const { email, password, court = '', department = '', role = '' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email und Passwort sind erforderlich.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Das Passwort muss mindestens 6 Zeichen lang sein.' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    });

    await admin.firestore().doc(`users/${userRecord.uid}`).set({
      email,
      court,
      department,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({ error: error.message || 'Registrierung fehlgeschlagen.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
