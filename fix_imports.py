import os

files_to_fix = [
    'src/pages/Catalog.tsx',
    'src/pages/MyDonations.tsx',
    'src/pages/AdminPanel.tsx',
    'src/pages/Cart.tsx',
    'src/pages/AdminDonations.tsx',
    'src/pages/AdminOrders.tsx'
]

for file_path in files_to_fix:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if "import { ImageGallery }" not in content:
        # Prepend after the first few imports or just add to the top
        lines = content.split('\n')
        # Find the last import line
        last_import = -1
        for i, line in enumerate(lines):
            if line.startswith("import "):
                last_import = i
        
        if last_import != -1:
            lines.insert(last_import + 1, "import { ImageGallery } from '../components/ImageGallery';")
        else:
            lines.insert(0, "import { ImageGallery } from '../components/ImageGallery';")
            
        with open(file_path, 'w') as f:
            f.write('\n'.join(lines))
