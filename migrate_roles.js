import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  await signInWithEmailAndPassword(auth, 'admin@metalrescue.org', 'admin123');
  console.log("Logged in as admin");

  console.log("Creating roles...");
  await setDoc(doc(db, 'roles', 'donante'), {
    name: 'donante',
    description: 'Usuario Donante',
    createdAt: new Date().toISOString()
  });
  
  await setDoc(doc(db, 'roles', 'administrador'), {
    name: 'administrador',
    description: 'Administrador del Sistema',
    createdAt: new Date().toISOString()
  });
  console.log("Roles created.");

  console.log("Migrating users...");
  const usersSnap = await getDocs(collection(db, 'users'));
  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data();
    if (data.role === 'usuario_donante') {
      await updateDoc(userDoc.ref, { role: 'donante' });
      console.log(`Updated user ${userDoc.id} to donante`);
    }
  }
  console.log("Migration complete.");
  process.exit(0);
}
run().catch(console.error);
