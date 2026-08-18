import Link from "next/link";
import { Mail, Phone, MapPin, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.05] bg-brand-black-deep pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <span className="font-display text-2xl font-black tracking-wider text-brand-text-white">
              ALL <span className="text-brand-gold-premium font-photography italic font-medium">REALTORS</span>
            </span>
            <p className="text-xs text-brand-text-secondary-gray leading-relaxed max-w-xs">
              NYC's premier boutique real estate advisory firm. We combine rigorous market analysis, building fundamentals, and investment-minded valuation for luxury buyers and sellers.
            </p>
          </div>

          {/* Site Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-brand-text-white uppercase tracking-widest mb-4">Advisory</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-brand-text-secondary-gray hover:text-brand-text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-brand-text-secondary-gray hover:text-brand-text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/buy" className="text-brand-text-secondary-gray hover:text-brand-text-white transition-colors">Buyer Advisory</Link>
              </li>
              <li>
                <Link href="/sell" className="text-brand-text-secondary-gray hover:text-brand-text-white transition-colors">Seller Advisory</Link>
              </li>
              <li>
                <Link href="/neighborhoods" className="text-brand-text-secondary-gray hover:text-brand-text-white transition-colors">Neighborhoods</Link>
              </li>
              <li>
                <Link href="/value-index" className="text-brand-text-secondary-gray hover:text-brand-text-white transition-colors">Value Index™</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold text-brand-text-white uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2 text-brand-text-secondary-gray">
                <MapPin className="h-4.5 w-4.5 text-brand-gold-premium shrink-0 mt-0.5" />
                <span>
                  102 Legend Dr, #202<br />
                  Sleepy Hollow, NY 10591
                </span>
              </li>
              <li>
                <a href="mailto:hello@allrealtors.com" className="flex items-center gap-2 text-brand-text-secondary-gray hover:text-brand-text-white transition-colors">
                  <Mail className="h-4.5 w-4.5 text-brand-gold-premium shrink-0" />
                  hello@allrealtors.com
                </a>
              </li>
              <li>
                <a href="tel:+16466312220" className="flex items-center gap-2 text-brand-text-secondary-gray hover:text-brand-text-white transition-colors">
                  <Phone className="h-4.5 w-4.5 text-brand-gold-premium shrink-0" />
                  +1 (646) 631-2220
                </a>
              </li>
            </ul>
          </div>

          {/* CTA Area */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs font-semibold text-brand-text-white uppercase tracking-widest mb-4">Select Engagement</h4>
            <p className="text-xs text-brand-text-secondary-gray leading-relaxed">
              Ground your next property purchase in rigorous analysis rather than guesswork.
            </p>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide rounded border border-brand-gold-premium/30 bg-brand-gold-premium/10 text-brand-gold-premium hover:bg-brand-gold-premium hover:text-brand-black-deep transition-all active:scale-[0.98]"
            >
              Book a Strategy Call
            </Link>
          </div>
        </div>

        {/* Real Estate Brokerage Disclaimer */}
        <div className="border-t border-white/[0.05] pt-8 pb-6 text-[10px] text-brand-text-secondary-gray leading-relaxed text-justify">
          <p className="mb-2 uppercase font-semibold text-brand-text-white tracking-wider flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-brand-gold-premium" />
            Brokerage Disclosure & Equal Housing Opportunity
          </p>
          <p>
            ALL REALTORS INC. IS A LICENSED REAL ESTATE BROKER. EQUAL HOUSING OPPORTUNITY. NO GUARANTEE, WARRANTY OR REPRESENTATION OF ANY KIND IS MADE REGARDING THE COMPLETENESS OR ACCURACY OF DESCRIPTIONS, MEASUREMENTS, OR BUILDING CONDITION. SUCH DESCRIPTIONS SHOULD BE INDEPENDENTLY VERIFIED, AND ALL REALTORS EXPRESSLY DISCLAIMS ANY LIABILITY IN CONNECTION THEREWITH. NOTHING CONTAINED HEREIN CONSTITUTES LEGAL, TAX, OR FINANCIAL ADVICE. PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE REAL ESTATE MARKET VALUES. ALL REALTORS IS COMMITTED TO PROVIDING DIGITAL ACCESSIBILITY TO ALL VISITORS.
          </p>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-white/[0.03] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-brand-text-secondary-gray">
          <p>&copy; {new Date().getFullYear()} All Realtors. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-text-white transition-colors">Terms of Service</Link>
            <Link href="/fair-housing" className="hover:text-brand-text-white transition-colors">Fair Housing Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
