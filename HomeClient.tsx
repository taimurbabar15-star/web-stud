"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, Camera, ArrowRight, ShieldCheck, 
  ChevronDown, BookOpen, Quote, HelpCircle, Calendar, ChevronRight 
} from "lucide-react";

interface HomeClientProps {
  initialFaqs: any[];
  initialTestimonials: any[];
  initialBlogPosts: any[];
}

export default function HomeClient({ initialFaqs, initialTestimonials, initialBlogPosts }: HomeClientProps) {
  const router = useRouter();
  // Hero hover state: 'default' | 'trading' | 'photography'
  const [hoveredExperience, setHoveredExperience] = useState<"default" | "trading" | "photography">("default");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [revealActive, setRevealActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setRevealActive(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / (width / 2); // -1 to 1
    const y = (clientY - top - height / 2) / (height / 2); // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="relative w-full overflow-hidden bg-brand-black-deep">
      
      {/* 1. CINEMATIC SPLIT CURTAIN HERO */}
      <section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-[85vh] sm:h-[90vh] w-full flex flex-col md:flex-row overflow-hidden border-b border-white/[0.05] bg-black select-none"
      >
        
        {/* TRADING DIVISION CURTAIN (LEFT) */}
        <div 
          onMouseEnter={() => setHoveredExperience("trading")}
          onMouseLeave={() => setHoveredExperience("default")}
          onClick={() => router.push("/trading")}
          data-cursor-label="TRADE"
          className={`group relative h-1/2 md:h-full transition-all duration-[800ms] ease-in-out cursor-pointer flex flex-col justify-between p-6 sm:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.08] ${
            hoveredExperience === "trading" 
              ? "md:flex-[2.5] flex-[1.5] bg-brand-blue-electric/[0.02]" 
              : hoveredExperience === "photography"
                ? "md:flex-[0.5] flex-[0.5] opacity-25"
                : "flex-1"
          }`}
        >
          {/* Collage of pics inside Trading background (Parallax shifted) */}
          <div 
            className="absolute inset-0 z-0 grid grid-cols-2 gap-2 p-4 opacity-40 group-hover:opacity-85 transition-all duration-[800ms] ease-in-out"
            style={{ 
              transform: `translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 0)`,
              willChange: "transform"
            }}
          >
            <div className="relative h-full w-full rounded overflow-hidden">
              <img 
                src="/images/courses/course_1.jpg" 
                className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.7] scale-100 group-hover:scale-110 transition-all duration-[2000ms] ease-out" 
              />
            </div>
            <div className="relative h-full w-full rounded overflow-hidden">
              <img 
                src="/images/courses/course_2.jpg" 
                className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.7] scale-100 group-hover:scale-110 transition-all duration-[2000ms] ease-out" 
              />
            </div>
            <div className="relative h-full w-full rounded overflow-hidden col-span-2">
              <img 
                src="/images/courses/course_3.jpg" 
                className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.7] scale-100 group-hover:scale-110 transition-all duration-[2000ms] ease-out" 
              />
            </div>
          </div>
          
          {/* Glowing Blue Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black-deep via-brand-black-deep/80 to-transparent z-10" />
          <div className={`absolute inset-0 bg-brand-blue-electric/15 mix-blend-overlay transition-opacity duration-500 z-10 ${hoveredExperience === "trading" ? "opacity-100" : "opacity-40"}`} />

          {/* Futuristic corner framing */}
          <div className="absolute top-4 left-4 h-4 w-4 border-t border-l border-brand-blue-electric/40" />
          <div className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-brand-blue-electric/40" />

          {/* Content (Counter-Parallax shifted) */}
          <div 
            className="relative z-20 flex flex-col justify-between h-full transition-transform duration-700 ease-out"
            style={{ 
              transform: `translate3d(${mousePos.x * -12}px, ${mousePos.y * -12}px, 0)`,
              willChange: "transform"
            }}
          >
            <div>
              <span className="text-[10px] font-bold text-brand-blue-bright uppercase tracking-widest bg-brand-blue-electric/15 border border-brand-blue-electric/25 px-2 py-0.5 rounded">
                Division 01
              </span>
            </div>

            <div className="my-auto py-8">
              <h2 className="font-display text-2xl sm:text-5xl font-black uppercase text-brand-text-white tracking-tight leading-none">
                <span className={`reveal-text-wrapper ${revealActive ? "active" : ""}`}>
                  <span className="reveal-text-line" style={{ transitionDelay: "100ms" }}>BKMSFX</span>
                </span>
                <br />
                <span className={`reveal-text-wrapper ${revealActive ? "active" : ""}`}>
                  <span className="reveal-text-line text-brand-blue-bright" style={{ transitionDelay: "250ms" }}>Trading</span>
                </span>
              </h2>
              <p className={`text-xs text-brand-text-secondary-gray mt-4 max-w-sm leading-relaxed transition-all duration-500 ${
                hoveredExperience === "trading" ? "opacity-100" : "opacity-0 md:h-0 overflow-hidden"
              }`}>
                Master institutional order blocks, liquidity sweeps, and price imbalances under our structured LMS academy program.
              </p>
            </div>

            <div>
              <button 
                onClick={(e) => { e.stopPropagation(); router.push("/trading"); }}
                className="px-6 py-2.5 bg-brand-blue-electric hover:bg-brand-blue-bright text-white text-[11px] font-black uppercase tracking-widest rounded transition-all shadow-lg shadow-brand-blue-electric/10 flex items-center gap-1.5"
              >
                Enter Academy
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* PHOTOGRAPHY DIVISION CURTAIN (RIGHT) */}
        <div 
          onMouseEnter={() => setHoveredExperience("photography")}
          onMouseLeave={() => setHoveredExperience("default")}
          onClick={() => router.push("/photography")}
          data-cursor-label="VIEW"
          className={`group relative h-1/2 md:h-full transition-all duration-[800ms] ease-in-out cursor-pointer flex flex-col justify-between p-6 sm:p-12 overflow-hidden ${
            hoveredExperience === "photography" 
              ? "md:flex-[2.5] flex-[1.5] bg-brand-gold-premium/[0.02]" 
              : hoveredExperience === "trading"
                ? "md:flex-[0.5] flex-[0.5] opacity-25"
                : "flex-1"
          }`}
        >
          {/* Collage of pics inside Photography background (Parallax shifted) */}
          <div 
            className="absolute inset-0 z-0 grid grid-cols-2 gap-2 p-4 opacity-40 group-hover:opacity-85 transition-all duration-[800ms] ease-in-out"
            style={{ 
              transform: `translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 0)`,
              willChange: "transform"
            }}
          >
            <div className="relative h-full w-full rounded overflow-hidden">
              <img 
                src="/images/portfolio/portrait_1.jpg" 
                className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.7] scale-100 group-hover:scale-110 transition-all duration-[2000ms] ease-out" 
              />
            </div>
            <div className="relative h-full w-full rounded overflow-hidden">
              <img 
                src="/images/portfolio/auto_1.jpg" 
                className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.7] scale-100 group-hover:scale-110 transition-all duration-[2000ms] ease-out" 
              />
            </div>
            <div className="relative h-full w-full rounded overflow-hidden col-span-2">
              <img 
                src="/images/portfolio/wedding_1.jpg" 
                className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.7] scale-100 group-hover:scale-110 transition-all duration-[2000ms] ease-out" 
              />
            </div>
          </div>

          {/* Glowing Gold Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black-deep via-brand-black-deep/80 to-transparent z-10" />
          <div className={`absolute inset-0 bg-brand-gold-premium/15 mix-blend-overlay transition-opacity duration-500 z-10 ${hoveredExperience === "photography" ? "opacity-100" : "opacity-40"}`} />

          {/* Futuristic corner framing */}
          <div className="absolute top-4 left-4 h-4 w-4 border-t border-l border-brand-gold-premium/40" />
          <div className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-brand-gold-premium/40" />

          {/* Content (Counter-Parallax shifted) */}
          <div 
            className="relative z-20 flex flex-col justify-between h-full transition-transform duration-700 ease-out"
            style={{ 
              transform: `translate3d(${mousePos.x * -12}px, ${mousePos.y * -12}px, 0)`,
              willChange: "transform"
            }}
          >
            <div>
              <span className="text-[10px] font-bold text-brand-gold-premium uppercase tracking-widest bg-brand-gold-premium/15 border border-brand-gold-premium/25 px-2 py-0.5 rounded">
                Division 02
              </span>
            </div>

            <div className="my-auto py-8">
              <h2 className="font-display text-2xl sm:text-5xl font-black uppercase text-brand-text-white tracking-tight leading-none">
                <span className={`reveal-text-wrapper ${revealActive ? "active" : ""}`}>
                  <span className="reveal-text-line" style={{ transitionDelay: "100ms" }}>BKMSFX</span>
                </span>
                <br />
                <span className={`reveal-text-wrapper ${revealActive ? "active" : ""}`}>
                  <span className="reveal-text-line text-brand-gold-premium" style={{ transitionDelay: "250ms" }}>Photography</span>
                </span>
              </h2>
              <p className={`text-xs text-brand-text-secondary-gray mt-4 max-w-sm leading-relaxed transition-all duration-500 ${
                hoveredExperience === "photography" ? "opacity-100" : "opacity-0 md:h-0 overflow-hidden"
              }`}>
                Cinematic editorial portraiture, automotive showcases, and high-fashion branding. Reserve booking slots online.
              </p>
            </div>

            <div>
              <button 
                onClick={(e) => { e.stopPropagation(); router.push("/photography"); }}
                className="px-6 py-2.5 bg-gold-gradient text-brand-black-deep text-[11px] font-black uppercase tracking-widest rounded transition-all shadow-lg shadow-brand-gold-premium/15 flex items-center gap-1.5"
              >
                Enter Studio
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION SECTION */}
      <section className="relative py-24 border-t border-white/[0.04] bg-brand-black-rich/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-brand-gold-premium uppercase tracking-widest block mb-3">
                Double Division Expertise
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-brand-text-white leading-tight">
                Built Around Skill.<br />
                Strategy. Creativity.
              </h2>
              <p className="mt-6 text-sm text-brand-text-secondary-gray leading-relaxed">
                BKMSFX is a premium contemporary creator brand operating across two specialized fields. We establish rigorous discipline in financial market trading while delivering cinematic quality portraits and commercial photography.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <ShieldCheck className="h-6 w-6 text-brand-blue-electric shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-brand-text-white uppercase tracking-wider">Trading Discipline</h4>
                    <p className="text-[11px] text-brand-text-secondary-gray mt-1">Rule-based analytical methodologies to navigate forex, crypto, and futures markets.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="h-6 w-6 text-brand-gold-premium shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-brand-text-white uppercase tracking-wider">Creative Precision</h4>
                    <p className="text-[11px] text-brand-text-secondary-gray mt-1">Cinematic studio styling and natural light editing for premium portfolios.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Layered Floating Collage */}
            <div className="relative rounded-2xl border border-white/[0.05] bg-brand-black-deep/50 p-8 flex items-center justify-center min-h-[400px] overflow-hidden group">
              <div className="absolute inset-0 bg-[#050505] terminal-grid opacity-20" />
              
              {/* Back Card 1: Trading Course */}
              <div 
                className="absolute top-12 left-8 w-48 h-32 rounded-lg border border-brand-blue-electric/20 futuristic-img-container opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 shadow-xl shadow-brand-blue-electric/5"
                style={{ 
                  transform: `rotate(-6deg) translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0)`,
                  willChange: "transform"
                }}
              >
                <img src="/images/courses/course_1.jpg" className="w-full h-full object-cover" />
              </div>

              {/* Back Card 2: Photography Auto */}
              <div 
                className="absolute bottom-12 right-8 w-48 h-32 rounded-lg border border-brand-gold-premium/20 futuristic-img-container-gold opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 shadow-xl shadow-brand-gold-premium/5"
                style={{ 
                  transform: `rotate(8deg) translate3d(${mousePos.x * -16}px, ${mousePos.y * -16}px, 0)`,
                  willChange: "transform"
                }}
              >
                <img src="/images/portfolio/auto_1.jpg" className="w-full h-full object-cover" />
              </div>

              {/* Center Main Card: Portrait */}
              <div 
                className="relative z-10 w-52 h-64 rounded-xl border border-white/10 futuristic-img-container-gold shadow-2xl shadow-black/80 transition-all duration-700"
                style={{ 
                  transform: `rotate(-1deg) translate3d(${mousePos.x * -6}px, ${mousePos.y * -6}px, 0)`,
                  willChange: "transform"
                }}
              >
                <img src="/images/portfolio/portrait_2.jpg" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <span className="text-[8px] uppercase tracking-widest text-brand-gold-premium font-bold">Featured Capture</span>
                  <h4 className="text-xs font-bold text-white uppercase mt-0.5">Lifestyle Portrait</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* 3. CHOOSE YOUR EXPERIENCE CARDS */}
      <section className="relative py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-brand-text-white tracking-tight">
              Select Your Gateway
            </h2>
            <p className="text-xs text-brand-text-secondary-gray mt-2 tracking-widest uppercase">
              Interact with the divisions of BKMSFX
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Trading */}
            <div className="glass-panel-blue rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="p-3 rounded bg-brand-blue-electric/10 border border-brand-blue-electric/25 text-brand-blue-electric">
                    <TrendingUp className="h-6 w-6" />
                  </span>
                  <span className="text-[10px] font-bold text-brand-blue-electric uppercase tracking-widest border border-brand-blue-electric/20 rounded px-2.5 py-0.5">
                    FX / Trading
                  </span>
                </div>
                
                {/* Visual Preview Image */}
                <div className="mt-6 mb-4 relative rounded-xl border border-brand-blue-electric/25 futuristic-img-container h-44 shadow-lg shadow-brand-blue-electric/5">
                  <img src="/images/courses/course_2.jpg" className="w-full h-full object-cover" />
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black text-brand-text-white uppercase mt-4">
                  BKMSFX Trading
                </h3>
                <p className="text-xs text-brand-text-secondary-gray mt-4 leading-relaxed">
                  Learn structured trading concepts, develop your market knowledge, access advanced educational programs, and join the BKMSFX VIP Discord community.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-brand-text-primary-gray">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-electric" />
                    Beginner to Advanced LMS Programs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-electric" />
                    Protected Indicator Scripts & PDFs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-electric" />
                    Community Discord Trade Rooms
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href="/trading"
                  className="inline-flex w-full items-center justify-center gap-2 rounded border border-brand-blue-electric/30 bg-brand-blue-electric/10 hover:bg-brand-blue-electric py-3 text-xs font-semibold tracking-wide text-brand-text-white transition-all group-hover:shadow-lg group-hover:shadow-brand-blue-electric/10"
                >
                  Explore Trading
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
 
            {/* Card 2: Photography */}
            <div className="glass-panel-gold rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="p-3 rounded bg-brand-gold-premium/10 border border-brand-gold-premium/25 text-brand-gold-premium">
                    <Camera className="h-6 w-6" />
                  </span>
                  <span className="text-[10px] font-bold text-brand-gold-premium uppercase tracking-widest border border-brand-gold-premium/20 rounded px-2.5 py-0.5">
                    Creative / Studio
                  </span>
                </div>
                
                {/* Visual Preview Image */}
                <div className="mt-6 mb-4 relative rounded-xl border border-brand-gold-premium/25 futuristic-img-container-gold h-44 shadow-lg shadow-brand-gold-premium/5">
                  <img src="/images/portfolio/wedding_1.jpg" className="w-full h-full object-cover" />
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black text-brand-text-white uppercase mt-4">
                  BKMSFX Photography
                </h3>
                <p className="text-xs text-brand-text-secondary-gray mt-4 leading-relaxed">
                  Explore professional photography services, view the cinematic portfolio, choose configurable service packages, and schedule appointments instantly.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-brand-text-primary-gray">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-premium" />
                    Cinematic Editorial Portfolios
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-premium" />
                    Online Calendar Booking Engine
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-premium" />
                    Private Password-Protected Galleries
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href="/photography"
                  className="inline-flex w-full items-center justify-center gap-2 rounded border border-brand-gold-premium/30 bg-brand-gold-premium/10 hover:bg-brand-gold-premium hover:text-brand-black-deep py-3 text-xs font-semibold tracking-wide text-brand-text-white transition-all group-hover:shadow-lg group-hover:shadow-brand-gold-premium/10"
                >
                  Explore Photography
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIVISION PREVIEWS */}
      <section className="relative py-24 border-t border-white/[0.04] bg-brand-black-rich/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-brand-gold-premium uppercase tracking-widest block mb-3">
              Divisional Showcases
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-brand-text-white">
              Explore Our Work
            </h2>
            <p className="text-[10px] text-brand-text-secondary-gray mt-1 tracking-widest uppercase">
              A preview of our courses and creative photography portfolios
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Courses */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-text-white uppercase tracking-wider flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-blue-electric" />
                Trading Academy Courses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="glass-panel border-white/[0.04] rounded-lg overflow-hidden group">
                  <div className="h-40 w-full relative border-b border-white/[0.05] futuristic-img-container">
                    <img 
                      src="/images/courses/course_1.jpg" 
                      alt="Intro to Market Structure"
                      className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[9px] uppercase font-bold text-brand-blue-bright">Beginner</span>
                    <h4 className="text-xs font-bold text-white mt-1 uppercase tracking-wide">Market Structure</h4>
                  </div>
                </div>

                <div className="glass-panel border-white/[0.04] rounded-lg overflow-hidden group">
                  <div className="h-40 w-full relative border-b border-white/[0.05] futuristic-img-container">
                    <img 
                      src="/images/courses/course_2.jpg" 
                      alt="Advanced Order Blocks"
                      className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[9px] uppercase font-bold text-brand-blue-bright">Advanced</span>
                    <h4 className="text-xs font-bold text-white mt-1 uppercase tracking-wide">Order Blocks & FVG</h4>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Link 
                  href="/trading" 
                  className="text-xs font-bold text-brand-blue-bright hover:underline flex items-center gap-1"
                >
                  View Course Catalog
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Photography */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-text-white uppercase tracking-wider flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-gold-premium" />
                Creative Studio Portfolios
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square cursor-pointer futuristic-img-container-gold group">
                  <img 
                    src="/images/portfolio/portrait_1.jpg" 
                    alt="Portraits"
                    className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <span className="text-[10px] uppercase font-black tracking-widest text-brand-gold-premium">Portraits</span>
                  </div>
                </div>

                <div className="relative aspect-square cursor-pointer futuristic-img-container-gold group">
                  <img 
                    src="/images/portfolio/auto_1.jpg" 
                    alt="Automotive"
                    className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <span className="text-[10px] uppercase font-black tracking-widest text-brand-gold-premium">Automotive</span>
                  </div>
                </div>

                <div className="relative aspect-square cursor-pointer futuristic-img-container-gold group">
                  <img 
                    src="/images/portfolio/wedding_1.jpg" 
                    alt="Weddings"
                    className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <span className="text-[10px] uppercase font-black tracking-widest text-brand-gold-premium">Weddings</span>
                  </div>
                </div>

                <div className="relative aspect-square cursor-pointer futuristic-img-container-gold group">
                  <img 
                    src="/images/portfolio/brand_1.jpg" 
                    alt="Branding"
                    className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <span className="text-[10px] uppercase font-black tracking-widest text-brand-gold-premium">Branding</span>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Link 
                  href="/photography" 
                  className="text-xs font-bold text-brand-gold-premium hover:underline flex items-center gap-1"
                >
                  View Full Gallery
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      {initialTestimonials.length > 0 && (
        <section className="relative py-24 bg-brand-black-rich/10 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-brand-text-white">
                Member Reviews
              </h2>
              <p className="text-[10px] text-brand-text-secondary-gray mt-1 tracking-widest uppercase">
                What clients and students say about BKMSFX
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {initialTestimonials.map((t) => (
                <div key={t.id} className="glass-panel border-white/[0.05] rounded-xl p-6 relative flex flex-col justify-between">
                  <div className="absolute top-6 right-6 text-brand-gold-premium/10">
                    <Quote className="h-12 w-12" />
                  </div>
                  <div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span key={i} className="text-brand-gold-premium text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-xs text-brand-text-primary-gray italic leading-relaxed relative z-10">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <img 
                      src={t.avatar || "/images/avatars/default.jpg"} 
                      alt={t.name} 
                      className="h-9 w-9 rounded-full object-cover border border-white/[0.05]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}`;
                      }}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-brand-text-white">{t.name}</h5>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-white/[0.03] text-[9px] uppercase tracking-wider text-brand-text-secondary-gray">
                        {t.category} Client
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FAQs SECTION */}
      {initialFaqs.length > 0 && (
        <section className="relative py-24 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-brand-text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-[10px] text-brand-text-secondary-gray mt-1 tracking-widest uppercase">
                Find quick answers before booking or enrolling
              </p>
            </div>

            <div className="space-y-4">
              {initialFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="glass-panel border-white/[0.04] rounded-lg overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between px-6 py-4.5 text-left focus:outline-none"
                    >
                      <span className="text-xs font-semibold tracking-wide text-brand-text-white">
                        {faq.question}
                      </span>
                      <span className={`p-1 rounded-full border border-white/[0.05] bg-brand-black-rich text-brand-text-secondary-gray transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-5 pt-1 border-t border-white/[0.03] bg-white/[0.01]">
                        <p className="text-xs text-brand-text-secondary-gray leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. LATEST NEWS / BLOG SECTION */}
      {initialBlogPosts.length > 0 && (
        <section className="relative py-24 bg-brand-black-rich/10 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-brand-text-white">
                Latest Publications
              </h2>
              <p className="text-[10px] text-brand-text-secondary-gray mt-1 tracking-widest uppercase">
                Trading Insights & photography announcements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {initialBlogPosts.map((post) => (
                <div key={post.id} className="glass-panel border-white/[0.05] rounded-xl overflow-hidden flex flex-col justify-between group">
                  <div>
                    {post.featuredImage && (
                      <div className="h-48 w-full overflow-hidden relative border-b border-white/[0.05]">
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-brand-gold-premium mb-3">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        <span className="h-1.5 w-1.5 rounded-full bg-white/[0.1]" />
                        {post.category}
                      </div>
                      <h3 className="text-sm font-bold text-brand-text-white leading-snug group-hover:text-brand-gold-premium transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-brand-text-secondary-gray mt-3 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue-electric hover:underline"
                    >
                      Read full article
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
