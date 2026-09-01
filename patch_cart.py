import re

with open('src/pages/Cart.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';",
    "import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';\nimport { ImageGallery } from '../components/ImageGallery';"
)

old_img = """<img src={item.imagen_url} alt={item.banda_artista} className="w-24 h-24 object-cover rounded-md" />"""
new_img = """<div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0"><ImageGallery images={item.imagenes_url && item.imagenes_url.length > 0 ? item.imagenes_url : [item.imagen_url]} alt={item.banda_artista} thumbnail /></div>"""

content = content.replace(old_img, new_img)

with open('src/pages/Cart.tsx', 'w') as f:
    f.write(content)
