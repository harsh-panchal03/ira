import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import Nav from "@/components/navigation/Nav";
import Footer from "@/components/layout/Footer";
import Intro, { introGateScript } from "@/components/transitions/Intro";
import ToneController from "@/components/animations/ToneController";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Interior Design & 3D Visualization`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Interior Design & 3D Visualization`,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f1ece3",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  logo: `${site.url}/assets/logo/ira-monogram.svg`,
  sameAs: [site.instagram],
  telephone: site.phone ?? undefined,
  contactPoint: site.phone ? { "@type": "ContactPoint", telephone: site.phone, name: site.contactPerson, contactType: "customer service" } : undefined,
  knowsAbout: ["Interior Design", "3D Visualization", "Design Visualization"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGateScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain">
        <SmoothScroll>
          <Intro />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <ToneController />
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
