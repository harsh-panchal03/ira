import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, nextProject, projects } from "@/data/projects";
import { site } from "@/data/site";
import ProjectMedia from "@/components/portfolio/ProjectMedia";
import CompareSlider from "@/components/portfolio/CompareSlider";
import ExpandFrame from "@/components/portfolio/ExpandFrame";
import Reveal from "@/components/portfolio/Reveal";
import Mask from "@/components/animations/Mask";
import Parallax from "@/components/animations/Parallax";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: `${p.summary} ${p.category} by ${site.name}.`,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: `${p.title} — ${site.name}`,
      description: p.summary,
      images: p.image ? [{ url: p.image.src, width: p.image.width, height: p.image.height, alt: p.image.alt }] : undefined,
    },
  };
}

function Stage({ n, label, title, children }: { n: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-12 gap-x-4 gap-y-10 px-gutter py-24 md:py-36">
      <div className="col-span-12 md:col-span-4">
        <div className="md:sticky md:top-32">
          <p className="eyebrow mb-6 flex items-center gap-4 text-umber">
            <span>{n}</span>
            <span className="h-px w-10 bg-umber/50" />
            <span>{label}</span>
          </p>
          <h2 className="display text-[clamp(2.4rem,4.4vw,4.6rem)]">{title}</h2>
        </div>
      </div>
      <div className="col-span-12 md:col-span-8">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = nextProject(p.slug);
  const index = projects.indexOf(p) + 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    genre: p.category,
    about: p.room,
    description: p.summary,
    creator: { "@type": "Organization", name: site.name, url: site.url },
    image: p.image ? `${site.url}${p.image.src}` : undefined,
    url: `${site.url}/work/${p.slug}`,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Introduction */}
      <header data-tone={p.tone} className="px-gutter pb-16 pt-40 md:pt-52">
        <Reveal className="grid grid-cols-12 gap-x-4 gap-y-10">
          <p className="eyebrow col-span-12 text-umber md:col-span-3">
            {String(index).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} — {p.category}
          </p>
          <h1 className="display col-span-12 text-[clamp(3.6rem,11vw,12rem)] md:col-span-9">{p.title}</h1>
          <p className="col-span-12 max-w-xl text-lg leading-relaxed opacity-80 md:col-span-5 md:col-start-4">{p.summary}</p>
          <dl className="col-span-12 grid grid-cols-2 gap-6 md:col-span-4 md:col-start-9">
            {p.facts.map((f) => (
              <div key={f.label}>
                <dt className="eyebrow mb-1 opacity-60">{f.label}</dt>
                <dd className="text-sm">
                  {f.label === "Source" && p.source ? (
                    <a href={p.source} target="_blank" rel="noreferrer" className="link-draw">
                      {f.value}
                    </a>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      {/* Full-width artwork */}
      <ExpandFrame className="h-[110svh] md:h-[120vh]">
        <ProjectMedia project={p} sizes="100vw" priority />
      </ExpandFrame>

      {p.pending && (
        <p className="eyebrow px-gutter pt-6 opacity-60">
          Concept plate — the final render for this project is on its way.
        </p>
      )}

      <Stage n="01" label="Concept" title="Creative direction">
        <Reveal>
          <p className="display text-[clamp(1.8rem,3vw,3rem)] leading-[1.1] opacity-90">{p.concept}</p>
          <ul className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" aria-label="Material palette">
            {p.palette.map((c) => (
              <li key={c.hex}>
                <span className="block aspect-[3/4] w-full ring-1 ring-current/10 ring-inset" style={{ backgroundColor: c.hex }} />
                <span className="eyebrow mt-3 block">{c.name}</span>
                <span className="mt-1 block text-xs opacity-60">{c.hex}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Stage>

      <Stage n="02" label="Exploration" title="From drawing to render">
        <Reveal>
          <p className="mb-12 max-w-xl leading-relaxed opacity-80">{p.exploration}</p>
          <CompareSlider project={p} />
        </Reveal>
      </Stage>

      <Stage n="03" label="Application" title="Light, texture, detail">
        <p className="mb-14 max-w-xl leading-relaxed opacity-80">{p.application}</p>
        {p.details.length > 0 ? (
          <div className="grid grid-cols-6 gap-4 md:gap-6">
            {p.details.map((d, i) => (
              <Parallax
                key={d.src}
                speed={i % 2 ? -0.15 : 0.2}
                className={["col-span-4 md:col-span-3", "col-span-5 col-start-2 md:col-span-3 md:col-start-4", "col-span-4 col-start-3 md:col-span-3 md:col-start-2", "col-span-4 md:col-span-2 md:col-start-5"][i % 4]}
              >
                <Mask className="relative" from={i % 2 ? "left" : "bottom"}>
                  <Image src={d.src} alt={d.alt} width={d.width} height={d.height} sizes="(max-width: 768px) 90vw, 50vw" className="h-auto w-full" />
                </Mask>
              </Parallax>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4 md:gap-6">
            <Mask className="col-span-4 aspect-[3/4]">
              <ProjectMedia project={p} sizes="50vw" />
            </Mask>
            <Mask className="col-span-6 aspect-[16/9] md:col-span-4 md:col-start-3" from="left">
              <ProjectMedia project={p} variant="line" sizes="60vw" />
            </Mask>
          </div>
        )}
      </Stage>

      {/* Next project */}
      <section data-tone="walnut" aria-label="Next project" className="px-gutter py-28 md:py-40">
        <Link href={`/work/${next.slug}`} className="group grid grid-cols-12 items-end gap-x-4 gap-y-10" data-cursor="Next">
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow mb-6 text-sand">Next project</p>
            <p className="display text-[clamp(3.2rem,9vw,10rem)] transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-6">
              {next.title}
            </p>
            <p className="eyebrow mt-6 opacity-60">{next.category}</p>
          </div>
          <div className="col-span-8 aspect-[4/5] overflow-hidden md:col-span-4 md:col-start-9">
            <div className="h-full w-full transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-105">
              <ProjectMedia project={next} sizes="(max-width: 768px) 66vw, 33vw" />
            </div>
          </div>
        </Link>
      </section>
    </article>
  );
}
