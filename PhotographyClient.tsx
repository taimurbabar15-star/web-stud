"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Camera, Clock, Image as ImageIcon, ChevronLeft, 
  ChevronRight, X, ZoomIn, Check, Calendar, ArrowRight 
} from "lucide-react";

interface PhotographyClientProps {
  packages: any[];
  projects: any[];
}

export default function PhotographyClient({ packages, projects }: PhotographyClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Derive unique categories
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  // Flat list of images for lightbox browsing
  const filteredProjects = projects.filter(p => selectedCategory === "All" || p.category === selectedCategory);
  
  const allImages = filteredProjects.flatMap(proj => 
    proj.images.map((img: any) => ({
      url: img.imageUrl,
      title: proj.title,
      category: proj.category,
      location: proj.location || "Studio Session",
    }))
  );

  const openLightbox = (url: string) => {
    const idx = allImages.findIndex(img => img.url === url);
    if (idx !== -1) {
      setActiveImageIdx(idx);
      setLightboxOpen(true);
    }
  };

  const handlePrevImage = () => {
    setActiveImageIdx(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full bg-brand-black-deep relative text-brand-text-primary-gray">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center border-b border-white/[0.04] overflow-hidden bg-black">
        {/* Subtle background cover image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1920" 
            alt="Photography Background" 
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black-deep via-transparent to-black" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded bg-brand-gold-premium/15 text-brand-gold-premium text-[10px] font-bold uppercase tracking-widest border border-brand-gold-premium/20">
            BKMSFX Creative Studio
          </span>
          
          <h1 className="font-photography text-4xl sm:text-7xl italic font-semibold text-white tracking-normal leading-[1.05]">
            Your Moment.<br />
            <span className="text-gold-gradient">Your Story. Captured.</span>
          </h1>

          <p className="mt-4 text-xs sm:text-sm text-brand-text-secondary-gray max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
            Premium editorial portraiture, automotive showcases, and high-fashion branding.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a 
              href="#portfolio" 
              className="px-6 py-2.5 rounded bg-white text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:bg-brand-silver-light transition-colors"
            >
              View Portfolio
            </a>
            <a 
              href="#packages" 
              className="px-6 py-2.5 rounded border border-brand-gold-premium/40 bg-brand-gold-premium/5 hover:bg-brand-gold-premium hover:text-brand-black-deep text-brand-gold-premium text-xs font-bold uppercase tracking-wider transition-all"
            >
              Book a Session
            </a>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC MASONRY PORTFOLIO */}
      <section id="portfolio" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="font-photography text-2xl sm:text-3xl italic font-semibold text-brand-text-white">
              Studio Portfolio
            </h2>
            <p className="text-[10px] text-brand-text-secondary-gray mt-1 tracking-widest uppercase">
              Cinematic light, structural framing, and editing
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2.5 rounded bg-brand-black-rich border border-white/[0.05] p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? "bg-brand-gold-premium text-brand-black-deep"
                    : "text-brand-text-secondary-gray hover:text-brand-text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Columns Layout */}
        {allImages.length === 0 ? (
          <div className="text-center py-20 glass-panel border-white/[0.04] rounded-xl max-w-md mx-auto">
            <p className="text-xs text-brand-text-secondary-gray">No portfolio images in this category.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {allImages.map((img, idx) => (
              <motion.div 
                key={idx}
                onClick={() => openLightbox(img.url)}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: (idx % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                data-cursor-label="VIEW"
                className="break-inside-avoid relative cursor-zoom-in futuristic-img-container-gold group mb-6"
              >
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 z-20">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-brand-gold-premium/10 border border-brand-gold-premium/25 text-brand-gold-premium">
                      <ZoomIn className="h-4.5 w-4.5" />
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-gold-premium tracking-widest">{img.category}</span>
                    <h4 className="text-sm font-bold text-white mt-1 uppercase tracking-wide">{img.title}</h4>
                    <p className="text-[10px] text-brand-text-secondary-gray">{img.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. PHOTOGRAPHY PACKAGES SECTION */}
      <section id="packages" className="py-24 bg-brand-black-rich/20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-brand-gold-premium uppercase tracking-widest block mb-3">
              Session Options
            </span>
            <h2 className="font-photography text-3xl sm:text-5xl italic font-semibold text-brand-text-white">
              Photography Packages
            </h2>
            <p className="text-[10px] text-brand-text-secondary-gray mt-1 tracking-widest uppercase">
              Transparent options with secure calendar reservation deposits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const featuresList = pkg.features.split(";");
              
              return (
                <div 
                  key={pkg.id}
                  className="glass-panel border-white/[0.05] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold-premium/25 group"
                >
                  <div>
                    <h3 className="font-photography text-lg italic font-semibold tracking-normal text-brand-text-white group-hover:text-brand-gold-premium transition-colors">
                      {pkg.title}
                    </h3>
                    
                    <p className="text-[11px] text-brand-text-secondary-gray mt-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="my-6">
                      <span className="font-display text-4xl font-black text-white">
                        ${pkg.price.toFixed(0)}
                      </span>
                      <span className="text-[10px] text-brand-text-secondary-gray block mt-2">
                        Requires a <span className="font-semibold text-brand-gold-premium">${pkg.depositAmount.toFixed(0)} deposit</span> to secure booking date.
                      </span>
                    </div>

                    <div className="border-t border-white/[0.04] pt-4 space-y-2 mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-brand-text-secondary-gray flex items-center gap-1.5"><Clock className="h-4 w-4" /> Duration:</span>
                        <span>{pkg.duration} mins</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-brand-text-secondary-gray flex items-center gap-1.5"><ImageIcon className="h-4 w-4" /> Deliverables:</span>
                        <span>{pkg.editedImages} edited images</span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-xs text-brand-text-primary-gray">
                      {featuresList.map((feat: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <Check className="h-4.5 w-4.5 text-brand-gold-premium shrink-0" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      href={`/photography/book?packageId=${pkg.id}`}
                      className="flex w-full items-center justify-center gap-1 py-3 text-xs font-bold uppercase tracking-wider rounded border border-brand-gold-premium/30 bg-brand-gold-premium/10 hover:bg-brand-gold-premium hover:text-brand-black-deep text-brand-gold-premium transition-colors"
                    >
                      Book Session
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. LIGHTBOX OVERLAY */}
      {lightboxOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm">
          {/* Lightbox Header */}
          <div className="flex justify-between items-center text-xs pb-4 border-b border-white/[0.05]">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-gold-premium tracking-wider">
                {allImages[activeImageIdx].category}
              </span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                {allImages[activeImageIdx].title}
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
              onClick={handlePrevImage}
              className="p-3 rounded-full bg-white/5 border border-white/[0.05] hover:bg-white/10 text-brand-text-white transition-colors shrink-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="max-w-4xl max-h-[70vh] flex items-center justify-center p-2 rounded border border-white/[0.05] bg-brand-black-deep relative overflow-hidden">
              <img 
                src={allImages[activeImageIdx].url} 
                alt={allImages[activeImageIdx].title}
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>

            <button 
              onClick={handleNextImage}
              className="p-3 rounded-full bg-white/5 border border-white/[0.05] hover:bg-white/10 text-brand-text-white transition-colors shrink-0"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Lightbox Footer */}
          <div className="text-center text-xs text-brand-text-secondary-gray pt-4 border-t border-white/[0.05]">
            <p className="uppercase tracking-wider">{allImages[activeImageIdx].location}</p>
            <p className="mt-1 text-[10px]">Image {activeImageIdx + 1} of {allImages.length}</p>
          </div>
        </div>
      )}

    </div>
  );
}
