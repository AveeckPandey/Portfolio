export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aveeck Pandey",
    jobTitle: "Software & AI Engineer",
    description:
      "Software & AI engineer specializing in full-stack development, backend systems, cloud infrastructure, RAG pipelines, AI agents, and production software.",
    url: "https://portfolio.buildwithaveeck.com/",
    sameAs: ["https://github.com/AveeckPandey", "https://linkedin.com/in/aveeck-pandey"],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Aveeck Pandey — Software Engineer",
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
