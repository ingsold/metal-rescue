import re

with open('src/pages/AdminOrders.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';",
    "import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';\nimport { ImageGallery } from '../components/ImageGallery';"
)

old_img = """<img src={item.imagen_url} alt={item.banda_artista} className="w-12 h-12 object-cover rounded" />"""
new_img = """<div className="w-12 h-12 rounded overflow-hidden flex-shrink-0"><ImageGallery images={item.imagenes_url && item.imagenes_url.length > 0 ? item.imagenes_url : [item.imagen_url]} alt={item.banda_artista} thumbnail /></div>"""

content = content.replace(old_img, new_img)

with open('src/pages/AdminOrders.tsx', 'w') as f:
    f.write(content)
