import Link from "next/link";
import { nav, site } from "@/data/site";
import { buildYear } from "@/lib/year";

export default async function Footer() {
  const year = await buildYear();
  return (
    <footer className="bg-ink px-gutter pb-8 pt-16 text-paper/70">
      <div className="hairline mb-8" />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">© {year} {site.name}</p>
          {site.phone && (
            <p className="text-sm">
              {site.contactPerson} ·{" "}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-draw hover:text-paper">
                {site.phone}
              </a>
            </p>
          )}
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="eyebrow link-draw pb-1 hover:text-paper">
              {n.label}
            </Link>
          ))}
          <a href={site.instagram} target="_blank" rel="noreferrer" className="eyebrow link-draw pb-1 hover:text-paper">
            Instagram
          </a>
        </nav>
      </div>
    </footer>
  );
}
