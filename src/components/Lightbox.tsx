import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { ImageItem } from '@/data/images';

interface LightboxProps {
  images: ImageItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, isOpen, onClose, onIndexChange }: LightboxProps) {
  const currentImage = images[currentIndex];

  const goToPrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onIndexChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onIndexChange(newIndex);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    },
    [isOpen, onClose, goToPrev, goToNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToPrev}
        className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="flex-1 flex items-center justify-center px-20 py-8 overflow-hidden">
        <img
          src={currentImage.url}
          alt={currentImage.title}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-fade-in"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <h3 className="text-white font-semibold text-lg mb-1">{currentImage.title}</h3>
        <p className="text-white/60 text-sm">{currentImage.description}</p>
        <p className="text-white/40 text-xs mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => window.open(currentImage.url, '_blank')}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <Download className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
