require('dotenv').config({ path: __dirname + '/.env' });
const admin = require('firebase-admin');

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'church-central-992a7',
  storageBucket: 'church-central-992a7.firebasestorage.app'
};

if (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  firebaseAdminConfig.credential = admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
  });
} else {
  firebaseAdminConfig.credential = admin.credential.applicationDefault();
}

try {
  admin.initializeApp(firebaseAdminConfig);
} catch (e) {
  console.log('Firebase already initialized');
}

async function setCors() {
  console.log('Configuring CORS for Firebase Storage bucket...');
  const bucket = admin.storage().bucket();

  const corsConfiguration = [
    {
      origin: ['*'], // In production, replace with your domain, e.g., ['https://church-central-992a7.web.app']
      method: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'HEAD'],
      responseHeader: ['*'],
      maxAgeSeconds: 3600,
    },
  ];

  try {
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log('✅ CORS configuration successfully set for the storage bucket!');
  } catch (error) {
    console.error('❌ Error setting CORS configuration:', error);
  } finally {
    process.exit(0);
  }
}

setCors();
