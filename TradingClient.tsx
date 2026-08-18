"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  TrendingUp, Award, Clock, BookOpen, Star, 
  Users, Check, ArrowRight, ShieldAlert, Sparkles, Filter 
} from "lucide-react";

interface TradingClientProps {
  courses: any[];
  memberships: any[];
}

export default function TradingClient({ courses, memberships }: TradingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  // Derive unique categories from courses list
  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];
  const difficulties = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

  const filteredCourses = courses.filter(c => {
    const categoryMatch = selectedCategory === "All" || c.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "All" || c.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="w-full bg-brand-black-deep relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 flex items-center justify-center border-b border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-[#050505] terminal-grid opacity-25 z-0" />
        <div className="absolute -top-40 right-10 h-[350px] w-[350px] rounded-full bg-brand-blue-electric/5 blur-[120px] z-0 pointer-events-none" />

        {/* Animated Background Candlestick Chart */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.15] pointer-events-none select-none">
          <svg className="w-full h-full max-h-[400px] max-w-5xl text-brand-blue-electric" fill="none" viewBox="0 0 1000 400">
            {/* Grid Lines */}
            <path d="M 0,100 L 1000,100 M 0,200 L 1000,200 M 0,300 L 1000,300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            
            {/* Candlestick Wicks (Vertical Lines) */}
            <line x1="100" y1="150" x2="100" y2="280" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "100ms" }} />
            <line x1="200" y1="100" x2="200" y2="220" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "300ms" }} />
            <line x1="300" y1="180" x2="300" y2="320" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "500ms" }} />
            <line x1="400" y1="120" x2="400" y2="250" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "700ms" }} />
            <line x1="500" y1="80" x2="500" y2="210" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "900ms" }} />
            <line x1="600" y1="140" x2="600" y2="290" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1100ms" }} />
            <line x1="700" y1="100" x2="700" y2="230" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1300ms" }} />
            <line x1="800" y1="60" x2="800" y2="180" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1500ms" }} />
            <line x1="900" y1="120" x2="900" y2="260" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1700ms" }} />

            {/* Candlestick Bodies (Rectangles) */}
            <rect x="85" y="180" width="30" height="70" fill="rgba(20, 107, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "200ms" }} />
            <rect x="185" y="120" width="30" height="60" fill="rgba(20, 107, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "400ms" }} />
            <rect x="285" y="210" width="30" height="80" fill="rgba(212, 175, 55, 0.15)" stroke="var(--brand-gold-premium)" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "600ms" }} />
            <rect x="385" y="140" width="30" height="80" fill="rgba(20, 107, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "800ms" }} />
            <rect x="485" y="100" width="30" height="70" fill="rgba(20, 107, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1000ms" }} />
            <rect x="585" y="170" width="30" height="90" fill="rgba(212, 175, 55, 0.15)" stroke="var(--brand-gold-premium)" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1200ms" }} />
            <rect x="685" y="120" width="30" height="60" fill="rgba(20, 107, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1400ms" }} />
            <rect x="785" y="80" width="30" height="70" fill="rgba(20, 107, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1600ms" }} />
            <rect x="885" y="150" width="30" height="80" fill="rgba(212, 175, 55, 0.15)" stroke="var(--brand-gold-premium)" strokeWidth="1.5" className="animate-draw-path" style={{ animationDelay: "1800ms" }} />

            {/* Connecting Trend Line (Polyline) */}
            <polyline 
              points="100,215 200,150 300,250 400,180 500,135 600,215 700,150 800,115 900,190" 
              fill="none" 
              stroke="var(--brand-gold-premium)" 
              strokeWidth="2.5" 
              className="animate-draw-path"
              style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animationDelay: "1900ms", animationDuration: "4s" }}
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue-electric/20 bg-brand-blue-electric/5 px-4 py-1.5 text-xs text-brand-blue-bright mb-6">
            <TrendingUp className="h-4 w-4" />
            BKMSFX ACADEMY & RESEARCH
          </div>

          <h1 className="font-trading text-4xl sm:text-6xl font-black uppercase text-brand-text-white leading-[1.1] tracking-tight max-w-4xl mx-auto">
            Trade with Knowledge.<br />
            <span className="text-blue-gradient">Build with Discipline.</span>
          </h1>

          <p className="mt-6 text-xs sm:text-sm text-brand-text-secondary-gray max-w-2xl mx-auto leading-relaxed">
            Educational programs designed to help users understand markets, trading concepts, risk management, technical analysis, and structured trading approaches.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a 
              href="#catalog" 
              className="px-6 py-2.5 rounded bg-brand-blue-electric hover:bg-brand-blue-bright text-xs font-semibold tracking-wide text-white transition-colors"
            >
              Explore Programs
            </a>
            <a 
              href="#membership" 
              className="px-6 py-2.5 rounded border border-white/[0.08] hover:border-brand-gold-premium hover:bg-brand-gold-premium/5 text-xs font-semibold tracking-wide text-brand-text-white transition-all"
            >
              Join VIP
            </a>
          </div>
        </div>
      </section>

      {/* 2. RISK DISCLOSURE ACCENT BANNER */}
      <section className="bg-brand-black-rich border-y border-white/[0.04] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-blue-electric/[0.02] border border-brand-blue-electric/10 rounded-lg p-4">
            <ShieldAlert className="h-6 w-6 text-brand-blue-bright shrink-0" />
            <p className="text-[10px] sm:text-xs text-brand-text-secondary-gray leading-normal text-justify">
              <strong className="text-brand-text-white">Educational Disclaimer:</strong> Trading and financial markets involve substantial risk. Educational content provided by BKMSFX is for informational and educational purposes only and should not be considered personalized financial, investment, or trading advice. Past performance does not guarantee future results. Users should evaluate their own circumstances and risk tolerance before making financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* 3. COURSE CATALOG SECTION */}
      <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="font-trading text-2xl sm:text-3xl font-black uppercase text-brand-text-white">
              LMS Course Catalog
            </h2>
            <p className="text-[10px] text-brand-text-secondary-gray mt-1 tracking-widest uppercase">
              Beginner to advanced trading modules
            </p>
          </div>

          {/* Filters buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded bg-brand-black-rich border border-white/[0.05] p-1 text-[11px]">
              <span className="px-2 text-brand-text-secondary-gray flex items-center gap-1 font-semibold uppercase tracking-wider">
                <Filter className="h-3 w-3" /> Cat:
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-brand-blue-electric text-white"
                      : "text-brand-text-secondary-gray hover:text-brand-text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded bg-brand-black-rich border border-white/[0.05] p-1 text-[11px]">
              <span className="px-2 text-brand-text-secondary-gray flex items-center gap-1 font-semibold uppercase tracking-wider">
                Level:
              </span>
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? "bg-brand-blue-electric text-white"
                      : "text-brand-text-secondary-gray hover:text-brand-text-white"
                  }`}
                >
                  {diff.charAt(0) + diff.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 glass-panel border-white/[0.04] rounded-xl max-w-md mx-auto">
            <p className="text-xs text-brand-text-secondary-gray">No courses found matching selected filters.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <motion.div 
                key={course.id} 
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border-white/[0.05] rounded-xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue-electric/25"
              >
                {/* Course image / header */}
                <div>
                  <div className="h-44 w-full relative bg-brand-black-rich border-b border-white/[0.05] futuristic-img-container">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand-blue-electric/10 to-brand-black-deep">
                        <BookOpen className="h-10 w-10 text-brand-blue-electric" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-black-deep/80 text-brand-blue-bright border border-brand-blue-electric/20 backdrop-blur-sm">
                      {course.category}
                    </span>
                  </div>

                  {/* Course Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-[10px] text-brand-text-secondary-gray mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/[0.1]" />
                      <span className="flex items-center gap-1 uppercase">
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-brand-text-white leading-snug group-hover:text-brand-blue-bright transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-[11px] text-brand-text-secondary-gray mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mt-4 text-[11px] text-brand-text-secondary-gray border-t border-white/[0.03] pt-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.studentCount} enrolled
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-brand-gold-premium">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course CTA */}
                <div className="p-5 pt-0">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex w-full items-center justify-center gap-1 py-2 text-xs font-semibold tracking-wide rounded border border-white/[0.08] hover:border-brand-blue-electric/40 bg-white/[0.01] hover:bg-brand-blue-electric/5 text-brand-text-white transition-colors"
                  >
                    View Curriculum
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

              </motion.div>
            ))}
          </motion.div>
        )}

      </section>

      {/* 4. SUBSCRIPTION MEMBERSHIP SECTION */}
      <section id="membership" className="py-24 bg-brand-black-rich/20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-brand-gold-premium uppercase tracking-widest block mb-3">
              Premium Programs
            </span>
            <h2 className="font-trading text-3xl sm:text-5xl font-black uppercase text-brand-text-white">
              VIP Memberships
            </h2>
            <p className="text-[10px] text-brand-text-secondary-gray mt-1 tracking-widest uppercase">
              Configurable billing tiers with exclusive Discord setups
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {memberships.map((membership) => {
              const featuresList = membership.features.split(";");
              const isVip = membership.name.toUpperCase() === "VIP";
              const isPro = membership.name.toUpperCase() === "PRO";
              
              return (
                <div 
                  key={membership.id}
                  className={`rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                    isVip 
                      ? "glass-panel-gold border-brand-gold-premium/30" 
                      : isPro 
                        ? "glass-panel-blue border-brand-blue-electric/30"
                        : "glass-panel border-white/[0.05]"
                  }`}
                >
                  {isVip && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-brand-gold-premium text-brand-black-deep shadow-md flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Recommended
                    </span>
                  )}

                  <div>
                    <h3 className="font-display text-lg font-black uppercase tracking-wider text-brand-text-white">
                      {membership.name}
                    </h3>
                    <p className="text-[11px] text-brand-text-secondary-gray mt-2 leading-relaxed">
                      {membership.description}
                    </p>

                    <div className="my-6">
                      <span className="font-display text-4xl font-black text-brand-text-white">
                        ${membership.price.toFixed(0)}
                      </span>
                      <span className="text-xs text-brand-text-secondary-gray ml-2">
                        / {membership.billingPeriod.toLowerCase() === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>

                    <ul className="space-y-3 border-t border-white/[0.04] pt-6 text-xs text-brand-text-primary-gray">
                      {featuresList.map((feature: string, idx: number) => (
                        <li key={idx} className="flex gap-2.5">
                          <Check className={`h-4.5 w-4.5 shrink-0 ${isVip ? "text-brand-gold-premium" : isPro ? "text-brand-blue-electric" : "text-brand-text-secondary-gray"}`} />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      href={`/checkout?type=MEMBERSHIP&id=${membership.id}`}
                      className={`flex w-full items-center justify-center gap-1 py-3 text-xs font-bold tracking-wide rounded transition-all ${
                        isVip
                          ? "bg-gold-gradient text-brand-black-deep hover:shadow-lg hover:shadow-brand-gold-premium/15"
                          : isPro
                            ? "bg-brand-blue-electric text-white hover:shadow-lg hover:shadow-brand-blue-electric/15"
                            : "border border-white/[0.08] hover:border-brand-text-white bg-white/[0.01] text-brand-text-white"
                      }`}
                    >
                      Choose Plan
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
