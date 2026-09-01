import re

with open('src/components/ImageGallery.tsx', 'r') as f:
    content = f.read()

content = content.replace("interface ImageGalleryProps {", "interface ImageGalleryProps {\n  thumbnail?: boolean;")

content = content.replace("{safeImages.length > 1 && (", "{!thumbnail && safeImages.length > 1 && (")

content = content.replace("""        <button 
          onClick={toggleFullscreen}
          className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/90 text-white p-2 rounded-md opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10"
          title="Ver detalle"
        >
          <Maximize2 className="w-4 h-4" />
        </button>""", """        {!thumbnail ? (
          <button 
            onClick={toggleFullscreen}
            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/90 text-white p-2 rounded-md opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10"
            title="Ver detalle"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={toggleFullscreen}
            className="absolute inset-0 w-full h-full bg-black/40 opacity-0 group-hover/gallery:opacity-100 flex items-center justify-center text-white transition-opacity z-10"
            title="Ver detalle"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}""")

with open('src/components/ImageGallery.tsx', 'w') as f:
    f.write(content)
