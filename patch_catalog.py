import re

with open('src/pages/Catalog.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { ShoppingCart, Filter, Search, Tag, CheckCircle, ShieldAlert, BadgeCheck, Zap } from 'lucide-react';",
    "import { ShoppingCart, Filter, Search, Tag, CheckCircle, ShieldAlert, BadgeCheck, Zap } from 'lucide-react';\nimport { ImageGallery } from '../components/ImageGallery';"
)

old_img_block = """              <img 
                src={product.imagen_url} 
                alt={product.banda_artista}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />"""

new_img_block = """              <ImageGallery 
                images={product.imagenes_url && product.imagenes_url.length > 0 ? product.imagenes_url : [product.imagen_url]} 
                alt={product.banda_artista} 
              />"""

content = content.replace(old_img_block, new_img_block)

with open('src/pages/Catalog.tsx', 'w') as f:
    f.write(content)
