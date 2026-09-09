import { db } from './src/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const run = async () => {
  const querySnapshot = await getDocs(collection(db, 'allies'));
  console.log("Allies count:", querySnapshot.size);
  querySnapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data().nombre);
  });
  
  const deliveriesSnapshot = await getDocs(collection(db, 'deliveries'));
  console.log("Deliveries count:", deliveriesSnapshot.size);
  process.exit(0);
};
run();
