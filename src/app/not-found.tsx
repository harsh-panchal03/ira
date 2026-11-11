import Link from "next/link";

export default function NotFound() {
  return (
    <section data-tone="paper" className="flex min-h-svh flex-col justify-center px-gutter">
      <p className="eyebrow mb-6 text-umber">404</p>
      <h1 className="display text-[clamp(3rem,10vw,10rem)]">
        This room <em className="text-umber">isn’t drawn</em> yet.
      </h1>
      <Link href="/" className="eyebrow link-draw mt-12 self-start pb-1">
        Back to the studio →
      </Link>
    </section>
  );
}
