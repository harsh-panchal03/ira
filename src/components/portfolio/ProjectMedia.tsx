import Image from "next/image";
import type { Project } from "@/data/projects";
import ProjectPlate from "./ProjectPlate";

/** Real render when supplied, otherwise the matching concept plate. */
export default function ProjectMedia({
  project,
  variant = "render",
  sizes = "100vw",
  priority = false,
  className = "",
}: {
  project: Project;
  variant?: "render" | "line";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  // No line drawing supplied → use a sketch-toned version of the real render.
  const sketch = variant === "line" && !project.linework && !!project.image;
  const img = variant === "line" ? (project.linework ?? project.image) : project.image;
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {img ? (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={sketch ? { filter: "grayscale(1) sepia(0.35) contrast(1.5) brightness(1.15)" } : undefined}
        />
      ) : (
        <div
          className="absolute inset-0"
          role="img"
          aria-label={`${variant === "line" ? "Line drawing" : "Concept plate"} — ${project.title}, ${project.room.toLowerCase()}`}
        >
          <ProjectPlate kind={project.plate} mode={variant} />
        </div>
      )}
    </div>
  );
}
