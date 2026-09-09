const { readFileSync } = require('fs');
const product = {
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
        imagenes_url: ["base64string"],
        estado_publicacion: 'borrador_pendiente',
        fecha_donacion: new Date().toISOString(),
        usuario_donante_id: "lLfx5kS4XkR8GRI4xploqZ6f3VP2",
        usuario_donante_nombre: "Ingsold"
}
console.log(Object.keys(product));
const required = ['imagenes_url', 'banda_artista', 'tipo_prenda', 'estado_conservacion', 'origen_adquisicion', 'precio_estimado_donante', 'estado_publicacion', 'fecha_donacion', 'evento_origen', 'usuario_donante_id', 'usuario_donante_nombre'];
const hasAll = required.every(r => Object.keys(product).includes(r));
console.log("hasAll", hasAll);
