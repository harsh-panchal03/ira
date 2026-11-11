"use client";
import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Words brighten from 15% to full ink as the paragraph scrolls through
 * the viewport — reading pace follows scroll pace.
 */
export default function RevealText({
  text,
  as: Tag = "p",
  className = "",
  emphasis = [],
}: {
  text: string;
  as?: ElementType;
  className?: string;
  emphasis?: string[];
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current!.querySelectorAll("[data-w]"),
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} data-w className={emphasis.includes(w.replace(/[^\w'—]/g, "")) ? "italic text-umber" : undefined}>
            {w}{" "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
