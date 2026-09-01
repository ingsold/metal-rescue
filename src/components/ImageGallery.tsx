import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ImageGalleryProps {
  thumbnail?: boolean;
  images: string[];
  alt: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt, thumbnail = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const safeImages = images && images.length > 0 ? images : [];
  
  if (safeImages.length === 0) {
    return (
      <div className="w-full h-full bg-sabbath-800 flex items-center justify-center text-zinc-500">
        Sin imagen
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <div className="relative w-full h-full group/gallery">
        <img 
          src={safeImages[currentIndex]} 
          alt={`${alt} - ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {!thumbnail && safeImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {safeImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}

        {!thumbnail ? (
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
        )}
      </div>

      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center backdrop-blur-md"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFullscreen(false);
          }}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10 bg-black/50 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            title="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>
          
          <img 
            src={safeImages[currentIndex]} 
            alt={`${alt} - ${currentIndex + 1} (Fullscreen)`}
            className="max-w-full max-h-[90vh] object-contain transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          />
          
          {safeImages.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/30 px-3 py-1.5 rounded-full">
                {safeImages.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
