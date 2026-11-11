import type { Metadata } from "next";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Studio",
  description: `${site.manifesto} ${site.promise}`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="h-16" />
      <About standalone />
      <Services />
      <Contact />
    </>
  );
}
