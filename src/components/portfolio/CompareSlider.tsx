"use client";
import { useRef, useState } from "react";
import type { Project } from "@/data/projects";
import ProjectMedia from "./ProjectMedia";

/** Drag (or use arrow keys) between the line drawing and the finished render. */
export default function CompareSlider({ project }: { project: Project }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromEvent = (clientX: number) => {
    const b = ref.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - b.left) / b.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full touch-pan-y select-none overflow-hidden md:aspect-[5/4]"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        fromEvent(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromEvent(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      data-cursor="Drag"
    >
      <div className="absolute inset-0">
        <ProjectMedia project={project} sizes="(max-width: 768px) 100vw, 80vw" />
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <ProjectMedia project={project} variant="line" sizes="(max-width: 768px) 100vw, 80vw" />
      </div>
      <span className="eyebrow absolute left-4 top-4 bg-paper/85 px-2 py-1 text-ink">Drawing</span>
      <span className="eyebrow absolute right-4 top-4 bg-paper/85 px-2 py-1 text-ink">Render</span>
      <div className="absolute inset-y-0 w-px bg-paper" style={{ left: `${pos}%` }}>
        <button
          type="button"
          role="slider"
          aria-label="Compare drawing and render"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper bg-umber/80 text-paper backdrop-blur"
        >
          <span aria-hidden="true">↔</span>
        </button>
      </div>
    </div>
  );
}
