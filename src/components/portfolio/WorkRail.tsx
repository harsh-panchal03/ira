"use client";
import Link from "next/link";
import { useRef } from "react";
import { projects } from "@/data/projects";
import { gsap, useGSAP } from "@/lib/gsap";
import LensMedia from "./LensMedia";

/** Frame shapes — each project gets its own proportion and vertical offset. */
const frames = [
  "min-[900px]:h-[68vh] min-[900px]:w-[calc(68vh*0.8)] min-[900px]:self-end",
  "min-[900px]:h-[46vh] min-[900px]:w-[calc(46vh*1.6)] min-[900px]:self-start min-[900px]:mt-[6vh]",
  "min-[900px]:h-[60vh] min-[900px]:w-[calc(60vh*0.75)] min-[900px]:self-center",
  "min-[900px]:h-[50vh] min-[900px]:w-[50vh] min-[900px]:self-end min-[900px]:mb-[4vh]",
  "min-[900px]:h-[62vh] min-[900px]:w-[calc(62vh*0.8)] min-[900px]:self-start min-[900px]:mt-[2vh]",
];
const mobileFrames = ["aspect-[4/5] w-[88%]", "aspect-[16/10] w-[78%] ml-auto", "aspect-[3/4] w-[70%]", "aspect-square w-[76%] ml-auto", "aspect-[4/5] w-[84%]"];

export default function WorkRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        // Titles drift slower than frames for layered depth.
        gsap.utils.toArray<HTMLElement>("[data-rail-title]", root.current).forEach((el) => {
          gsap.fromTo(el, { xPercent: 30 }, { xPercent: -10, ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
        // Frames tilt in like pages turning.
        gsap.utils.toArray<HTMLElement>("[data-rail-frame]", root.current).forEach((el) => {
          gsap.fromTo(el, { rotateY: -14, scale: 0.9 }, { rotateY: 0, scale: 1, ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left right", end: "center center", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" data-tone="linen" aria-labelledby="work-title" className="relative overflow-hidden">
      <div ref={track} className="flex flex-col gap-24 px-gutter py-28 min-[900px]:h-svh min-[900px]:w-max min-[900px]:flex-row min-[900px]:items-stretch min-[900px]:gap-[8vw] min-[900px]:py-[12vh] motion-reduce:min-[900px]:w-auto motion-reduce:min-[900px]:flex-wrap motion-reduce:min-[900px]:h-auto">
        <header className="flex shrink-0 flex-col justify-between min-[900px]:w-[34vw]">
          <p className="eyebrow text-umber">Selected work</p>
          <div>
            <h2 id="work-title" className="display text-[clamp(3.5rem,9vw,10rem)]">
              Rooms,
              <br />
              <em className="text-umber">before</em> they
              <br />
              exist.
            </h2>
            <p className="mt-8 max-w-sm leading-relaxed opacity-75">
              Hover an image to look through the render to the drawing beneath it.
            </p>
          </div>
          <p className="eyebrow hidden opacity-60 min-[900px]:block">Scroll →</p>
        </header>

        {projects.map((p, i) => (
          <article key={p.slug} className="flex shrink-0 flex-col gap-6 [perspective:1400px] min-[900px]:flex-row min-[900px]:items-stretch min-[900px]:gap-8">
            <Link
              href={`/work/${p.slug}`}
              data-rail-frame
              data-cursor="View"
              className={`relative block shrink-0 overflow-hidden bg-stone/30 ${mobileFrames[i]} min-[900px]:ml-0 min-[900px]:aspect-auto ${frames[i]}`}
              aria-label={`${p.title} — ${p.category}`}
            >
              <LensMedia project={p} sizes="(max-width: 900px) 88vw, 50vw" />
              {p.pending && <span className="eyebrow absolute left-4 top-4 bg-paper/80 px-2 py-1 text-[0.6rem] text-ink">Concept plate</span>}
            </Link>
            <div data-rail-title className={`flex flex-col justify-end min-[900px]:w-[15rem] ${i % 2 ? "min-[900px]:justify-start" : ""}`}>
              <p className="eyebrow mb-3 opacity-60">
                {String(i + 1).padStart(2, "0")} — {p.category}
              </p>
              <h3 className="display text-4xl md:text-5xl">
                <Link href={`/work/${p.slug}`} className="link-draw">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-4 text-sm leading-relaxed opacity-70">{p.summary}</p>
            </div>
          </article>
        ))}
        <div className="hidden w-[10vw] shrink-0 min-[900px]:block" aria-hidden="true" />
      </div>
    </section>
  );
}
