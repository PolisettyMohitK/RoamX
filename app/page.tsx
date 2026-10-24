import Arrival from "@/components/intro/Arrival";
import Navbar from "@/components/sections/Navbar";
import DoorsHero from "@/components/sections/DoorsHero";
import Story from "@/components/sections/Story";
import Sell from "@/components/sections/Sell";
import BrandTicket from "@/components/sections/BrandTicket";
import Earn from "@/components/sections/Earn";
import Platform from "@/components/sections/Platform";
import Learn from "@/components/sections/Learn";
import Skills from "@/components/sections/Skills";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import ContactPill from "@/components/ui/ContactPill";

export default function Home() {
  return (
    <>
      <Arrival />
      <Navbar />
      <main>
        <DoorsHero />
        <Story />
        <Sell />
        <BrandTicket />
        <Earn />
        <Platform />
        <Learn />
        <Skills />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <ContactPill />
    </>
  );
}
