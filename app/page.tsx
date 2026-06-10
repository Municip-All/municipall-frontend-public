import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Solution from "@/components/landing/Solution";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import CtaBanner from "@/components/landing/CtaBanner";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Solution />
        <Features />
        <Pricing />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
