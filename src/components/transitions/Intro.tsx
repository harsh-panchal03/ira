"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "@/components/layout/monogram-path";
import { site } from "@/data/site";

export const INTRO_DONE = "ira:intro-done";
const KEY = "ira-intro-seen";

/** Runs before paint: skip the intro for repeat visits in this session or reduced motion. */
export const introGateScript = `try{if(sessionStorage.getItem("${KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("intro-seen")}}catch(e){}`;

export function markIntroDone() {
  (window as unknown as { __iraIntroDone?: boolean }).__iraIntroDone = true;
  window.dispatchEvent(new Event(INTRO_DONE));
}

export function onIntroDone(cb: () => void) {
  if (
    (window as unknown as { __iraIntroDone?: boolean }).__iraIntroDone ||
    document.documentElement.classList.contains("intro-seen")
  ) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE, cb);
}

/**
 * ~2.4s opening: the monogram is drawn as a pencil outline, filled with
 * the brand umber, the studio line types on, then the curtain lifts.
 */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      if (document.documentElement.classList.contains("intro-seen")) {
        setDone(true);
        markIntroDone();
        return;
      }
      const path = el.querySelector<SVGPathElement>("path")!;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          setDone(true);
        },
      });
      tl.to(path, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" })
        .to(path, { fillOpacity: 1, strokeOpacity: 0, duration: 0.6, ease: "power1.out" }, "-=0.25")
        .from(el.querySelectorAll("[data-letter]"), { yPercent: 120, opacity: 0, stagger: 0.04, duration: 0.9 }, "-=0.55")
        .from(el.querySelector("[data-line]"), { scaleX: 0, duration: 1 }, "<")
        .from(el.querySelector("[data-tag]"), { opacity: 0, y: 10, duration: 0.8 }, "<0.2")
        .add(markIntroDone, "+=0.25")
        .to(el.querySelector("[data-mark]"), { y: -40, opacity: 0, duration: 0.8, ease: "power3.in" }, "<")
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "<0.15");
    },
    { scope: root },
  );

  // Unmount through React (never detach React-owned nodes by hand).
  if (done) return null;

  return (
    <div
      ref={root}
      data-intro
      aria-hidden="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-paper text-umber"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div data-mark className="flex w-[min(52vw,320px)] flex-col items-center">
        <svg viewBox={MONOGRAM_VIEWBOX} className="w-full overflow-visible">
          <path d={MONOGRAM_PATH} fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        <div className="mt-5 flex overflow-hidden font-sans text-[clamp(0.8rem,2vw,1.05rem)] font-light uppercase tracking-[0.55em]">
          {"DESIGNS".split("").map((l, i) => (
            <span key={i} data-letter className="inline-block">
              {l}
            </span>
          ))}
        </div>
        <span data-line className="mt-8 block h-px w-24 origin-left bg-umber/40" />
        <p data-tag className="mt-5 text-center font-display text-lg italic text-ink/70">
          {site.tagline}
        </p>
      </div>
    </div>
  );
}
