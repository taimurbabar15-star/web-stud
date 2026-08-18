"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { verifyGalleryPasswordAction } from "@/app/actions/gallery";

interface ClientGalleryLockProps {
  slug: string;
  title: string;
}

export default function ClientGalleryLock({ slug, title }: ClientGalleryLockProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await verifyGalleryPasswordAction(slug, password);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.refresh();
      }
    });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-brand-text-primary-gray">
      <div className="glass-panel border-white/[0.06] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold-premium/45 to-transparent" />
        
        <div className="inline-flex p-3 rounded-full bg-brand-gold-premium/10 text-brand-gold-premium mb-6">
          <Lock className="h-10 w-10" />
        </div>

        <h1 className="font-display text-xl font-black uppercase text-brand-text-white mb-1">
          Private Gallery
        </h1>
        <p className="text-[10px] text-brand-text-secondary-gray uppercase tracking-widest block mb-4">
          {title}
        </p>
        <p className="text-xs text-brand-text-secondary-gray leading-relaxed max-w-xs mx-auto mb-6">
          This gallery is password-protected. Please enter the security key provided by the photographer to unlock access.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border border-white/[0.08] bg-brand-black-rich py-2.5 px-4 text-xs text-center text-brand-text-white placeholder-brand-text-secondary-gray focus:border-brand-gold-premium focus:outline-none focus:ring-1 focus:ring-brand-gold-premium"
              placeholder="Enter Gallery Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-text-secondary-gray hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            {isPending ? "Unlocking..." : "Access Gallery"}
            {!isPending && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
