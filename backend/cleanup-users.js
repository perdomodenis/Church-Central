require('dotenv').config({ path: './backend/.env' });
const admin = require('firebase-admin');

// Initialize Firebase Admin (using default credentials or env vars)
// If you run this script locally, make sure you have FIREBASE_ADMIN_PROJECT_ID,
// FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY set in backend/.env
// Or have GOOGLE_APPLICATION_CREDENTIALS set.
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'church-central-992a7',
  databaseURL: 'https://church-central-992a7-default-rtdb.europe-west1.firebasedatabase.app'
};

if (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  firebaseAdminConfig.credential = admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
  });
} else {
  // Fallback to application default credentials
  firebaseAdminConfig.credential = admin.credential.applicationDefault();
}

try {
  admin.initializeApp(firebaseAdminConfig);
} catch (e) {
  console.log('Firebase already initialized or missing credentials.');
}

const shouldKeepUser = (email) => {
  if (!email) return false;
  const lowerEmail = email.toLowerCase();
  return lowerEmail.includes('test') || lowerEmail.includes('erisk');
};

async function cleanup() {
  console.log('Starting cleanup process...');

  try {
    // 1. Cleanup Firebase Auth
    console.log('\n--- Cleaning Firebase Auth ---');
    let pageToken;
    let deletedAuthCount = 0;
    
    do {
      const listUsersResult = await admin.auth().listUsers(1000, pageToken);
      pageToken = listUsersResult.pageToken;
      
      for (const userRecord of listUsersResult.users) {
        if (!shouldKeepUser(userRecord.email)) {
          await admin.auth().deleteUser(userRecord.uid);
          console.log(`Deleted from Auth: ${userRecord.email} (${userRecord.uid})`);
          deletedAuthCount++;
        } else {
          console.log(`Kept in Auth: ${userRecord.email}`);
        }
      }
    } while (pageToken);
    
    console.log(`Finished cleaning Auth. Deleted ${deletedAuthCount} users.`);

    // 2. Cleanup Realtime Database
    console.log('\n--- Cleaning Realtime Database ---');
    const db = admin.database();
    const usersRef = db.ref('users');
    const snapshot = await usersRef.once('value');
    let deletedRtdbCount = 0;

    if (snapshot.exists()) {
      const updates = {};
      snapshot.forEach((childSnapshot) => {
        const uid = childSnapshot.key;
        const userData = childSnapshot.val();
        
        if (!shouldKeepUser(userData.email)) {
          updates[uid] = null; // Mark for deletion
          console.log(`Marked for deletion from RTDB: ${userData.email || uid}`);
          deletedRtdbCount++;
        }
      });

      if (Object.keys(updates).length > 0) {
        await usersRef.update(updates);
        console.log(`Finished cleaning RTDB. Deleted ${deletedRtdbCount} users.`);
      } else {
        console.log('No users to delete in RTDB.');
      }
    } else {
      console.log('No users found in RTDB.');
    }

    // 3. PostgreSQL / Data Connect Instructions
    console.log('\n--- Data Connect (PostgreSQL) Cleanup ---');
    console.log('Since Data Connect uses a Cloud SQL database, you must run a SQL query to delete the fake users from the "user" table.');
    console.log('Run this command in your terminal:');
    console.log('\n  npx firebase dataconnect:sql -q "DELETE FROM \\"user\\" WHERE email NOT ILIKE \'%test%\' AND email NOT ILIKE \'%erisk%\';"');
    console.log('\n(Alternatively, you can run this query directly in the Google Cloud SQL Studio)');

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    process.exit(0);
  }
}

cleanup();
