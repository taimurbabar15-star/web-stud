"use client";

import { useState } from "react";
import { Calculator, HelpCircle, Award, CheckCircle, ArrowRight } from "lucide-react";

export default function ValueIndexClient() {
  // Metric States (representing rating out of 100)
  const [reserves, setReserves] = useState(85);
  const [layout, setLayout] = useState(90);
  const [sustainability, setSustainability] = useState(70);
  const [liquidity, setLiquidity] = useState(80);
  const [location, setLocation] = useState(95);
  const [charges, setCharges] = useState(75);
  const [amenities, setAmenities] = useState(85);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [email, setEmail] = useState("");

  // Weighted calculation matching the Undivided Value Index™
  // Reserves: 20%, Layout: 15%, Sustainability: 10%, Liquidity: 15%, Location: 15%, Charges: 10%, Amenities: 15%
  const calculateIndexScore = () => {
    const rawScore = 
      (reserves * 0.20) + 
      (layout * 0.15) + 
      (sustainability * 0.10) + 
      (liquidity * 0.15) + 
      (location * 0.15) + 
      (charges * 0.10) + 
      (amenities * 0.15);
    return Math.round(rawScore);
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A", desc: "Outstanding Investment Quality" };
    if (score >= 80) return { grade: "B", desc: "Solid Advisory Grade" };
    if (score >= 70) return { grade: "C", desc: "Moderate Speculative Grade" };
    return { grade: "D", desc: "Sub-Standard Risk Zone" };
  };

  const score = calculateIndexScore();
  const rating = getScoreGrade(score);

  const handleRequestReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (buildingName && email) {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
      
      {/* Left Column: Metric Sliders */}
      <div className="lg:col-span-7 glass-panel border-white/[0.04] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-brand-text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <Calculator className="h-4.5 w-4.5 text-brand-gold-premium" />
          Value Index Simulator
        </h3>

        {/* Slider 1: Reserves */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-brand-text-white flex items-center gap-1">
              1. Reserves & Capital Funds
              <span className="text-[10px] text-brand-text-secondary-gray">(Weight: 20%)</span>
            </span>
            <span className="text-brand-gold-premium font-mono font-bold">{reserves}/100</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={reserves} 
            onChange={(e) => setReserves(Number(e.target.value))}
            className="w-full h-1 bg-brand-black-rich rounded-lg appearance-none cursor-pointer accent-brand-gold-premium"
          />
        </div>

        {/* Slider 2: Layout */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-brand-text-white flex items-center gap-1">
              2. Unit Layout Efficiency
              <span className="text-[10px] text-brand-text-secondary-gray">(Weight: 15%)</span>
            </span>
            <span className="text-brand-gold-premium font-mono font-bold">{layout}/100</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={layout} 
            onChange={(e) => setLayout(Number(e.target.value))}
            className="w-full h-1 bg-brand-black-rich rounded-lg appearance-none cursor-pointer accent-brand-gold-premium"
          />
        </div>

        {/* Slider 3: Sustainability */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-brand-text-white flex items-center gap-1">
              3. Sustainability & Energy Rating
              <span className="text-[10px] text-brand-text-secondary-gray">(Weight: 10%)</span>
            </span>
            <span className="text-brand-gold-premium font-mono font-bold">{sustainability}/100</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sustainability} 
            onChange={(e) => setSustainability(Number(e.target.value))}
            className="w-full h-1 bg-brand-black-rich rounded-lg appearance-none cursor-pointer accent-brand-gold-premium"
          />
        </div>

        {/* Slider 4: Liquidity */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-brand-text-white flex items-center gap-1">
              4. Historical Building Liquidity
              <span className="text-[10px] text-brand-text-secondary-gray">(Weight: 15%)</span>
            </span>
            <span className="text-brand-gold-premium font-mono font-bold">{liquidity}/100</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={liquidity} 
            onChange={(e) => setLiquidity(Number(e.target.value))}
            className="w-full h-1 bg-brand-black-rich rounded-lg appearance-none cursor-pointer accent-brand-gold-premium"
          />
        </div>

        {/* Slider 5: Location */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-brand-text-white flex items-center gap-1">
              5. Location Resiliency
              <span className="text-[10px] text-brand-text-secondary-gray">(Weight: 15%)</span>
            </span>
            <span className="text-brand-gold-premium font-mono font-bold">{location}/100</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={location} 
            onChange={(e) => setLocation(Number(e.target.value))}
            className="w-full h-1 bg-brand-black-rich rounded-lg appearance-none cursor-pointer accent-brand-gold-premium"
          />
        </div>

        {/* Slider 6: Charges */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-brand-text-white flex items-center gap-1">
              6. Common Charge Growth Control
              <span className="text-[10px] text-brand-text-secondary-gray">(Weight: 10%)</span>
            </span>
            <span className="text-brand-gold-premium font-mono font-bold">{charges}/100</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={charges} 
            onChange={(e) => setCharges(Number(e.target.value))}
            className="w-full h-1 bg-brand-black-rich rounded-lg appearance-none cursor-pointer accent-brand-gold-premium"
          />
        </div>

        {/* Slider 7: Amenities */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-brand-text-white flex items-center gap-1">
              7. Amenity Quality & Utility
              <span className="text-[10px] text-brand-text-secondary-gray">(Weight: 15%)</span>
            </span>
            <span className="text-brand-gold-premium font-mono font-bold">{amenities}/100</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={amenities} 
            onChange={(e) => setAmenities(Number(e.target.value))}
            className="w-full h-1 bg-brand-black-rich rounded-lg appearance-none cursor-pointer accent-brand-gold-premium"
          />
        </div>
      </div>

      {/* Right Column: Score Outcome & Report Request Form */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Score Display Card */}
        <div className="glass-panel border-white/[0.05] rounded-2xl p-8 text-center flex flex-col items-center justify-center relative bg-brand-gold-premium/[0.01]">
          <div className="absolute top-4 left-4 h-3 w-3 border-t border-l border-brand-gold-premium/30" />
          <div className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-brand-gold-premium/30" />
          
          <span className="text-[10px] tracking-widest text-brand-gold-premium font-bold uppercase mb-2">Simulated Score</span>
          <div className="h-32 w-32 rounded-full border border-brand-gold-premium/20 flex flex-col items-center justify-center my-4 relative">
            <div className="absolute inset-2 rounded-full border border-dashed border-brand-gold-premium/10" />
            <span className="text-4xl font-light text-brand-text-white font-mono">{score}</span>
            <span className="text-[10px] text-brand-text-secondary-gray uppercase mt-1">out of 100</span>
          </div>

          <div className="mt-4">
            <span className="text-2xl font-photography text-brand-gold-bright italic font-medium">Grade {rating.grade}</span>
            <p className="text-xs text-brand-text-secondary-gray mt-1 uppercase tracking-wider">{rating.desc}</p>
          </div>
        </div>

        {/* Lead Request Form */}
        <div className="glass-panel border-white/[0.04] rounded-2xl p-6">
          <h4 className="text-xs font-bold text-brand-text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-brand-gold-premium" />
            Request Score Report
          </h4>
          {formSubmitted ? (
            <div className="rounded-md bg-emerald-950/20 border border-emerald-900/30 p-4 text-xs text-emerald-400">
              <CheckCircle className="h-5 w-5 mb-2 shrink-0 animate-bounce" />
              Thank you! We will compile the official Value Index™ audit report for <strong className="text-white">"{buildingName}"</strong> and email it to you shortly.
            </div>
          ) : (
            <form onSubmit={handleRequestReport} className="space-y-4">
              <p className="text-[10px] text-brand-text-secondary-gray leading-relaxed font-sans">
                Request an official, audited score sheet detailing legal disclosures, unit lines, and capital reserve fundamentals for any NYC condo.
              </p>
              <div>
                <label className="block text-[9px] font-bold text-brand-text-white uppercase tracking-wider mb-1.5">Building Name / Address *</label>
                <input 
                  type="text" 
                  required
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  placeholder="e.g. 10 Madison Square West"
                  className="block w-full rounded border border-white/[0.08] bg-brand-black-rich px-3 py-2 text-xs text-brand-text-white focus:border-brand-gold-premium focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-brand-text-white uppercase tracking-wider mb-1.5">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. buyer@example.com"
                  className="block w-full rounded border border-white/[0.08] bg-brand-black-rich px-3 py-2 text-xs text-brand-text-white focus:border-brand-gold-premium focus:outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1.5 mt-4"
              >
                Request Audit Report
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
