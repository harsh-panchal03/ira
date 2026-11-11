import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${site.name} — interior design and photoreal 3D visualization. Message ${site.handle} on Instagram.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact standalone />;
}
