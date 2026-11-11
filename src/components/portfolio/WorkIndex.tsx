"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { gsap } from "@/lib/gsap";
import ProjectMedia from "./ProjectMedia";

/** Editorial index: big titles, with a floating preview that follows the pointer. */
export default function WorkIndex() {
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    gsap.to(preview.current, {
      opacity: active === null ? 0 : 1,
      scale: active === null ? 0.85 : 1,
      duration: 0.6,
      ease: "expo.out",
    });
  }, [active]);

  return (
    <div className="relative">
      <ol className="border-t border-current/15" onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-current/15">
            <Link
              href={`/work/${p.slug}`}
              data-cursor="View"
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={`group grid grid-cols-12 items-center gap-4 py-8 transition-opacity duration-500 md:py-10 ${active !== null && active !== i ? "md:opacity-30" : ""}`}
            >
              <span className="eyebrow col-span-2 opacity-60 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <div className="col-span-3 aspect-[4/5] overflow-hidden md:hidden">
                <ProjectMedia project={p} sizes="25vw" />
              </div>
              <h2 className="display col-span-7 text-[clamp(2rem,6.4vw,7rem)] transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-6 md:col-span-7">
                {p.title}
              </h2>
              <span className="eyebrow col-span-12 opacity-60 md:col-span-2">{p.category}</span>
              <span className="eyebrow col-span-12 opacity-60 md:col-span-2 md:text-right">{p.pending ? "Coming soon" : p.room}</span>
            </Link>
          </li>
        ))}
      </ol>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[42vh] w-[34vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-0 md:block"
      >
        {projects.map((p, i) => (
          <div
            key={p.slug}
            className="absolute inset-0 transition-[clip-path] duration-700 ease-[var(--ease-out)]"
            style={{ clipPath: active === i ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
          >
            <ProjectMedia project={p} sizes="34vh" />
          </div>
        ))}
      </div>
    </div>
  );
}
