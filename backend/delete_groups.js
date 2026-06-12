const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://church-central-992a7-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();

async function run() {
  const groupsRef = db.ref('groups');
  const snapshot = await groupsRef.once('value');
  const groups = snapshot.val();
  
  if (!groups) {
    console.log("No groups found.");
    process.exit(0);
  }
  
  for (const [key, group] of Object.entries(groups)) {
    const nameLower = (group.name || '').toLowerCase();
    if (nameLower.includes('main campus') || nameLower.includes('central district')) {
      console.log(`Deleting group ${key}: ${group.name}`);
      await groupsRef.child(key).remove();
    }
  }
  console.log("Done");
  process.exit(0);
}

run();
