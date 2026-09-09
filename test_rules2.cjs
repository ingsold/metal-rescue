const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const fs = require('fs');

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'demo-test',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });

  const authUser = testEnv.authenticatedContext('lLfx5kS4XkR8GRI4xploqZ6f3VP2', { email: 'ingsold@gmail.com' });
  const db = authUser.firestore();

  try {
    await db.collection('products').doc('p_123').set({
      banda_artista: "Test",
      tipo_prenda: "Playera",
      talla: "L",
      estado_conservacion: "Vintage",
      origen_adquisicion: "Mercado Local",
      evento_origen: "",
      precio_estimado_donante: 100,
      precio_sugerido_ia: 0,
      autenticidad_ia: 'Desconocido',
      descripcion_marketing: '',
      imagenes_url: ["base64"],
      estado_publicacion: 'borrador_pendiente',
      fecha_donacion: new Date().toISOString(),
      usuario_donante_id: "lLfx5kS4XkR8GRI4xploqZ6f3VP2",
      usuario_donante_nombre: "Ingsold"
    });
    console.log("SUCCESS");
  } catch(e) {
    console.error("FAIL:", e.message);
  }

  await testEnv.cleanup();
}

main();
