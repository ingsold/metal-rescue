import re

with open('src/pages/ManageDeliveries.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ShelterDelivery } from '../types';", "import { ShelterDelivery } from '../types';\nimport { resizeImage } from '../lib/imageUtils';")

old_handler = """  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGaleriaUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };"""

new_handler = """  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      for (const file of files) {
        try {
          const compressedBase64 = await resizeImage(file, 800, 800);
          setGaleriaUrls(prev => [...prev, compressedBase64]);
        } catch (err) {
          console.error("Error resizing image:", err);
        }
      }
    }
  };"""

content = content.replace(old_handler, new_handler)

with open('src/pages/ManageDeliveries.tsx', 'w') as f:
    f.write(content)
