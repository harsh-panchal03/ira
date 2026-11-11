"use client";
import { useRef } from "react";
import { site } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "@/components/layout/monogram-path";

export default function Contact({ standalone = false }: { standalone?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const Heading = standalone ? "h1" : "h2";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current!.querySelectorAll("[data-big] > span > span"), {
          yPercent: 110,
          stagger: 0.1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
        // The monogram is traced as the page ends — the last drawing.
        const path = root.current!.querySelector<SVGPathElement>("[data-mono]")!;
        const l = path.getTotalLength();
        gsap.set(path, { strokeDasharray: l, strokeDashoffset: l, fillOpacity: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: path, start: "top 95%", end: "bottom bottom", scrub: 1 } })
          .to(path, { strokeDashoffset: 0, ease: "none", duration: 0.8 })
          .to(path, { fillOpacity: 1, ease: "none", duration: 0.2 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const lines = ["Let’s see", "your space", "before it’s built."];

  return (
    <section ref={root} id="contact" data-tone="paper" aria-labelledby="contact-title" className="relative overflow-hidden pt-36 md:pt-48">
      <div className="px-gutter">
        <p className="eyebrow mb-10 text-umber">Contact</p>
        <Heading id="contact-title" data-big className="display text-[clamp(3.6rem,11.5vw,13rem)] leading-[0.86]">
          {lines.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.08em]">
              <span className={`block ${i === 1 ? "pl-[10vw] italic text-umber" : ""}`}>{l}</span>
            </span>
          ))}
        </Heading>

        <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-28">
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow mb-6 opacity-60">Talk to {site.contactPerson}</p>
            <ul className="space-y-2">
              {[
                site.whatsapp && { href: site.whatsapp, label: "WhatsApp", cursor: "Chat", external: true },
                site.phone && { href: `tel:${site.phone.replace(/\s/g, "")}`, label: site.phone, cursor: "Call", external: false },
                { href: site.instagram, label: "Instagram", cursor: "Write", external: true },
              ]
                .filter(Boolean)
                .map((l) => {
                  const link = l as { href: string; label: string; cursor: string; external: boolean };
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                        data-cursor={link.cursor}
                        className="group inline-flex items-center gap-6 border-b border-current/20 pb-3 transition-colors hover:border-umber"
                      >
                        <span className="display text-[clamp(2rem,4.6vw,4.4rem)] transition-colors group-hover:text-umber">{link.label}</span>
                        <span aria-hidden="true" className="text-3xl transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-3 group-hover:-rotate-45">
                          →
                        </span>
                      </a>
                    </li>
                  );
                })}
            </ul>
            <p className="mt-6 max-w-md leading-relaxed opacity-70">
              Share your floor plan, a few reference images and the feeling you want the room to have. We’ll take it from there.
            </p>
          </div>
          <dl className="col-span-12 grid grid-cols-2 gap-8 self-start md:col-span-5 md:col-start-8">
            {site.contactPerson && (
              <div>
                <dt className="eyebrow mb-2 opacity-60">Contact</dt>
                <dd>{site.contactPerson}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow mb-2 opacity-60">Instagram</dt>
              <dd>
                <a href={site.instagram} target="_blank" rel="noreferrer" className="link-draw">
                  {site.handle}
                </a>
              </dd>
            </div>
            {site.email && (
              <div>
                <dt className="eyebrow mb-2 opacity-60">Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="link-draw">
                    {site.email}
                  </a>
                </dd>
              </div>
            )}
            {site.phone && (
              <div>
                <dt className="eyebrow mb-2 opacity-60">Phone</dt>
                <dd>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-draw">
                    {site.phone}
                  </a>
                </dd>
              </div>
            )}
            {site.location && (
              <div>
                <dt className="eyebrow mb-2 opacity-60">Studio</dt>
                <dd>{site.location}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow mb-2 opacity-60">Services</dt>
              <dd>Interior Design · 3D Visualization</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-32 px-gutter text-umber" aria-hidden="true">
        <svg viewBox={MONOGRAM_VIEWBOX} className="w-full overflow-visible">
          <path data-mono d={MONOGRAM_PATH} fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
    </section>
  );
}
