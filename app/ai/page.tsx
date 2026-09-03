import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PortfolioPage from "@/components/PortfolioPage";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TearDivider from "@/components/TearDivider";
import StructuredData from "@/components/StructuredData";
import aiData from "@/content/ai";
import { aiTheme } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Aveeck Pandey — AI Engineer",
  description:
    "AI engineer specializing in LLM systems, RAG pipelines, AI agents, vector search, evaluation frameworks, and production AI infrastructure.",
  openGraph: {
    title: "Aveeck Pandey — AI Engineer",
    description:
      "AI engineer specializing in LLM systems, RAG pipelines, AI agents, vector search, evaluation frameworks, and production AI infrastructure.",
    type: "website",
    url: "/ai",
  },
  alternates: {
    canonical: "/ai",
  },
};

export default function AIPage() {
  const data = aiData;
  const theme = aiTheme;

  return (
    <>
    <StructuredData type="ai" />
    <PortfolioPage data={data} theme={theme}>
      <Navbar />
      <Hero hero={data.hero} crossLink={data.crossLink} />
      <About about={data.about} />
      <TearDivider />
      <Expertise expertise={data.expertise} title="AI Expertise" />
      <TearDivider />
      <Experience experience={data.experience} />
      <TearDivider />
      <Skills skills={data.skills} title="AI Skills" />
      <TearDivider />
      <Contact />
      <Footer />
    </PortfolioPage>
    </>
  );
}
