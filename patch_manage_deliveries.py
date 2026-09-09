import re

with open('src/pages/ManageDeliveries.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { resizeImage } from '../lib/imageUtils';", "import { resizeImage } from '../lib/imageUtils';\nimport { ImageGallery } from '../components/ImageGallery';")

old_img_block = """                    <div className="w-full sm:w-48 h-48 flex-shrink-0 relative overflow-hidden">
                      <img src={images[0]} alt={delivery.refugio_nombre} className="w-full h-full object-cover" />
                      {images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-bold">
                          +{images.length - 1}
                        </div>
                      )}
                    </div>"""

new_img_block = """                    <div className="w-full sm:w-48 h-48 flex-shrink-0 relative overflow-hidden">
                      <ImageGallery images={images} alt={delivery.refugio_nombre} thumbnail={true} />
                      {images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-bold pointer-events-none">
                          +{images.length - 1}
                        </div>
                      )}
                    </div>"""

content = content.replace(old_img_block, new_img_block)

with open('src/pages/ManageDeliveries.tsx', 'w') as f:
    f.write(content)
