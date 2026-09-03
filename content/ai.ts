import type { PortfolioData, AIProject } from "@/lib/types";

const aiData: PortfolioData & { projects: AIProject[] } = {
  identity: {
    title: "AI Engineer",
    shortTitle: "AI",
    metaTitle: "Aveeck Pandey — AI Engineer",
    metaDescription:
      "AI engineer specializing in LLM systems, RAG pipelines, AI agents, vector search, evaluation frameworks, and production AI infrastructure.",
  },
  hero: {
    greeting: "Hello, I'm",
    name: "Aveeck Pandey",
    title: "AI Engineer",
    subtitle:
      "I build production AI systems — from RAG pipelines and intelligent agents to LLM evaluation frameworks and AI infrastructure. Focused on reliability, accuracy, and real-world impact.",
    cta: "View AI Projects",
    ctaHref: "#projects",
  },
  about: {
    heading: "About Me",
    paragraphs: [
      "I'm an AI engineer who builds systems that work reliably in production — not just demos. My focus is on the full lifecycle of AI applications: data preparation, retrieval, generation, evaluation, and monitoring.",
      "I specialize in RAG architectures, intelligent agents, and LLM-powered applications. I care about making AI systems that are accurate, auditable, and maintainable — not just impressive in a screenshot.",
      "I believe the hardest part of AI isn't the model — it's the engineering around it. Data quality, retrieval precision, evaluation rigor, and production observability are where real AI products succeed or fail.",
    ],
    highlights: [
      "RAG system architecture",
      "LLM application development",
      "AI agent design & orchestration",
      "Vector search & retrieval",
      "Production AI infrastructure",
    ],
  },
  expertise: [
    {
      title: "RAG Systems",
      description:
        "Building retrieval-augmented generation pipelines with precise chunking strategies, multi-stage retrieval, reranking, and context assembly for accurate, grounded generation.",
    },
    {
      title: "AI Agents & Orchestration",
      description:
        "Designing autonomous AI agents with tool use, planning, memory, and multi-step reasoning. Building orchestration frameworks that handle failures gracefully.",
    },
    {
      title: "LLM Application Development",
      description:
        "Developing applications powered by large language models — from intelligent search and document processing to conversational interfaces and content generation.",
    },
    {
      title: "Vector Search & Embeddings",
      description:
        "Implementing semantic search systems with embedding models, vector databases, hybrid search, and retrieval optimization for high-precision information retrieval.",
    },
    {
      title: "AI Evaluation & Quality",
      description:
        "Building evaluation frameworks for AI systems — automated metrics, human evaluation pipelines, A/B testing, and continuous quality monitoring for production LLM applications.",
    },
    {
      title: "AI Infrastructure",
      description:
        "Deploying and scaling AI systems with model serving, inference optimization, GPU resource management, cost monitoring, and observability for production AI workloads.",
    },
  ],
  projects: [
    {
      title: "Knowledge Retrieval Engine",
      description:
        "A RAG system with multi-stage retrieval, hybrid search, contextual reranking, and structured grounding. Processes documents across multiple formats with intelligent chunking and deduplication.",
      category: "RAG",
      technologies: ["Python", "LangChain", "Pinecone", "OpenAI", "FastAPI", "Redis"],
      model: "GPT-4 / Claude",
      retrieval: "Hybrid BM25 + semantic search with reranking",
      evaluation: "Custom RAGAS pipeline with faithfulness metrics",
      latency: "p95 < 800ms",
      architecture: "Multi-stage: chunk → retrieve → rerank → generate",
      metrics: ["87% retrieval precision", "92% answer accuracy", "10k+ documents indexed"],
      featured: true,
    },
    {
      title: "Autonomous Research Agent",
      description:
        "An AI agent that plans research tasks, uses web search and document tools, synthesizes findings, and produces structured reports with citations and confidence scoring.",
      category: "Agent",
      technologies: ["Python", "LangGraph", "Tavily", "OpenAI", "PostgreSQL", "Docker"],
      model: "GPT-4o",
      retrieval: "Web search + document retrieval with source verification",
      evaluation: "Citation accuracy + factual grounding assessment",
      latency: "5-30s per research task",
      architecture: "Plan → Execute → Reflect → Synthesize loop",
      metrics: ["94% citation accuracy", "Multi-tool orchestration", "Self-correcting"],
      featured: true,
    },
    {
      title: "AI Code Review Assistant",
      description:
        "An intelligent code review system that analyzes pull requests for bugs, security issues, performance problems, and style violations with context-aware suggestions.",
      category: "LLM Application",
      technologies: ["TypeScript", "OpenAI", "GitHub API", "AST parsing", "Redis"],
      model: "GPT-4o-mini",
      retrieval: "Codebase context with AST-aware chunking",
      evaluation: "Precision/recall on known bug patterns",
      latency: "p95 < 12s per PR",
      architecture: "Parse → Contextualize → Analyze → Suggest",
      metrics: ["89% suggestion acceptance rate", "40% fewer review cycles"],
      featured: true,
    },
    {
      title: "Semantic Document Search",
      description:
        "A document search system using embeddings for semantic retrieval across large document collections with faceted filtering, relevance feedback, and cross-lingual search.",
      category: "Vector Search",
      technologies: ["Python", "Weaviate", "sentence-transformers", "FastAPI", "React"],
      model: "all-MiniLM-L6-v2",
      retrieval: "Vector similarity + metadata filtering",
      evaluation: "NDCG@10 benchmarking",
      latency: "p95 < 200ms",
      architecture: "Embed → Index → Retrieve → Rank → Present",
      metrics: ["0.89 NDCG@10", "1M+ documents", "Cross-lingual support"],
    },
    {
      title: "LLM Evaluation Pipeline",
      description:
        "A comprehensive evaluation framework for LLM applications with automated metrics, regression testing, prompt versioning, and quality dashboards for production monitoring.",
      category: "AI Infrastructure",
      technologies: ["Python", "DeepEval", "LangSmith", "PostgreSQL", "Grafana", "Docker"],
      model: "Multiple (evaluation target)",
      retrieval: "N/A",
      evaluation: "Meta-evaluation with human calibration",
      latency: "Batch processing",
      architecture: "Test suite → Run → Score → Report → Alert",
      metrics: ["200+ test cases", "Automated regression detection", "Cost tracking"],
    },
    {
      title: "Conversational AI Platform",
      description:
        "A multi-turn conversational AI platform with memory, tool use, and context management. Supports custom personas, knowledge bases, and escalation to human agents.",
      category: "LLM Application",
      technologies: ["Python", "LangGraph", "Pinecone", "WebSocket", "React", "Redis"],
      model: "Claude 3.5 Sonnet",
      retrieval: "Conversation memory + knowledge base RAG",
      evaluation: "Turn-level quality scoring + user satisfaction",
      latency: "p95 < 2s per turn",
      architecture: "Memory → Retrieve → Reason → Act → Respond",
      metrics: ["85% resolution rate", "4.2/5 user satisfaction", "< 2s response time"],
    },
  ],
  experience: [
    {
      role: "AI Engineer",
      company: "AI Startup",
      period: "2023 — Present",
      description:
        "Building production AI systems including RAG pipelines, intelligent agents, and LLM-powered applications. Responsible for the full AI stack from data processing to deployment.",
      highlights: [
        "Designed and shipped a RAG system processing 10k+ documents with 87% retrieval precision",
        "Built an autonomous research agent reducing manual research time by 70%",
        "Implemented LLM evaluation framework catching regressions before production deployment",
        "Optimized inference pipeline reducing costs by 45% while maintaining quality",
      ],
    },
    {
      role: "Software Engineer (AI Focus)",
      company: "Tech Company",
      period: "2021 — 2023",
      description:
        "Developed AI-powered features within a larger software platform. Built the infrastructure connecting ML models to production applications.",
      highlights: [
        "Integrated LLM-powered search improving user task completion by 35%",
        "Built vector search infrastructure supporting semantic document retrieval",
        "Implemented A/B testing framework for ML feature evaluation",
        "Created monitoring dashboards for AI model performance and drift detection",
      ],
    },
    {
      role: "Junior Developer",
      company: "Digital Agency",
      period: "2019 — 2021",
      description:
        "Full-stack development with growing interest in machine learning and AI applications. Built data processing pipelines and early NLP features.",
      highlights: [
        "Built text processing pipelines for content classification",
        "Developed data extraction tools using NLP techniques",
        "Introduced ML-based features to client projects",
      ],
    },
  ],
  skills: [
    {
      name: "LLMs & Models",
      skills: ["GPT-4", "Claude", "Llama", "Gemini", "OpenAI API", "Anthropic API"],
    },
    {
      name: "RAG & Retrieval",
      skills: ["LangChain", "LlamaIndex", "Pinecone", "Weaviate", "ChromaDB", "Reranking"],
    },
    {
      name: "AI Frameworks",
      skills: ["LangGraph", "LangSmith", "DeepEval", "Haystack", "Semantic Kernel"],
    },
    {
      name: "Embeddings & Search",
      skills: ["sentence-transformers", "OpenAI Embeddings", "Hybrid Search", "BM25"],
    },
    {
      name: "Infrastructure",
      skills: ["Python", "FastAPI", "Docker", "Redis", "PostgreSQL", "AWS Bedrock"],
    },
    {
      name: "Evaluation & Monitoring",
      skills: ["RAGAS", "DeepEval", "A/B Testing", "Grafana", "LangSmith Tracing"],
    },
  ],
  crossLink: {
    label: "Explore my Software Engineering work",
    href: "/",
  },
};

export default aiData;
