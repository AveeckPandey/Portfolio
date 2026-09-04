interface StructuredDataProps {
  type: "software" | "ai";
}

export default function StructuredData({ type }: StructuredDataProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aveeck Pandey",
    jobTitle: type === "ai" ? "AI Engineer" : "Software Engineer",
    description:
      type === "ai"
        ? "AI engineer specializing in LLM systems, RAG pipelines, AI agents, and production AI infrastructure."
        : "Software engineer specializing in full-stack development, backend systems, cloud infrastructure, and production software.",
    url: "https://portfolio.buildwithaveeck.com/",
    sameAs: ["https://github.com/AveeckPandey", "https://linkedin.com/in/aveeck-pandey"],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: type === "ai" ? "Aveeck Pandey — AI Engineer" : "Aveeck Pandey — Software Engineer",
    description: personSchema.description,
    url: personSchema.url,
    author: {
      "@type": "Person",
      name: "Aveeck Pandey",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([personSchema, webPageSchema]),
      }}
    />
  );
}
