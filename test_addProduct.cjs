// Just testing the exact payload
const payload = {
  imagenes_url: [ "base64" ],
  banda_artista: "Test",
  tipo_prenda: "Playera",
  estado_conservacion: "Vintage",
  origen_adquisicion: "Mercado Local",
  precio_estimado_donante: 100,
  estado_publicacion: 'borrador_pendiente',
  fecha_donacion: new Date().toISOString(),
  evento_origen: "",
  usuario_donante_id: "lLfx5kS4XkR8GRI4xploqZ6f3VP2",
  usuario_donante_nombre: "Ingsold"
};

const rules = `
                       incoming().keys().hasAll(['imagenes_url', 'banda_artista', 'tipo_prenda', 'estado_conservacion', 'origen_adquisicion', 'precio_estimado_donante', 'estado_publicacion', 'fecha_donacion', 'evento_origen', 'usuario_donante_id', 'usuario_donante_nombre']) && 
                       incoming().imagenes_url is list && incoming().imagenes_url.size() > 0 &&
                       incoming().banda_artista is string && incoming().banda_artista.size() <= 100 && 
                       incoming().tipo_prenda is string && incoming().tipo_prenda.size() <= 50 && 
                       incoming().estado_conservacion is string && incoming().estado_conservacion.size() <= 50 && 
                       incoming().origen_adquisicion is string && incoming().origen_adquisicion.size() <= 100 &&
                       incoming().precio_estimado_donante is number && 
                       incoming().estado_publicacion == 'borrador_pendiente' && 
                       incoming().fecha_donacion is string && incoming().fecha_donacion.size() <= 100 &&
                       incoming().evento_origen is string && incoming().evento_origen.size() <= 100 &&
                       incoming().usuario_donante_id == request.auth.uid && 
                       incoming().usuario_donante_nombre is string && incoming().usuario_donante_nombre.size() <= 100;
`;
// Is there any edge case?
