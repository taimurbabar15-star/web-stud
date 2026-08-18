"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, Calendar as CalendarIcon, Clock, Image as ImageIcon,
  MapPin, ChevronRight, ChevronLeft, ArrowRight, Sparkles 
} from "lucide-react";

interface BookingWizardClientProps {
  packages: any[];
  availableSlots: any[];
  defaultPackageId: string;
}

export default function BookingWizardClient({ 
  packages, availableSlots, defaultPackageId 
}: BookingWizardClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Selections state
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    defaultPackageId || (packages.length > 0 ? packages[0].id : "")
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const activePackage = packages.find(p => p.id === selectedPkgId);

  // Group slots by unique date strings
  const uniqueDates = Array.from(new Set(availableSlots.map(s => s.date)));
  
  // Filter slots for active selected date
  const slotsForDate = availableSlots.filter(s => s.date === selectedDate);

  const handleNextStep = () => {
    if (step === 1 && selectedPkgId) setStep(2);
    else if (step === 2 && selectedDate && selectedTime) setStep(3);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleProceedToPayment = () => {
    if (!selectedPkgId || !selectedDate || !selectedTime || !location) return;

    // Send to checkout with search params
    const q = new URLSearchParams({
      type: "PHOTOGRAPHY_DEPOSIT",
      id: selectedPkgId,
      date: selectedDate,
      time: selectedTime,
      location,
      notes,
    }).toString();

    router.push(`/checkout?${q}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8 items-start">
      
      {/* LEFT COLUMN: Booking Step Forms */}
      <div className="flex-grow w-full lg:max-w-3xl">
        {/* Wizard Progress Header */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto text-xs text-brand-text-secondary-gray uppercase font-bold tracking-widest">
          <span className={`${step >= 1 ? "text-brand-gold-premium" : ""}`}>1. Package</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className={`${step >= 2 ? "text-brand-gold-premium" : ""}`}>2. Date & Time</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className={`${step >= 3 ? "text-brand-gold-premium" : ""}`}>3. Details</span>
        </div>

        <div className="glass-panel border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden min-h-[440px]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold-premium/45 to-transparent" />

          <AnimatePresence mode="wait">
            {/* STEP 1: SELECT PACKAGE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-xl font-black uppercase text-brand-text-white">
                    Choose Photography Service
                  </h2>
                  <p className="text-[10px] text-brand-text-secondary-gray mt-1 uppercase tracking-wider">
                    Select your package tier
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg) => {
                    const isSelected = pkg.id === selectedPkgId;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkgId(pkg.id)}
                        className={`rounded-xl p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected 
                            ? "border-brand-gold-premium bg-brand-gold-premium/[0.02] shadow-lg shadow-brand-gold-premium/5" 
                            : "border-white/[0.05] bg-brand-black-rich/50 hover:bg-brand-black-rich"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">{pkg.title}</h3>
                            {isSelected && <span className="h-2 w-2 rounded-full bg-brand-gold-premium animate-pulse" />}
                          </div>
                          <p className="text-[10px] text-brand-text-secondary-gray mt-2 leading-relaxed line-clamp-3">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="mt-6 border-t border-white/[0.04] pt-4 flex justify-between items-baseline">
                          <span className="text-[10px] text-brand-text-secondary-gray">Total Price:</span>
                          <span className="font-display text-lg font-black text-brand-gold-premium">${pkg.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedPkgId}
                    className="px-6 py-2.5 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    Choose Date
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CHOOSE DATE & TIME */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-xl font-black uppercase text-brand-text-white">
                    Select Date & Time
                  </h2>
                  <p className="text-[10px] text-brand-text-secondary-gray mt-1 uppercase tracking-wider">
                    Browse available appointments
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Column */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary-gray">
                      Available Dates
                    </span>
                    {uniqueDates.length === 0 ? (
                      <p className="text-xs text-brand-text-secondary-gray">No slots available. Please contact support.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2">
                        {uniqueDates.map((d: any) => {
                          const isSel = d === selectedDate;
                          return (
                            <button
                              key={d}
                              onClick={() => {
                                setSelectedDate(d);
                                setSelectedTime("");
                              }}
                              className={`p-2.5 rounded border text-xs font-medium transition-colors text-center ${
                                isSel
                                  ? "border-brand-gold-premium bg-brand-gold-premium/10 text-brand-gold-premium"
                                  : "border-white/[0.05] bg-brand-black-rich hover:bg-white/[0.02] text-brand-text-primary-gray"
                              }`}
                            >
                              {new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" })}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Time Column */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary-gray">
                      Available Time Slots
                    </span>
                    {!selectedDate ? (
                      <div className="h-40 border border-dashed border-white/[0.05] rounded-lg flex items-center justify-center text-center p-4">
                        <p className="text-[10px] text-brand-text-secondary-gray uppercase font-semibold">
                          Please select a date first
                        </p>
                      </div>
                    ) : slotsForDate.length === 0 ? (
                      <p className="text-xs text-brand-text-secondary-gray">No slots available for this date.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2">
                        {slotsForDate.map((slot) => {
                          const isSel = slot.startTime === selectedTime;
                          return (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedTime(slot.startTime)}
                              className={`p-2.5 rounded border text-xs font-mono transition-colors text-center ${
                                isSel
                                  ? "border-brand-gold-premium bg-brand-gold-premium/10 text-brand-gold-premium"
                                  : "border-white/[0.05] bg-brand-black-rich hover:bg-white/[0.02] text-brand-text-primary-gray"
                              }`}
                            >
                              {slot.startTime} - {slot.endTime}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2.5 rounded border border-white/[0.08] text-brand-text-white text-xs font-bold uppercase tracking-wider hover:bg-white/[0.02] transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedDate || !selectedTime}
                    className="px-6 py-2.5 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    Add Details
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-xl font-black uppercase text-brand-text-white">
                    Photoshoot Details
                  </h2>
                  <p className="text-[10px] text-brand-text-secondary-gray mt-1 uppercase tracking-wider">
                    Specify location and creative notes
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="loc" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                      Photoshoot Location (Full Address / Studio) *
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-4 w-4 text-brand-text-secondary-gray" />
                      </div>
                      <input
                        id="loc"
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2.5 pl-10 pr-3 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
                        placeholder="e.g. 123 Creative Studio, Chicago, IL"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                      Special Notes / Styling & Outfit Requirements
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich px-3 py-2.5 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
                      placeholder="e.g. Bring lights, streetwear styling, vintage car focus..."
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2.5 rounded border border-white/[0.08] text-brand-text-white text-xs font-bold uppercase tracking-wider hover:bg-white/[0.02] transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!location}
                    className="px-6 py-2.5 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    Pay Deposit
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: Anchored Sidebar (Desktop Only) */}
      {activePackage && (
        <div className="w-full lg:w-80 shrink-0 sticky top-24 lg:block">
          <div className="glass-panel border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Collage Background */}
            <div className="h-32 w-full relative overflow-hidden border-b border-white/[0.05] futuristic-img-container-gold">
              <img 
                src="/images/portfolio/wedding_2.jpg" 
                alt="Photography"
                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black-deep to-black/30" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold-premium">Active Session Selection</span>
                <h3 className="text-sm font-bold text-white uppercase mt-0.5">{activePackage.title}</h3>
                <p className="text-[10px] text-brand-text-secondary-gray mt-2 leading-relaxed">{activePackage.description}</p>
              </div>

              <div className="border-t border-white/[0.04] pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary-gray">Duration:</span>
                  <span>{activePackage.duration} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary-gray">Deliverables:</span>
                  <span>{activePackage.editedImages} images</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary-gray">Package Price:</span>
                  <span className="font-semibold text-white">${activePackage.price}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between border-t border-white/[0.03] pt-2 text-[11px] text-brand-gold-premium">
                    <span>Date:</span>
                    <span>{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between text-[11px] text-brand-gold-premium">
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/[0.04] pt-4 flex justify-between items-baseline">
                <span className="text-xs text-brand-text-secondary-gray">Deposit Needed:</span>
                <span className="font-display text-lg font-black text-brand-gold-premium">${activePackage.depositAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
