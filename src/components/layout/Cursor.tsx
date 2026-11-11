"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Two-part cursor: a precise dot and a lagging ring. The ring opens into a
 * labelled disc over anything with `data-cursor="<label>"`.
 */
export default function Cursor() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    let active: string | null = null;

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = (e.target as Element | null)?.closest?.("[data-cursor], a, button");
      const next = t ? (t.getAttribute("data-cursor") ?? "") : null;
      if (next === active) return;
      active = next;
      if (label.current) label.current.textContent = next ?? "";
      gsap.to(ring.current, {
        scale: next ? (next.length ? 2.6 : 1.6) : 1,
        backgroundColor: next && next.length ? "var(--umber)" : "rgba(0,0,0,0)",
        borderColor: next && next.length ? "var(--umber)" : "var(--ink)",
        duration: 0.5,
        ease: "expo.out",
      });
      gsap.to(label.current, { opacity: next && next.length ? 1 : 0, duration: 0.3 });
      gsap.to(dot.current, { scale: next ? 0 : 1, duration: 0.3 });
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <div
        ref={ring}
        className="absolute left-0 top-0 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-ink/60 opacity-0 mix-blend-normal"
      >
        <span ref={label} className="eyebrow text-[0.25rem] tracking-[0.2em] text-paper opacity-0" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-umber opacity-0" />
    </div>
  );
}
