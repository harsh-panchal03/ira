"use client";
import { useRef } from "react";
import { services, type Service } from "@/data/services";
import { gsap, useGSAP } from "@/lib/gsap";

function Motif({ kind }: { kind: Service["motif"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      {kind === "plan" && (
        <g {...common}>
          <rect data-draw x="20" y="20" width="160" height="160" />
          <path data-draw d="M20 110 H90 V180 M90 20 V70 M130 110 H180" />
          <path data-draw d="M90 70 A40 40 0 0 1 130 110" strokeDasharray="3 4" />
          <rect data-draw x="34" y="128" width="42" height="34" rx="6" />
          <circle data-draw cx="140" cy="60" r="18" />
        </g>
      )}
      {kind === "cube" && (
        <g {...common}>
          <path data-draw d="M100 24 L170 62 L170 140 L100 178 L30 140 L30 62 Z" />
          <path data-draw d="M30 62 L100 100 L170 62 M100 100 V178" />
          <path data-draw d="M65 43 L135 81 M65 159 V81" strokeDasharray="3 4" />
        </g>
      )}
      {kind === "sun" && (
        <g {...common}>
          <path data-draw d="M40 180 V90 A60 60 0 0 1 160 90 V180" />
          <path data-draw d="M60 180 L120 70 M90 180 L150 75 M120 180 L160 110" strokeDasharray="2 5" />
          <circle data-draw cx="100" cy="40" r="10" />
        </g>
      )}
    </svg>
  );
}

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-service]", root.current).forEach((row) => {
          const paths = row.querySelectorAll<SVGGeometryElement>("[data-draw]");
          paths.forEach((p) => {
            const l = p.getTotalLength();
            gsap.set(p, { strokeDasharray: p.getAttribute("stroke-dasharray") ?? `${l}`, strokeDashoffset: l });
          });
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 75%" } });
          tl.fromTo(row.querySelector("[data-title]"), { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "expo.out" })
            .to(paths, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.12 }, 0.1)
            .from(row.querySelectorAll("[data-copy]"), { opacity: 0, y: 20, stagger: 0.08, duration: 1, ease: "expo.out" }, 0.3)
            .from(row.querySelector("[data-rule]"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" data-tone="walnut" aria-labelledby="services-title" className="relative py-32 md:py-48">
      <div className="mb-20 grid grid-cols-12 gap-4 px-gutter md:mb-32">
        <p className="eyebrow col-span-12 text-sand md:col-span-3">Services</p>
        <h2 id="services-title" className="display col-span-12 text-[clamp(2.6rem,6vw,6.5rem)] md:col-span-9">
          Three ways we take a space <em className="text-sand">from thought to sight.</em>
        </h2>
      </div>

      <ol className="px-gutter">
        {services.map((s) => (
          <li key={s.index} data-service className="group relative grid grid-cols-12 gap-x-4 gap-y-8 py-14 md:py-20">
            <span data-rule className="absolute inset-x-0 top-0 block h-px origin-left bg-current opacity-20" />
            <p className="eyebrow col-span-2 pt-4 text-sand md:col-span-1">{s.index}</p>
            <div className="col-span-10 md:col-span-6">
              <h3 className="overflow-hidden transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-4">
                <span data-title className="display block text-[clamp(2.8rem,7vw,7.5rem)]">
                  {s.title}
                </span>
              </h3>
              <p data-copy className="display mt-6 text-2xl italic text-sand md:text-3xl">
                {s.lead}
              </p>
            </div>
            <div className="col-span-12 md:col-span-3 md:col-start-8">
              <p data-copy className="leading-relaxed opacity-75">
                {s.body}
              </p>
              <ul data-copy className="mt-8 space-y-2">
                {s.facets.map((f) => (
                  <li key={f} className="eyebrow flex items-center gap-3 opacity-70">
                    <span className="h-px w-5 bg-sand" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-5 text-sand/80 md:col-span-1 md:col-start-12 md:aspect-square">
              <Motif kind={s.motif} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
