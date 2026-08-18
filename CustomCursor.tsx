"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setIsHidden(false);
      const { clientX, clientY } = e;

      // Update positions using translate3d for GPU acceleration
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
      if (bgGlowRef.current) {
        bgGlowRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    };

    const onMouseLeave = () => {
      setIsHidden(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Dynamic hover detection for interactive elements and data-cursor-label triggers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const labelEl = target.closest("[data-cursor-label]");
      if (labelEl) {
        setCursorLabel(labelEl.getAttribute("data-cursor-label") || "");
        setIsHovered(true);
      } else {
        const isInteractive = 
          target.tagName === "A" || 
          target.tagName === "BUTTON" || 
          target.closest("a") || 
          target.closest("button") || 
          target.closest(".cursor-pointer") ||
          target.closest("[role='button']");

        setCursorLabel("");
        setIsHovered(!!isInteractive);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isHovered, cursorLabel]);

  return (
    <>
      {/* Ambient background mouse follower trail */}
      <div 
        ref={bgGlowRef}
        className={`pointer-events-none fixed top-0 left-0 z-0 h-[384px] w-[384px] -mt-[192px] -ml-[192px] rounded-full bg-[radial-gradient(circle_at_center,rgba(20,107,255,0.05)_0%,rgba(212,175,55,0.02)_40%,transparent_70%)] transition-opacity duration-1000 ease-out hidden md:block ${
          isHidden ? "opacity-0" : "opacity-100"
        }`}
        style={{ willChange: "transform" }}
      />

      {/* Floating Center Dot */}
      <div 
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold-premium transition-opacity duration-300 mix-blend-difference hidden md:block ${
          isHidden ? "opacity-0" : "opacity-100"
        } ${isClicking ? "scale-75" : "scale-100"}`}
        style={{ willChange: "transform" }}
      />

      {/* Hover-Morph Outer Ring / Label Container */}
      <div 
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-[120ms] ease-out hidden md:flex items-center justify-center ${
          isHidden ? "opacity-0" : "opacity-100"
        } ${
          cursorLabel 
            ? "h-16 w-16 border-brand-gold-premium bg-brand-gold-premium text-brand-black-deep scale-100 shadow-lg shadow-brand-gold-premium/20" 
            : isHovered 
              ? "h-10 w-10 border-brand-gold-premium bg-brand-gold-premium/10 scale-125" 
              : "h-10 w-10 border-brand-blue-electric bg-transparent scale-100"
        } ${isClicking ? "scale-90" : ""}`}
        style={{ willChange: "transform" }}
      >
        {cursorLabel && (
          <span className="text-[9px] font-black tracking-widest text-brand-black-deep select-none animate-pulse">
            {cursorLabel}
          </span>
        )}
      </div>
    </>
  );
}
