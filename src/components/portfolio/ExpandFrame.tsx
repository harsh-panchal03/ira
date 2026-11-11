"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** A framed image that opens to full bleed as it scrolls into the centre. */
export default function ExpandFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(8% 12% 8% 12%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "center center", scrub: true } },
        );
        gsap.fromTo(
          ref.current!.firstElementChild,
          { scale: 1.18 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
