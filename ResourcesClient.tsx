"use client";

import Link from "next/link";
import { Download, Lock, ChevronRight } from "lucide-react";

interface ResourcesClientProps {
  isVipOrAdmin: boolean;
}

export default function ResourcesClient({ isVipOrAdmin }: ResourcesClientProps) {
  const resources = [
    {
      id: "res-1",
      title: "BKMSFX Premium Order Block Indicator",
      description: "Custom TradingView Pine Script that automatically identifies high-probability order blocks, fair value gaps, and liquidity sweep swing points in real time.",
      category: "Indicators",
      version: "v1.4.2",
      requiresVip: true,
      fileUrl: "/resources/bkmsfx_orderblocks.txt",
    },
    {
      id: "res-2",
      title: "1% Risk Position Size Calculator",
      description: "A comprehensive Excel journal and position size calculator. Enter account size, stop loss distance, and risk % to automatically receive optimal contract sizing.",
      category: "Templates",
      version: "v2.1",
      requiresVip: false,
      fileUrl: "/resources/bkmsfx_calculator.xlsx",
    },
    {
      id: "res-3",
      title: "Market Structure Blueprint & Checklist",
      description: "A comprehensive PDF guidelines document walking through the step-by-step swing structure mapping process required before executing any setup.",
      category: "PDFs",
      version: "v1.1",
      requiresVip: false,
      fileUrl: "/resources/bkmsfx_blueprint.pdf",
    },
    {
      id: "res-4",
      title: "VIP Liquidity Sweep Cheat Sheet",
      description: "High-contrast visual PDF outlining the key differences between fake breakouts and structural liquidity sweep entry signals.",
      category: "PDFs",
      version: "v1.0",
      requiresVip: true,
      fileUrl: "/resources/bkmsfx_sweeps.pdf",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {resources.map((res) => {
        const hasAccess = !res.requiresVip || isVipOrAdmin;

        return (
          <div
            key={res.id}
            className={`glass-panel rounded-xl p-6 sm:p-8 flex flex-col justify-between border ${
              res.requiresVip
                ? isVipOrAdmin
                  ? "border-brand-gold-premium/25"
                  : "border-white/[0.04] bg-white/[0.01]"
                : "border-white/[0.05]"
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-brand-gold-premium tracking-wider bg-brand-gold-premium/10 px-2 py-0.5 rounded border border-brand-gold-premium/15">
                  {res.category}
                </span>
                <span className="text-[9px] font-mono text-brand-text-secondary-gray">
                  Ver {res.version}
                </span>
              </div>

              <h3 className="text-base font-bold text-brand-text-white mt-4 flex items-center gap-2">
                {res.title}
                {!hasAccess && <Lock className="h-4.5 w-4.5 text-brand-gold-premium/50 shrink-0" />}
              </h3>

              <p className="text-xs text-brand-text-secondary-gray mt-2 leading-relaxed">
                {res.description}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-white/[0.03] flex items-center justify-between">
              <span className="text-[10px] text-brand-text-secondary-gray uppercase font-semibold">
                {res.requiresVip ? "VIP Member Resource" : "General Access"}
              </span>

              {hasAccess ? (
                <button
                  onClick={() => alert(`Mock Download: Starting download for ${res.title}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue-electric hover:bg-brand-blue-bright text-xs font-semibold rounded text-white transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              ) : (
                <Link
                  href="/vip"
                  className="flex items-center gap-1 px-4 py-2 border border-brand-gold-premium/30 bg-brand-gold-premium/10 hover:bg-brand-gold-premium hover:text-brand-black-deep text-brand-gold-premium text-xs font-semibold rounded transition-all"
                >
                  Upgrade to VIP
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
