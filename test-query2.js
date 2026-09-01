import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function test() {
  try {
    const publicQ = query(collection(db, 'products'), where('estado_publicacion', 'in', ['aprobado_publicado', 'vendido', 'reservada']));
    await getDocs(publicQ);
    console.log("publicQ Success!");
  } catch (err) {
    console.error("publicQ Failed:", err.message);
  }
  process.exit(0);
}
test();
