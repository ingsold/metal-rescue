import re

with open('src/pages/ManageEvents.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Event } from '../types';", "import { Event } from '../types';\nimport { resizeImage } from '../lib/imageUtils';")

old_handler = """  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };"""

new_handler = """  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      try {
        const compressedBase64 = await resizeImage(file, 800, 800);
        setImagenUrl(compressedBase64);
      } catch (err) {
        console.error("Error resizing image:", err);
      }
    }
  };"""

content = content.replace(old_handler, new_handler)

with open('src/pages/ManageEvents.tsx', 'w') as f:
    f.write(content)
