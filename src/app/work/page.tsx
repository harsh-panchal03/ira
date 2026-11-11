import type { Metadata } from "next";
import WorkIndex from "@/components/portfolio/WorkIndex";
import Contact from "@/components/sections/Contact";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Work",
  description: `Interior design and photoreal 3D visualization by ${site.name}: ${projects.map((p) => p.title).join(", ")}.`,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <section data-tone="paper" className="px-gutter pb-24 pt-40 md:pt-52" aria-labelledby="work-index-title">
        <div className="mb-20 flex flex-col gap-8 md:mb-28 md:flex-row md:items-end md:justify-between">
          <h1 id="work-index-title" className="display text-[clamp(4rem,13vw,15rem)]">
            Work
          </h1>
          <p className="max-w-sm leading-relaxed opacity-75">
            Spaces visualized with such precision they read as finished rooms — {site.tagline.toLowerCase()}
          </p>
        </div>
        <WorkIndex />
      </section>
      <Contact />
    </>
  );
}
