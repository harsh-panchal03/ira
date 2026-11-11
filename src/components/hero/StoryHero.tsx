"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { sceneStore } from "@/lib/scene-store";
import { useRichMotion } from "@/hooks/useMediaQuery";
import { onIntroDone } from "@/components/transitions/Intro";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const RoomScene = dynamic(() => import("@/components/three/RoomScene"), { ssr: false });

const hero = projects[0];

const chapters = [
  { n: "01", k: "Line", title: "Proportion before polish.", body: "Every space begins as a drawing — sofa, table, vessel, window — balanced before a single material is chosen." },
  { n: "02", k: "Form", title: "The room gains weight.", body: "Volumes are blocked in. Heights, depths and the space between things are settled in three dimensions." },
  { n: "03", k: "Material", title: "Travertine, linen, rattan, walnut.", body: "Textures and tones are layered until every surface feels like something you could touch." },
  { n: "04", k: "Light", title: "The sun does the composing.", body: "Low light rakes across the stone and leaves throw their shadows. The image starts to breathe." },
];

export default function StoryHero() {
  const root = useRef<HTMLElement>(null);
  const rich = useRichMotion();
  const [inView, setInView] = useState(true);

  // Pause WebGL when the hero is off-screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer → scene + type parallax.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      sceneStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneStore.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance, after the intro curtain lifts.
        gsap.set(q("[data-line-inner]"), { yPercent: 110 });
        gsap.set(q("[data-fade]"), { opacity: 0, y: 14 });
        const off = onIntroDone(() => {
          gsap.to(q("[data-line-inner]"), { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.12 });
          gsap.to(q("[data-fade]"), { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.4 });
        });

        // Type parallax with the pointer.
        const tx = gsap.quickTo(q("[data-parallax]"), "x", { duration: 1.2, ease: "power3" });
        const onMove = (e: PointerEvent) => tx(((e.clientX / window.innerWidth) - 0.5) * -24);
        window.addEventListener("pointermove", onMove, { passive: true });

        // Scroll-scrubbed story.
        gsap.set(q("[data-chapter]"), { autoAlpha: 0, y: 50 });
        gsap.set(q("[data-reality]"), { clipPath: "inset(50% 50% 50% 50%)" });
        gsap.set(q("[data-reality-img]"), { scale: 1.25 });
        gsap.set(q("[data-reality-cap]"), { autoAlpha: 0, y: 20 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onUpdate: (st) => (sceneStore.progress = st.progress),
          },
        });

        tl.to(q("[data-stage]"), { backgroundColor: "#e3dccf", duration: 0.45 }, 0)
          .to(q("[data-stage]"), { backgroundColor: "#d7cebf", duration: 0.35 }, 0.45)
          .to(q("[data-l1]"), { xPercent: -18, opacity: 0, duration: 0.14, ease: "power2.in" }, 0.01)
          .to(q("[data-l2]"), { xPercent: 14, opacity: 0, duration: 0.14, ease: "power2.in" }, 0.02)
          .to(q("[data-hero-meta]"), { opacity: 0, y: -20, duration: 0.08 }, 0.01)
          .to(q("[data-rail-fill]"), { scaleY: 1, duration: 1 }, 0)
          // Mobile / fallback: line drawing becomes the render.
          .to(q("[data-fallback-render]"), { opacity: 1, duration: 0.4 }, 0.3);

        const windows: [number, number][] = [
          [0.14, 0.3],
          [0.32, 0.5],
          [0.52, 0.66],
          [0.68, 0.8],
        ];
        q("[data-chapter]").forEach((el, i) => {
          const [a, b] = windows[i];
          tl.to(el, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, a).to(
            el,
            { autoAlpha: 0, y: -50, duration: 0.05, ease: "power2.in" },
            b - 0.05,
          );
          tl.to(q(`[data-rail="${i}"]`), { opacity: 1, duration: 0.02 }, a).to(q(`[data-rail="${i}"]`), { opacity: 0.35, duration: 0.02 }, b);
        });

        // Reality: the real render opens from a window into full bleed.
        tl.to(q("[data-reality]"), { clipPath: "inset(34% 40% 34% 40%)", duration: 0.04, ease: "power2.out" }, 0.78)
          .to(q("[data-reality]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.12, ease: "power2.inOut" }, 0.82)
          .to(q("[data-reality-img]"), { scale: 1, duration: 0.16, ease: "power2.out" }, 0.8)
          .to(q("[data-scene]"), { opacity: 0, duration: 0.08 }, 0.88)
          .to(q("[data-rail-wrap]"), { opacity: 0, duration: 0.05 }, 0.88)
          .to(q("[data-reality-cap]"), { autoAlpha: 1, y: 0, duration: 0.05 }, 0.92);

        return () => {
          off();
          window.removeEventListener("pointermove", onMove);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // Recalculate once the canvas mounts and changes nothing visible but timing.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [rich]);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative h-[560vh] motion-reduce:h-auto"
    >
      <div
        data-stage
        className="sticky top-0 h-svh overflow-hidden bg-paper motion-reduce:static motion-reduce:h-auto motion-reduce:min-h-svh"
      >
        {/* Visual layer */}
        <div data-scene className="absolute inset-0" aria-hidden="true">
          {rich ? (
            <RoomScene active={inView} />
          ) : (
            <div className="absolute left-1/2 top-[12%] h-[52%] w-[min(78vw,420px)] -translate-x-1/2 overflow-hidden rounded-t-full md:top-[14%] md:h-[62%]">
              <Image src={hero.linework!.src} alt="" fill sizes="(max-width: 900px) 78vw, 420px" className="object-cover" priority />
              <div data-fallback-render className="absolute inset-0 opacity-0 motion-reduce:opacity-100">
                <Image src={hero.image!.src} alt="" fill sizes="(max-width: 900px) 78vw, 420px" className="object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-gutter pb-[max(2rem,6vh)] motion-reduce:relative motion-reduce:pt-[70svh]">
          <h1 id="hero-title" data-parallax className="display text-[clamp(3.2rem,9.4vw,10.5rem)] text-ink">
            <span data-l1 className="block overflow-hidden pb-[0.06em]">
              <span data-line-inner className="block">Ideas into visuals.</span>
            </span>
            <span data-l2 className="block overflow-hidden pb-[0.06em] md:pl-[12vw]">
              <span data-line-inner className="block">
                Visuals into <em className="text-umber">reality.</em>
              </span>
            </span>
          </h1>
        </div>

        <div data-hero-meta className="absolute inset-x-0 top-[5.5rem] flex justify-between px-gutter md:top-28">
          <p data-fade className="eyebrow max-w-[14rem] text-umber">
            Interior Design
            <br />& 3D Visualization
          </p>
          <p data-fade className="hidden max-w-[19rem] text-right text-sm leading-relaxed text-ink/70 md:block">
            {site.promise}
          </p>
        </div>

        <div data-fade className="absolute bottom-[max(2rem,6vh)] right-[var(--gutter)] hidden items-center gap-4 lg:flex motion-reduce:hidden" aria-hidden="true">
          <span className="eyebrow text-ink/60">Scroll — line to light</span>
          <span className="relative block h-12 w-px overflow-hidden bg-ink/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-in-out)_infinite] bg-umber" />
          </span>
        </div>

        {/* Chapters */}
        <ol
          aria-label="From idea to render"
          className="absolute inset-x-0 bottom-[14vh] grid px-gutter [grid-template-areas:'stack'] md:bottom-auto md:left-auto md:right-[5vw] md:top-[17vh] md:w-[min(30rem,34vw)] md:px-0 motion-reduce:relative motion-reduce:inset-auto motion-reduce:w-auto motion-reduce:gap-10 motion-reduce:py-20 motion-reduce:[grid-template-areas:none]"
        >
          {chapters.map((c) => (
            <li
              key={c.n}
              data-chapter
              className="[grid-area:stack] rounded-sm bg-paper/70 p-5 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none motion-reduce:[grid-area:auto]"
            >
              <p className="eyebrow mb-4 flex items-center gap-4 text-umber">
                <span>{c.n}</span>
                <span className="h-px w-10 bg-umber/50" />
                <span>{c.k}</span>
              </p>
              <h2 className="display text-[clamp(2rem,4.2vw,4.25rem)] text-ink">{c.title}</h2>
              <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink/75">{c.body}</p>
            </li>
          ))}
        </ol>

        {/* Progress rail */}
        <div data-rail-wrap className="absolute left-[var(--gutter)] top-1/2 hidden -translate-y-1/2 items-stretch gap-5 md:flex motion-reduce:hidden" aria-hidden="true">
          <span className="relative w-px bg-ink/15">
            <span data-rail-fill className="absolute inset-0 origin-top scale-y-0 bg-umber" />
          </span>
          <ul className="flex flex-col gap-6">
            {chapters.map((c, i) => (
              <li key={c.k} data-rail={i} className="eyebrow text-ink opacity-35">
                {c.k}
              </li>
            ))}
            <li className="eyebrow text-ink opacity-35">Reality</li>
          </ul>
        </div>

        {/* Reality */}
        <figure
          data-reality
          className="absolute inset-0 motion-reduce:relative motion-reduce:aspect-[4/5] motion-reduce:[clip-path:none]! md:motion-reduce:aspect-[16/9]"
          style={{ clipPath: "inset(50% 50% 50% 50%)" }}
        >
          <div data-reality-img className="absolute inset-0">
            <Image src={hero.image!.src} alt={hero.image!.alt} fill sizes="100vw" className="object-cover object-[50%_70%]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-walnut/70 via-transparent to-transparent" />
          <figcaption data-reality-cap className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-gutter pb-10 text-paper md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3 text-paper/80">05 — Reality</p>
              <p className="display text-[clamp(2.4rem,6vw,6rem)]">
                Render <em>to</em> reality.
              </p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-paper/85">
              {hero.title} — a finished room, before a single brick is laid.
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
