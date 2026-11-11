"use client";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import ProjectMedia from "./ProjectMedia";
import { gsap } from "@/lib/gsap";

/**
 * The finished render, with a lens that follows the pointer and shows the
 * line drawing underneath — the idea, inside the image.
 */
export default function LensMedia({ project, sizes, priority }: { project: Project; sizes: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ r: 0 });

  const apply = () => ref.current?.style.setProperty("--r", `${state.current.r}px`);
  const onMove = (e: React.PointerEvent) => {
    const b = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty("--x", `${e.clientX - b.left}px`);
    ref.current!.style.setProperty("--y", `${e.clientY - b.top}px`);
  };
  const grow = (to: number) => gsap.to(state.current, { r: to, duration: 0.8, ease: "expo.out", onUpdate: apply });

  return (
    <div
      ref={ref}
      className="group relative h-full w-full overflow-hidden"
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && grow(Math.min(170, (ref.current?.offsetWidth ?? 400) * 0.28))}
      onPointerLeave={() => grow(0)}
    >
      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.04]">
        <ProjectMedia project={project} sizes={sizes} priority={priority} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        style={{
          WebkitMaskImage: "radial-gradient(circle var(--r, 0px) at var(--x, 50%) var(--y, 50%), #000 98%, transparent 100%)",
          maskImage: "radial-gradient(circle var(--r, 0px) at var(--x, 50%) var(--y, 50%), #000 98%, transparent 100%)",
        }}
      >
        <ProjectMedia project={project} variant="line" sizes={sizes} />
      </div>
    </div>
  );
}
