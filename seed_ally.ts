import { db } from './src/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const mockAlly = {
  nombre: "Dirección de Bienestar Animal Muniguate",
  telefono: "4479 7830",
  email: "bienestaranimal@muniguate.com",
  descripcion: "Entidad municipal dedicada a la protección, rescate y bienestar de los animales en la Ciudad de Guatemala.",
  imagen: "/logo unidad.png",
  redes_sociales: "https://www.facebook.com/muniguate"
};

const run = async () => {
  try {
    const id = `ally_muniguate`;
    await setDoc(doc(db, 'allies', id), mockAlly);
    console.log("Mock ally created successfully:", id);
    process.exit(0);
  } catch (error) {
    console.error("Error creating mock ally:", error);
    process.exit(1);
  }
};

run();
