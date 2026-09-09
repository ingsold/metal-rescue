import re

with open('firestore.rules', 'r') as f:
    content = f.read()

target = """      allow create: if isSignedIn() && 
                       incoming().keys().hasAll(['imagen_url', 'banda_artista', 'tipo_prenda', 'estado_conservacion', 'precio_estimado_donante', 'estado_publicacion', 'fecha_donacion', 'usuario_donante_id', 'usuario_donante_nombre']) && 
                       incoming().imagen_url is string && 
                       incoming().banda_artista is string && incoming().banda_artista.size() <= 100 && 
                       incoming().tipo_prenda is string && incoming().tipo_prenda.size() <= 50 && 
                       incoming().estado_conservacion is string && incoming().estado_conservacion.size() <= 50 && 
                       incoming().precio_estimado_donante is number && 
                       incoming().estado_publicacion == 'borrador_pendiente' && 
                       incoming().fecha_donacion is string && incoming().fecha_donacion.size() <= 100 && 
                       incoming().usuario_donante_id == request.auth.uid && 
                       incoming().usuario_donante_nombre is string && incoming().usuario_donante_nombre.size() <= 100;"""

replacement = """      allow create: if isSignedIn() && 
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
                       incoming().usuario_donante_nombre is string && incoming().usuario_donante_nombre.size() <= 100;"""

# Standardize spaces for easier matching
content_clean = re.sub(r'\s+', ' ', content)
target_clean = re.sub(r'\s+', ' ', target)
replacement_clean = replacement

if target_clean in content_clean:
    # Just do a manual substring replace based on regular expressions
    content = re.sub(r'allow create: if isSignedIn\(\) &&\s*incoming\(\)\.keys\(\)\.hasAll\(\[\'imagen_url\'[^;]+;', replacement, content)
    with open('firestore.rules', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find target block")

