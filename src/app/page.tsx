import StoryHero from "@/components/hero/StoryHero";
import About from "@/components/sections/About";
import WorkRail from "@/components/portfolio/WorkRail";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <StoryHero />
      <About />
      <WorkRail />
      <Services />
      <Contact />
    </>
  );
}
