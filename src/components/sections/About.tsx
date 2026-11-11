import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import RevealText from "@/components/animations/RevealText";
import Parallax from "@/components/animations/Parallax";
import Mask from "@/components/animations/Mask";

const living = projects[0];
const values = ["Materials", "Lighting", "Textures", "Proportions"];

export default function About({ standalone = false }: { standalone?: boolean }) {
  const [vase, , wall] = living.details;
  const Heading = standalone ? "h1" : "h2";
  return (
    <section id="studio" data-tone="travertine" aria-labelledby="studio-title" className="relative overflow-hidden pb-32 pt-36 md:pb-48 md:pt-48">
      <div className="grid grid-cols-12 gap-x-4 px-gutter">
        <div className="col-span-12 mb-14 flex items-baseline gap-6 md:col-span-3 md:mb-0">
          <p className="eyebrow text-umber">The Studio</p>
          <span className="hidden h-px flex-1 bg-current opacity-25 md:block" />
        </div>
        <div className="col-span-12 md:col-span-9">
          <Heading id="studio-title" className="sr-only">
            About {site.name}
          </Heading>
          <RevealText
            text={site.manifesto}
            emphasis={["visualizing", "reality"]}
            className="display text-[clamp(2.4rem,5.6vw,6.2rem)] leading-[0.98]"
          />
        </div>
      </div>

      {/* Asymmetric image composition */}
      <div className="relative mt-24 grid grid-cols-12 gap-x-4 px-gutter md:mt-36">
        <Parallax speed={0.35} className="col-span-7 md:col-span-4 md:col-start-2">
          <Mask className="aspect-[4/5]">
            <Image src={vase.src} alt={vase.alt} fill sizes="(max-width: 768px) 58vw, 33vw" className="object-cover" />
          </Mask>
          <p className="eyebrow mt-4 opacity-60">Detail — rattan & clay</p>
        </Parallax>

        <div className="col-span-12 mt-16 md:col-span-5 md:col-start-7 md:mt-48">
          <Parallax speed={-0.2}>
            <Mask className="aspect-[3/2]" from="left">
              <Image src={wall.src} alt={wall.alt} fill sizes="(max-width: 768px) 92vw, 42vw" className="object-cover" />
            </Mask>
          </Parallax>
          <div className="mt-12 max-w-md md:ml-[8%]">
            <p className="text-lg leading-relaxed opacity-80">{site.description}</p>
            <p className="mt-6 leading-relaxed opacity-70">{site.promise}</p>
            <Link href="/work" className="eyebrow link-draw mt-10 inline-block pb-1 text-umber" data-cursor="Work">
              See the work →
            </Link>
          </div>
        </div>
      </div>

      {/* The four things every render is built from */}
      <div className="mt-32 overflow-hidden border-y border-current/15 py-6 md:mt-44" aria-label={values.join(", ")}>
        <div className="flex w-max animate-[marquee_38s_linear_infinite] motion-reduce:animate-none" aria-hidden="true">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[...values, ...values].map((v, i) => (
                <span key={i} className="display flex items-center px-8 text-[clamp(2.4rem,6vw,6rem)] italic opacity-80">
                  {v}
                  <span className="ml-16 inline-block h-2 w-2 rotate-45 bg-umber" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
