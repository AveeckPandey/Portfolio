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
    url: type === "ai" ? "https://aveeck.dev/ai" : "https://aveeck.dev/",
    sameAs: ["https://github.com/aveeck", "https://linkedin.com/in/aveeck"],
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
