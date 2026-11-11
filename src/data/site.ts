/**
 * Studio facts. Everything here is taken from the public Instagram profile
 * (@ira_.designs). Fields set to `null` are unknown — fill them in rather
 * than inventing values; the UI hides anything that is null.
 */
export const site = {
  name: "IRA Designs",
  handle: "@ira_.designs",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Turning ideas into visuals, and visuals into reality.",
  description:
    "IRA Designs is an interior design and 3D visualization studio. Photoreal renders that let you experience a space before a single brick is laid.",
  // From the studio's own caption on Instagram.
  manifesto:
    "A great design is not just about creating beautiful spaces — it's about visualizing every detail before it becomes reality.",
  promise:
    "To help clients experience their future space before a single brick is laid, ensuring confidence, clarity, and perfection in every decision.",
  instagram: "https://www.instagram.com/ira_.designs/",
  contactPerson: "Kreena Panchal",
  email: null as string | null, // TODO: confirm studio email
  phone: "+91 99250 03833" as string | null,
  whatsapp: "https://wa.me/919925003833" as string | null,
  location: null as string | null, // TODO: confirm city
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "Studio" },
  { href: "/#services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;
