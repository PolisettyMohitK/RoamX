import Arrival from "@/components/intro/Arrival";
import Navbar from "@/components/sections/Navbar";
import DoorsHero from "@/components/sections/DoorsHero";
import ProblemLine from "@/components/sections/ProblemLine";
import WheelStage from "@/components/sections/WheelStage";
import Features from "@/components/sections/Features";
import Platform from "@/components/sections/Platform";
import Testimonials from "@/components/sections/Testimonials";
import Team from "@/components/sections/Team";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Arrival />
      <Navbar />
      <main>
        <DoorsHero />
        <ProblemLine />
        <WheelStage />
        <Features />
        <Platform />
        <Testimonials />
        <Team />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}
