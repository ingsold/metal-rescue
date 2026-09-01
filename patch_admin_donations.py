import re

with open('src/pages/AdminDonations.tsx', 'r') as f:
    content = f.read()

old_img_block = """<img src={product.imagen_url} alt={product.banda_artista} className="w-full h-full object-cover opacity-80" />"""
new_img_block = """<ImageGallery images={product.imagenes_url && product.imagenes_url.length > 0 ? product.imagenes_url : [product.imagen_url]} alt={product.banda_artista} />"""

content = content.replace(old_img_block, new_img_block)

with open('src/pages/AdminDonations.tsx', 'w') as f:
    f.write(content)
