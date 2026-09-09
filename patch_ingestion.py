with open('src/pages/Ingestion.tsx', 'r') as f:
    content = f.read()

# Replace in first addProduct call (approx line 157)
content = content.replace("        imagen_url: imageUrls[0],\n        imagenes_url: imageUrls,", "        imagenes_url: imageUrls,")

# Replace in second addProduct call (error fallback)
content = content.replace("        imagen_url: imageUrls[0],\n        imagenes_url: imageUrls,", "        imagenes_url: imageUrls,")

with open('src/pages/Ingestion.tsx', 'w') as f:
    f.write(content)

