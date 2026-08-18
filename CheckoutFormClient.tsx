"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  CreditCard, ShieldCheck, ArrowRight, CheckCircle2, 
  HelpCircle, Lock, Calendar, ClipboardCheck 
} from "lucide-react";
import { processPaymentAction } from "@/app/actions/payment";

interface CheckoutFormClientProps {
  type: string;
  id: string;
  itemName: string;
  itemPrice: number;
  itemDesc: string;
  bookingDetails: {
    date?: string;
    time?: string;
    location?: string;
    notes?: string;
  };
  userEmail: string;
}

export default function CheckoutFormClient({
  type, id, itemName, itemPrice, itemDesc, bookingDetails, userEmail
}: CheckoutFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // Successful checkout receipt state
  const [receipt, setReceipt] = useState<{ txId: string; amount: number } | null>(null);

  // Card formatting states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    // Add scheduling options for photography bookings
    if (bookingDetails.date) formData.append("bookingDate", bookingDetails.date);
    if (bookingDetails.time) formData.append("bookingTime", bookingDetails.time);
    if (bookingDetails.location) formData.append("bookingLocation", bookingDetails.location);
    if (bookingDetails.notes) formData.append("bookingNotes", bookingDetails.notes);

    startTransition(async () => {
      const result = await processPaymentAction(null, formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success && result.transactionId) {
        setReceipt({
          txId: result.transactionId,
          amount: result.amount,
        });
        router.refresh();
      }
    });
  };

  // 1. Success state receipt view
  if (receipt) {
    return (
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="glass-panel border-emerald-500/20 bg-emerald-950/[0.02] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-500/50" />
          
          <div className="inline-flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-emerald-400" viewBox="0 0 52 52">
              <circle className="animate-draw-path" stroke="currentColor" strokeWidth="3" fill="none" cx="26" cy="26" r="23" style={{ strokeDasharray: 200, strokeDashoffset: 200, animationDuration: '1s' }} />
              <path className="animate-draw-path" stroke="currentColor" strokeWidth="3" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" style={{ strokeDasharray: 100, strokeDashoffset: 100, animationDelay: '0.8s', animationDuration: '0.6s' }} />
            </svg>
          </div>

          <h1 className="font-display text-2xl font-black uppercase text-brand-text-white mb-2">
            Payment Succeeded
          </h1>
          <p className="text-xs text-brand-text-secondary-gray max-w-xs mx-auto leading-relaxed">
            Your billing details have been confirmed and transaction processed successfully.
          </p>

          <div className="my-8 p-5 bg-brand-black-rich/50 rounded-xl border border-white/[0.04] text-xs text-left space-y-3.5">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.04]">
              <span className="text-brand-text-secondary-gray uppercase tracking-wider font-semibold text-[10px]">Product / Service</span>
              <span className="font-semibold text-brand-text-white text-right max-w-[200px] truncate">{itemName}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.04]">
              <span className="text-brand-text-secondary-gray uppercase tracking-wider font-semibold text-[10px]">Transaction ID</span>
              <span className="font-mono text-brand-text-white">{receipt.txId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-text-secondary-gray uppercase tracking-wider font-semibold text-[10px]">Total Paid</span>
              <span className="font-bold text-brand-gold-premium">${receipt.amount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              router.push("/dashboard");
              router.refresh();
            }}
            className="w-full py-3 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 2. Default Billing Checkout view
  return (
    <div className="w-full max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      
      {/* Form Details */}
      <div className="lg:col-span-3">
        <div className="glass-panel border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue-electric/40 to-transparent" />
          
          <h2 className="font-display text-xl font-black uppercase text-brand-text-white tracking-wide mb-6">
            Billing Information
          </h2>

          {error && (
            <div className="mb-6 rounded-md bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="id" value={id} />

            <div>
              <label htmlFor="cardName" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                Cardholder Name
              </label>
              <input
                id="cardName"
                name="cardName"
                type="text"
                required
                className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich px-3 py-2.5 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-blue-electric focus:outline-none focus:ring-1 focus:ring-brand-blue-electric"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="cardNumber" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                Card Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CreditCard className="h-4 w-4 text-brand-text-secondary-gray" />
                </div>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2.5 pl-10 pr-3 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-blue-electric focus:outline-none focus:ring-1 focus:ring-brand-blue-electric"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                  Expiration (MM/YY)
                </label>
                <input
                  id="expiry"
                  name="expiry"
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich px-3 py-2.5 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-blue-electric focus:outline-none focus:ring-1 focus:ring-brand-blue-electric"
                  placeholder="MM/YY"
                />
              </div>

              <div>
                <label htmlFor="cvv" className="block text-xs font-semibold text-brand-text-white uppercase tracking-wider mb-2">
                  CVV Code
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-brand-text-secondary-gray" />
                  </div>
                  <input
                    id="cvv"
                    name="cvv"
                    type="password"
                    required
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                    className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2.5 pl-10 pr-3 text-xs text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-blue-electric focus:outline-none focus:ring-1 focus:ring-brand-blue-electric"
                    placeholder="•••"
                  />
                </div>
              </div>
            </div>

            {/* Simulated protection details */}
            <div className="flex gap-2 p-3 bg-brand-black-deep rounded border border-white/[0.03] text-[10px] text-brand-text-secondary-gray">
              <ShieldCheck className="h-4 w-4 text-brand-blue-bright shrink-0" />
              <span>Simulated Stripe Environment. Card information is never stored or transmitted.</span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded bg-blue-gradient text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {isPending ? "Validating transaction..." : `Pay $${itemPrice.toFixed(2)}`}
              {!isPending && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>

      {/* Order Summary sidebar */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel border-white/[0.05] rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-brand-text-white uppercase tracking-wider">
            Order Summary
          </h3>
          
          <div className="pb-4 border-b border-white/[0.04]">
            <h4 className="text-xs font-bold text-brand-text-white">{itemName}</h4>
            <p className="text-[11px] text-brand-text-secondary-gray mt-1 leading-normal">
              {itemDesc}
            </p>
          </div>

          {bookingDetails.date && (
            <div className="pb-4 border-b border-white/[0.04] text-[11px] space-y-1 bg-brand-blue-electric/[0.02] border border-brand-blue-electric/15 p-3 rounded">
              <span className="block uppercase font-bold text-brand-blue-bright text-[9px] tracking-wider"> photoshoot details</span>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary-gray">Scheduled Date:</span>
                <span className="text-brand-text-white">{bookingDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary-gray">Scheduled Time:</span>
                <span className="text-brand-text-white">{bookingDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-secondary-gray">Location:</span>
                <span className="text-brand-text-white truncate max-w-[130px]">{bookingDetails.location}</span>
              </div>
            </div>
          )}

          <div className="text-xs space-y-2 pt-2">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary-gray">Subtotal</span>
              <span>${itemPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary-gray">Taxes & Fees</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between border-t border-white/[0.05] pt-3 font-bold text-brand-gold-premium">
              <span>Total Charged</span>
              <span>${itemPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
