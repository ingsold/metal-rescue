import { db } from './src/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const mockDelivery = {
  refugio_nombre: "Refugio Patitas Desamparadas",
  monto_donado_gtq: 3500,
  alimento_comprado_kg: 250,
  foto_evidencia_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
  galeria_urls: [
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800"
  ],
  fecha_entrega: new Date().toISOString(),
  descripcion_impacto: "Gracias a los fondos recaudados en el evento de septiembre, pudimos donar 250kg de alimento balanceado, medicinas y material de limpieza para más de 40 perritos rescatados. ¡El metal salva vidas!"
};

const run = async () => {
  try {
    const id = `del_mock_${Date.now()}`;
    await setDoc(doc(db, 'deliveries', id), mockDelivery);
    console.log("Mock delivery created successfully:", id);
    process.exit(0);
  } catch (error) {
    console.error("Error creating mock delivery:", error);
    process.exit(1);
  }
};

run();
