"use client";

import { useState } from "react";
import { 
  Heart, Download, Eye, EyeOff, ZoomIn, 
  X, ChevronLeft, ChevronRight, Share2, Sparkles, FolderDown 
} from "lucide-react";
import { incrementGalleryDownloadsAction } from "@/app/actions/gallery";

interface ClientGalleryViewerProps {
  gallery: any;
}

export default function ClientGalleryViewer({ gallery }: ClientGalleryViewerProps) {
  const images: string[] = JSON.parse(gallery.images || "[]");
  
  // Watermark toggle state
  const [watermark, setWatermark] = useState(true);
  
  // Selection/Favorites states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedForDownload, setSelectedForDownload] = useState<string[]>([]);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const toggleFavorite = (url: string) => {
    setFavorites(prev => 
      prev.includes(url) ? prev.filter(item => item !== url) : [...prev, url]
    );
  };

  const toggleSelectForDownload = (url: string) => {
    setSelectedForDownload(prev =>
      prev.includes(url) ? prev.filter(item => item !== url) : [...prev, url]
    );
  };

  const handleDownloadAll = async () => {
    // Increment download metrics in DB
    await incrementGalleryDownloadsAction(gallery.id);
    alert(`Downloading all ${images.length} high-resolution photos in ZIP archive format... (Simulated)`);
  };

  const handleDownloadSelected = async () => {
    if (selectedForDownload.length === 0) return;
    await incrementGalleryDownloadsAction(gallery.id);
    alert(`Downloading ${selectedForDownload.length} selected photos... (Simulated)`);
  };

  const openLightbox = (url: string) => {
    const idx = images.indexOf(url);
    if (idx !== -1) {
      setActiveImageIdx(idx);
      setLightboxOpen(true);
    }
  };

  const handlePrev = () => {
    setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-brand-text-primary-gray">
      
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/[0.04] pb-8">
        <div>
          <span className="text-[10px] font-bold text-brand-gold-premium uppercase tracking-widest block mb-2">
            Secure client gallery
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-black uppercase text-brand-text-white tracking-wide">
            {gallery.title}
          </h1>
          <p className="text-xs text-brand-text-secondary-gray mt-1 leading-normal">
            Prepared for <strong className="text-brand-text-white">{gallery.user.name}</strong> • Created on {new Date(gallery.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Watermark Toggle */}
          <button
            onClick={() => setWatermark(!watermark)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border transition-colors ${
              watermark
                ? "bg-brand-gold-premium/10 border-brand-gold-premium/30 text-brand-gold-premium"
                : "border-white/[0.08] hover:border-white/20 text-brand-text-secondary-gray"
            }`}
          >
            {watermark ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Watermark {watermark ? "On" : "Off"}
          </button>

          {/* Download Selected */}
          <button
            onClick={handleDownloadSelected}
            disabled={selectedForDownload.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border border-white/[0.08] hover:border-white/20 text-brand-text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Selected ({selectedForDownload.length})
          </button>

          {/* Download All */}
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-gold-premium hover:bg-brand-gold-bright text-brand-black-deep text-xs font-bold rounded uppercase tracking-wider transition-colors shadow-lg shadow-brand-gold-premium/10"
          >
            <FolderDown className="h-4 w-4" />
            Download All
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {images.length === 0 ? (
        <div className="text-center py-24 glass-panel border-white/[0.04] rounded-xl max-w-md mx-auto">
          <p className="text-xs text-brand-text-secondary-gray">This private gallery is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, idx) => {
            const isFav = favorites.includes(img);
            const isSel = selectedForDownload.includes(img);
            
            return (
              <div 
                key={idx} 
                className="glass-panel border-white/[0.05] rounded-xl overflow-hidden relative group aspect-[4/5] flex flex-col justify-between"
              >
                {/* Image block */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-brand-black-rich">
                  <img 
                    src={img} 
                    alt={`Gallery Image ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Diagonal Watermark Text Overlay */}
                  {watermark && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-30 select-none">
                      <span className="text-[20px] font-black uppercase text-white/40 tracking-[10px] -rotate-45 whitespace-nowrap border-y-2 border-white/10 px-8 py-2">
                        BKMSFX photography
                      </span>
                    </div>
                  )}
                </div>

                {/* Floating controls */}
                <div className="relative z-10 p-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleSelectForDownload(img)}
                    className={`p-2 rounded-full border transition-colors ${
                      isSel 
                        ? "bg-brand-blue-electric border-brand-blue-electric text-white" 
                        : "bg-black/40 border-white/20 text-white hover:bg-black/75"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => toggleFavorite(img)}
                    className={`p-2 rounded-full border transition-colors ${
                      isFav 
                        ? "bg-red-500 border-red-500 text-white" 
                        : "bg-black/40 border-white/20 text-white hover:bg-black/75"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* Bottom Overlay Detail bar */}
                <div className="relative z-10 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => openLightbox(img)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/15 border border-white/20 backdrop-blur-sm text-[10px] font-bold text-white uppercase hover:bg-white/20 transition-all"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  <span className="text-[10px] font-mono text-white/50">#{idx + 1}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX OVERLAY */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm">
          {/* Lightbox Header */}
          <div className="flex justify-between items-center text-xs pb-4 border-b border-white/[0.05]">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-gold-premium tracking-wider">
                Preview Frame
              </span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                {gallery.title} — Image {activeImageIdx + 1}
              </h4>
            </div>
            <button 
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/5 border border-white/[0.08] hover:bg-white/10 text-brand-text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lightbox Center */}
          <div className="flex-grow flex items-center justify-between gap-4 max-h-[75vh]">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/5 border border-white/[0.05] hover:bg-white/10 text-brand-text-white transition-colors shrink-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="max-w-4xl max-h-[70vh] flex items-center justify-center p-2 rounded border border-white/[0.05] bg-brand-black-deep relative overflow-hidden">
              <img 
                src={images[activeImageIdx]} 
                alt="Lightbox Zoom"
                className="max-w-full max-h-[65vh] object-contain"
              />

              {/* Watermark in lightbox */}
              {watermark && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-30 select-none">
                  <span className="text-[20px] font-black uppercase text-white/40 tracking-[10px] -rotate-45 whitespace-nowrap border-y-2 border-white/10 px-8 py-2">
                    BKMSFX photography
                  </span>
                </div>
              )}
            </div>

            <button 
              onClick={handleNext}
              className="p-3 rounded-full bg-white/5 border border-white/[0.05] hover:bg-white/10 text-brand-text-white transition-colors shrink-0"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Lightbox Footer */}
          <div className="text-center text-xs text-brand-text-secondary-gray pt-4 border-t border-white/[0.05]">
            <div className="flex justify-center gap-4 text-[11px] mb-2">
              <button
                onClick={() => toggleFavorite(images[activeImageIdx])}
                className="hover:text-brand-text-white transition-colors flex items-center gap-1"
              >
                <Heart className={`h-4 w-4 ${favorites.includes(images[activeImageIdx]) ? "text-red-500 fill-current" : ""}`} />
                {favorites.includes(images[activeImageIdx]) ? "Favorited" : "Favorite"}
              </button>
              <button
                onClick={() => toggleSelectForDownload(images[activeImageIdx])}
                className="hover:text-brand-text-white transition-colors flex items-center gap-1"
              >
                <Download className={`h-4 w-4 ${selectedForDownload.includes(images[activeImageIdx]) ? "text-brand-blue-bright" : ""}`} />
                {selectedForDownload.includes(images[activeImageIdx]) ? "Selected" : "Select for download"}
              </button>
            </div>
            <p className="text-[10px]">Image {activeImageIdx + 1} of {images.length}</p>
          </div>
        </div>
      )}

    </div>
  );
}
