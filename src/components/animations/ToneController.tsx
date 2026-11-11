"use client";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const tones: Record<string, { bg: string; fg: string }> = {
  paper: { bg: "#f1ece3", fg: "#2a1c13" },
  linen: { bg: "#e3dccf", fg: "#2a1c13" },
  travertine: { bg: "#d7cebf", fg: "#2a1c13" },
  walnut: { bg: "#2a1c13", fg: "#f1ece3" },
};

/**
 * The page has one continuous ground colour that shifts as each
 * `[data-tone]` section takes the stage — sections themselves stay transparent.
 */
export default function ToneController() {
  const pathname = usePathname();
  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-tone]");
      const set = (t: string) => {
        const tone = tones[t] ?? tones.paper;
        gsap.to(document.body, { backgroundColor: tone.bg, color: tone.fg, duration: 0.9, ease: "power2.out", overwrite: true });
      };
      gsap.set(document.body, { backgroundColor: tones[sections[0]?.dataset.tone ?? "paper"].bg });
      const triggers = sections.map((s, i) =>
        ScrollTrigger.create({
          trigger: s,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => set(s.dataset.tone!),
          onEnterBack: () => set(s.dataset.tone!),
          onLeaveBack: () => i > 0 && set(sections[i - 1].dataset.tone!),
          refreshPriority: -10, // measure after pins have added their spacing
        }),
      );
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );
  return null;
}
