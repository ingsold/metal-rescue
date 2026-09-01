import re

with open('src/pages/ManageEvents.tsx', 'r') as f:
    content = f.read()

content = content.replace("setNombre(event.nombre);", "setNombre(event.nombre || '');")
content = content.replace("setLugar(event.lugar);", "setLugar(event.lugar || '');")
content = content.replace("setDireccion(event.direccion);", "setDireccion(event.direccion || '');")
content = content.replace("setImagenUrl(event.imagen_url);", "setImagenUrl(event.imagen_url || '');")

with open('src/pages/ManageEvents.tsx', 'w') as f:
    f.write(content)
