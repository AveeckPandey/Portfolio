import type { PortfolioData } from "@/lib/types";

const softwareData: PortfolioData = {
  identity: {
    title: "Software & AI Engineer",
    shortTitle: "Software & AI",
    metaTitle: "Aveeck Pandey — Software & AI Engineer",
    metaDescription:
      "Software & AI engineer specializing in full-stack development, backend systems, cloud infrastructure, RAG pipelines, AI agents, and production AI/ML systems. Building reliable, scalable applications and intelligent products.",
  },
  hero: {
    greeting: "Hello, I'm",
    name: "Aveeck Pandey",
    title: "Software & AI Engineer · Building Scalable Products",
    subtitle:
      "I build robust, scalable software AND production AI systems — from backend services, APIs, and cloud infrastructure to RAG pipelines, intelligent agents, and LLM-powered applications. Focused on clean architecture, reliability, and real-world impact.",
    cta: "View Projects",
    ctaHref: "#projects",
  },
  expertise: [
    {
      title: "Backend Systems",
      description:
        "Designing and shipping server-side systems that hold up under real production load — REST and GraphQL APIs, microservices, event-driven pipelines, async workers, and the boring middleware glue (auth, rate limiting, retries, idempotency) that keeps the rest of the stack reliable. I care about clear service boundaries, observable failure modes, and contracts that don't leak when teams move fast.",
    },
    {
      title: "Frontend Engineering",
      description:
        "Building responsive, accessible, and fast user interfaces with modern frameworks. I think carefully about component composition, state placement, render boundaries, and the loading/empty/error states real users hit. Performance budgets, semantic markup, keyboard navigation, and design-system consistency are part of the work — not a polish step at the end.",
    },
    {
      title: "App Development",
      description:
        "Taking a product from idea to shipped application across web, iOS, and Android. That covers UX flows, navigation patterns, offline-first storage, auth, push notifications, deep linking, app store submission, signed releases, OTA updates, telemetry, and the post-launch iteration loop. I build with a single codebase where it makes sense and reach for native only when the platform asks for it.",
    },
    {
      title: "Cloud & Infrastructure",
      description:
        "Running production workloads on AWS and similar platforms with infrastructure-as-code (Terraform), containerization, Kubernetes, and CI/CD pipelines that actually deploy on green. I set up observability — structured logs, metrics, traces, and alerts — so the team finds out about incidents from a pager, not a customer. Cost, security groups, IAM, and secret rotation come along for the ride.",
    },
    {
      title: "Database Design",
      description:
        "Modeling schemas for the queries the product actually needs — relational modeling for transactional workloads, document stores for flexible product data, key-value and cache layers for hot paths, and vector stores for semantic retrieval. I think about indexes, query plans, migrations, backfills, and consistency boundaries up front so performance and correctness don't become rewrite projects later.",
    },
    {
      title: "LLM & GenAI Applications",
      description:
        "Building production applications powered by large language models — intelligent search, document Q&A, summarization, conversational interfaces, and content generation. I focus on prompt and tool design, structured outputs, streaming UX, token-cost control, latency budgets, and the caching/retrieval patterns that make LLM features feel snappy instead of magical-and-flaky.",
    },
    {
      title: "AI Agents & Orchestration",
      description:
        "Designing autonomous agents that plan, call tools, and recover when something goes wrong — including tool schemas, memory layers, multi-step reasoning loops, and human-in-the-loop checkpoints. I build the orchestration framework around the agent: retry policy, timeouts, state persistence, traces, and cost ceilings, so the system stays observable and bounded even when the model misbehaves.",
    },
    {
      title: "Voice & Speech AI",
      description:
        "Building voice-driven interfaces with real-time speech-to-text, text-to-speech, and conversational turn-taking. That includes streaming audio pipelines, VAD (voice activity detection), interruption handling, barge-in, and the latency tuning that makes a voice agent feel like a conversation instead of a form fill. Accessibility and noisy-environment robustness are first-class concerns.",
    },
    {
      title: "AI Evaluation & Safety",
      description:
        "Designing the evaluation harness around an LLM or agent system — offline regression suites, online sampling, faithfulness and hallucination checks, refusal and policy tests, red-team prompts, and guardrails at the model and application layers. I treat evals as a first-class CI signal, not a one-off benchmark, so behavior regressions get caught before users do.",
    },
  ],
  projects: [
    {
      title: "CloudDeploy Platform",
      description:
        "A deployment platform that automates the build, test, and deploy pipeline for containerized applications. Supports blue-green deployments, rollback, and real-time monitoring.",
      category: "Infrastructure",
      technologies: ["Node.js", "Docker", "Kubernetes", "PostgreSQL", "Redis", "GitHub Actions"],
      metrics: ["500+ deployments/month", "99.9% uptime", "< 3min average deploy time"],
      featured: true,
    },
    {
      title: "API Gateway Service",
      description:
        "A high-performance API gateway handling request routing, authentication, rate limiting, and load balancing for a microservices architecture serving 10k+ RPM.",
      category: "Backend",
      technologies: ["Go", "gRPC", "Redis", "Prometheus", "Envoy"],
      metrics: ["10k+ RPM", "p99 < 15ms", "99.95% availability"],
      featured: true,
    },
    {
      title: "Real-time Analytics Dashboard",
      description:
        "A full-stack analytics dashboard with real-time data streaming, interactive visualizations, and customizable reporting for monitoring business metrics.",
      category: "Full-Stack",
      technologies: ["React", "TypeScript", "WebSocket", "Node.js", "ClickHouse", "D3.js"],
      metrics: ["Real-time streaming", "Sub-second latency", "50+ chart types"],
      featured: true,
    },
    {
      title: "Distributed Task Queue",
      description:
        "A fault-tolerant distributed task queue with priority scheduling, retry logic, dead-letter handling, and a web UI for monitoring job status.",
      category: "Backend",
      technologies: ["Python", "RabbitMQ", "PostgreSQL", "Docker", "FastAPI"],
      metrics: ["1M+ tasks/day", "Auto-recovery", "Priority scheduling"],
    },
    {
      title: "CLI Dev Toolkit",
      description:
        "A collection of command-line utilities for project scaffolding, code generation, database migrations, and development environment management.",
      category: "Developer Tools",
      technologies: ["Rust", "clap", "serde", "tokio"],
      metrics: ["15+ commands", "Cross-platform", "< 5ms startup"],
    },
    {
      title: "E-Commerce Backend",
      description:
        "A scalable e-commerce backend with inventory management, payment processing, order fulfillment, and an admin API for managing storefront operations.",
      category: "Backend",
      technologies: ["Node.js", "Express", "Stripe", "MongoDB", "Redis", "AWS S3"],
      metrics: ["1000+ products", "PCI compliant", "Webhook integrations"],
    },
  ],
  experience: [
    {
      role: "Contractor, Junior Full-Stack Developer",
      company: "Roster",
      period: "2026 Jun — 2026 Jul",
      description:
        "Worked as a Contractor at Roster, contributing to full-stack feature development across the stack.",
      highlights: [
        "Redesigned whole-business dashboards covering revenue, acquisition, cumulative, and other company KPIs from the ground up",
        "Automated LinkedIn posting end-to-end using n8n workflows",
        "Built a support inbox that classifies incoming mail by intent  tech, business, support  and routes notifications to the assigned owner",
        "Improved and rewrote queries across the product, cutting load and sharpening the data behind the dashboards",
        "Fixed production backend bugs as they surfaced, keeping the platform stable for users",
      ],
    },
    {
      role: "Working in Technical domain and Volunteering",
      company: "Rise against Hunger",
      period: "2024 May — 2024 Jun",
      description:
        "Contributed in a technical capacity while volunteering with Rise against Hunger  supporting operations, working on technical tasks, and participating in the organization's mission to end hunger.",
      highlights: [
        "Built an inventory system in React Native, with Firebase Auth for sign-in and Cloud Firestore as the live inventory store",
        "Contributed to technical work in support of organizational operations",
        "Collaborated with a multidisciplinary team on time-bound initiatives",
        "Participated in volunteer-driven activities aligned with the mission of ending hunger",
      ],
    },
    {
      role: "Software Engineer",
      company: "Your Company",
      period: "2026 - until my growth is stagnated",
      description:
        "Building and maintaining backend services and APIs for a high-traffic SaaS platform. Working on system architecture, performance optimization, and developer tooling.",
      highlights: [
        "Designed and implemented a new API versioning strategy reducing breaking changes by 80%",
        "Built internal developer tools that improved deployment frequency by 3x",
        "Led migration of legacy services to containerized microservices architecture",
        "Implemented comprehensive monitoring reducing mean time to detection by 60%",
        "Shipped frontend work alongside backend changes, collaborating with the product team to deliver business-facing features end to end",
        "Partnered with the business side to translate requirements into technical designs that move product and revenue metrics",
      ],
    },
  ],
  skills: [
    {
      name: "Languages",
      skills: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "HTML/CSS"],
    },
    {
      name: "Frontend",
      skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "WebSocket"],
    },
    {
      name: "Backend",
      skills: ["Node.js", "Express", "FastAPI", "Go", "REST APIs", "GraphQL", "gRPC"],
    },
    {
      name: "Databases",
      skills: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Qdrant",
        "RDS",
        "Amazon DynamoDB",
        "Amazon Aurora",
        "Amazon ElastiCache",
      ],
    },
    {
      name: "Infrastructure",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Nginx"],
    },
    {
      name: "Tools & Practices",
      skills: ["Git", "CI/CD", "Monitoring", "Testing", "System Design", "Code Review", "Sentry"],
    },
  ],
};

export default softwareData;
