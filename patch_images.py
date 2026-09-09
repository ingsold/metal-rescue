import re
import glob

# 1. Update Product type
with open('src/types.ts', 'r') as f:
    content = f.read()
content = content.replace("  imagen_url: string;\n  imagenes_url?: string[];", "  imagenes_url: string[];")
with open('src/types.ts', 'w') as f:
    f.write(content)

# 2. Update ImageGallery usage in various files
files_with_gallery = [
    'src/pages/AdminPanel.tsx',
    'src/pages/Catalog.tsx',
    'src/pages/AdminOrders.tsx',
    'src/pages/Cart.tsx',
    'src/pages/AdminDonations.tsx',
    'src/pages/MyDonations.tsx',
]

for file_path in files_with_gallery:
    with open(file_path, 'r') as f:
        file_content = f.read()
    
    # Replace the complex ternary with just item.imagenes_url
    # e.g., product.imagenes_url && product.imagenes_url.length > 0 ? product.imagenes_url : [product.imagen_url]
    # or item.imagenes_url && item.imagenes_url.length > 0 ? item.imagenes_url : [item.imagen_url]
    file_content = re.sub(r'(?:product|item)\.imagenes_url\s*&&\s*(?:product|item)\.imagenes_url\.length\s*>\s*0\s*\?\s*(?:product|item)\.imagenes_url\s*:\s*\[(?:product|item)\.imagen_url\]', r'\g<0>', file_content) # Wait, better to use precise replace
    
    # Just generic replace for all known patterns
    file_content = file_content.replace(
        "images={product.imagenes_url && product.imagenes_url.length > 0 ? product.imagenes_url : [product.imagen_url]}",
        "images={product.imagenes_url || []}"
    )
    file_content = file_content.replace(
        "images={item.imagenes_url && item.imagenes_url.length > 0 ? item.imagenes_url : [item.imagen_url]}",
        "images={item.imagenes_url || []}"
    )
    
    with open(file_path, 'w') as f:
        f.write(file_content)

# 3. Fix MyOrders.tsx which uses img tag directly
with open('src/pages/MyOrders.tsx', 'r') as f:
    file_content = f.read()
file_content = file_content.replace(
    "{item.imagen_url && (\n                          <img src={item.imagen_url}",
    "{item.imagenes_url && item.imagenes_url.length > 0 && (\n                          <img src={item.imagenes_url[0]}"
)
with open('src/pages/MyOrders.tsx', 'w') as f:
    f.write(file_content)

