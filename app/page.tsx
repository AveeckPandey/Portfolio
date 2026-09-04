import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PortfolioPage from "@/components/PortfolioPage";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Experience from "@/components/Experience";
import ScrollShowcaseClient from "@/components/ScrollShowcaseClient";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TearDivider from "@/components/TearDivider";
import StructuredData from "@/components/StructuredData";
import softwareData from "@/content/software";

export const metadata: Metadata = {
  title: "Aveeck Pandey — Software Engineer",
  description:
    "Software engineer specializing in full-stack development, backend systems, cloud infrastructure, APIs, and production software. Building reliable, scalable applications.",
  openGraph: {
    title: "Aveeck Pandey — Software Engineer",
    description:
      "Software engineer specializing in full-stack development, backend systems, cloud infrastructure, APIs, and production software.",
    type: "website",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function SoftwarePage() {
  const data = softwareData;

  return (
    <>
    <StructuredData />
    <PortfolioPage>
      <Navbar />
      <Hero hero={data.hero} />
      <TearDivider />
      {/*
        The About component renders the interactive 3-paper stack
        (PaperStack). The Aristotle plate is embedded INSIDE that scene
        as a back layer behind the three papers, so it is physically
        present from the start and is revealed naturally as the user
        scrolls downward after the three papers fall. There is no
        separate <AristotleSection /> here anymore — that would split
        it into a different section rather than letting it act as the
        sheet physically underneath the stack.
      */}
      <About />
      <TearDivider />
      <Expertise expertise={data.expertise} title="Expertise" />
      <TearDivider />
      <ScrollShowcaseClient />
      <TearDivider />
      <Experience experience={data.experience} />
      <TearDivider />
      <Skills skills={data.skills} title="Skills" />
      <TearDivider />
      <Contact />
      <TearDivider />
      <Footer />
    </PortfolioPage>
    </>
  );
}
