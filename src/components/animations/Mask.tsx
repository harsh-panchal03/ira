"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Clip-path wipe as the element enters — images arrive like a blind lifting. */
export default function Mask({ children, className = "", from = "bottom" }: { children: ReactNode; className?: string; from?: "bottom" | "left" }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { clipPath: from === "bottom" ? "inset(100% 0 0 0)" : "inset(0 100% 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: ref.current, start: "top 85%" } },
        );
        gsap.fromTo(ref.current!.firstElementChild, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 85%" } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
