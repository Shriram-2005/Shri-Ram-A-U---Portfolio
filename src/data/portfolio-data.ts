import { Project, Experience, SkillCategory, Education, SocialLink } from "@/types/portfolio";

export const personalInfo = {
  name: "Shri Ram A U",
  preferredName: "Shri Ram",
  role: "Full-Stack Software Engineer & Systems Architect",
  tagline: "Crafting resilient distributed systems, high-performance web architectures, and intuitive digital experiences.",
  shortBio:
    "I am a software engineer focused on building robust, scalable web applications and distributed architectures. Passionate about clean code, performance optimization, and elegant user-centric design.",
  location: "India (IST, UTC+5:30)",
  availability: "Available for full-time roles & high-impact projects",
  email: "shriram2005au@gmail.com",
  github: "https://github.com/shriramau",
  linkedin: "https://www.linkedin.com/in/shriramau",
  twitter: "https://x.com/shriramau",
  resumeUrl: "/resume.pdf",
  stats: [
    { label: "Production Deployments", value: "25+" },
    { label: "Uptime Architecture", value: "99.98%" },
    { label: "Git Commits & PRs", value: "850+" },
    { label: "Performance Boost", value: "~45%" },
  ],
};

export const featuredProjects: Project[] = [
  {
    id: "nexus-flow",
    title: "NexusFlow",
    tagline: "Distributed Event Orchestration & Workflow Engine",
    description:
      "A high-throughput distributed workflow orchestration engine designed to manage asynchronous microservices, state machines, and real-time event streaming with deterministic replayability.",
    category: "Systems",
    featured: true,
    metrics: [
      { label: "Throughput", value: "25k req/s" },
      { label: "p99 Latency", value: "< 14ms" },
      { label: "Reliability", value: "99.99%" },
    ],
    tags: ["Go", "Next.js", "gRPC", "Redis", "Kafka", "Docker", "Tailwind CSS"],
    githubUrl: "https://github.com/shriramau/nexus-flow",
    liveUrl: "https://nexusflow.dev",
    highlights: [
      "Engineered a distributed leader election mechanism using Raft consensus for fault-tolerant state recovery.",
      "Built a real-time visual canvas dashboard in Next.js & WebSockets to monitor DAG execution paths.",
      "Optimized payload serialization with Protocol Buffers, cutting network overhead by 38%.",
    ],
  },
  {
    id: "prism-ai",
    title: "PrismAI",
    tagline: "Autonomous Code Intelligence & Automated Review Agent",
    description:
      "An intelligent developer tool that hooks into Git webhooks to perform deep static analysis, detect architectural antipatterns, generate unit tests, and provide contextual pull request summaries.",
    category: "AI & ML",
    featured: true,
    metrics: [
      { label: "Review Speed", value: "3.2x faster" },
      { label: "Test Coverage", value: "+28% avg" },
      { label: "PRs Analyzed", value: "1,200+" },
    ],
    tags: ["TypeScript", "Next.js", "Python", "FastAPI", "OpenAI / Claude API", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/shriramau/prism-ai",
    liveUrl: "https://prismai.dev",
    highlights: [
      "Integrated tree-sitter AST parsing with LLM context framing to eliminate AI hallucinations in code reviews.",
      "Designed an interactive diff inspection UI with inline commenting and one-click code patch application.",
      "Configured fine-grained caching to lower LLM token consumption by 52% across recurring file revisions.",
    ],
  },
  {
    id: "omni-cache",
    title: "OmniCache",
    tagline: "In-Memory Key-Value Store with Write-Through Durability",
    description:
      "A lightweight, concurrent in-memory caching system inspired by Redis, featuring LRU eviction policies, append-only file persistence, and concurrent lock-striping for ultra-low latency.",
    category: "Systems",
    featured: true,
    metrics: [
      { label: "Read Latency", value: "0.8ms" },
      { label: "Memory Footprint", value: "-30%" },
      { label: "Concurrency", value: "Lock-Free" },
    ],
    tags: ["Rust", "TypeScript", "React", "WebAssembly", "Docker"],
    githubUrl: "https://github.com/shriramau/omni-cache",
    liveUrl: "https://omnicache.dev",
    highlights: [
      "Implemented custom lock-free skip-lists and bloom filters to accelerate key lookups under heavy concurrency.",
      "Compiled core telemetry modules to WebAssembly for client-side zero-overhead performance profiling.",
      "Created an interactive browser-based memory debugger showcasing memory defragmentation in real time.",
    ],
  },
  {
    id: "dev-pulse",
    title: "DevPulse",
    tagline: "Cloud Native Telemetry & Service Health Dashboard",
    description:
      "A full-stack observability platform aggregating metrics, distributed traces, and log streams into an actionable real-time command center with intelligent anomaly alert routing.",
    category: "Full-Stack",
    featured: true,
    metrics: [
      { label: "Event Ingestion", value: "50k/min" },
      { label: "Query Time", value: "< 25ms" },
      { label: "Cost Savings", value: "40%" },
    ],
    tags: ["Next.js", "React 19", "Tailwind CSS", "ClickHouse", "Go", "Framer Motion", "Prometheus"],
    githubUrl: "https://github.com/shriramau/dev-pulse",
    liveUrl: "https://devpulse.io",
    highlights: [
      "Developed high-density interactive charting using SVG & Canvas with 60fps rendering during data bursts.",
      "Configured time-series aggregation pipelines over ClickHouse to achieve sub-second query latencies on terabyte scales.",
      "Architected role-based multi-tenant security with end-to-end audit logging.",
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Full-Stack Software Engineer",
    company: "Apex Tech Labs",
    location: "Bengaluru, India (Hybrid)",
    period: "2024 — Present",
    type: "Full-time",
    description:
      "Leading architecture and development of scalable cloud applications, design system implementations, and high-performance frontend interfaces.",
    achievements: [
      "Architected and migrated the primary client platform to Next.js App Router, cutting First Contentful Paint by 48%.",
      "Spearheaded the unified design system component library adopted by 4 engineering teams, accelerating shipping velocity by 35%.",
      "Designed asynchronous event-driven queues handling 2M+ background tasks daily with zero dropped messages.",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Docker", "AWS"],
  },
  {
    id: "exp-2",
    role: "Software Engineering Intern",
    company: "Horizon Cloud Systems",
    location: "Remote",
    period: "2023 — 2024",
    type: "Internship",
    description:
      "Worked on core microservices, REST & GraphQL API infrastructure, and real-time telemetry dashboards for internal developer platforms.",
    achievements: [
      "Refactored relational database queries and introduced Redis caching layers, dropping 95th percentile latency from 320ms to 45ms.",
      "Constructed automated CI/CD pipelines with GitHub Actions, shrinking build verification cycles from 22 minutes to 6 minutes.",
      "Contributed bug fixes and documentation to internal open-source tooling, recognized as top engineering intern.",
    ],
    technologies: ["React", "TypeScript", "Python", "FastAPI", "Redis", "GitHub Actions", "Docker"],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Engineering",
    description: "Building responsive, accessible, and hyper-fluid web experiences",
    skills: [
      { name: "Next.js (App Router)", level: "Expert" },
      { name: "React 19 & Server Components", level: "Expert" },
      { name: "TypeScript", level: "Expert" },
      { name: "Tailwind CSS v4", level: "Expert" },
      { name: "Framer Motion & Animations", level: "Expert" },
      { name: "State Management (Zustand, TanStack)", level: "Proficient" },
      { name: "Web Performance (Core Web Vitals)", level: "Expert" },
      { name: "HTML5 / Accessibility (a11y)", level: "Expert" },
    ],
  },
  {
    title: "Backend & Systems",
    description: "Designing resilient APIs, distributed services, and data models",
    skills: [
      { name: "Node.js / Express", level: "Expert" },
      { name: "Go (Golang)", level: "Proficient" },
      { name: "Python / FastAPI", level: "Proficient" },
      { name: "REST & GraphQL APIs", level: "Expert" },
      { name: "gRPC & Protocol Buffers", level: "Proficient" },
      { name: "Microservices Architecture", level: "Proficient" },
      { name: "WebSockets & SSE", level: "Expert" },
    ],
  },
  {
    title: "Data & Storage",
    description: "Persistent storage, caching strategies, and event streaming",
    skills: [
      { name: "PostgreSQL", level: "Expert" },
      { name: "Redis & In-Memory Stores", level: "Expert" },
      { name: "Prisma & Drizzle ORM", level: "Expert" },
      { name: "MongoDB", level: "Proficient" },
      { name: "Kafka & Event Streams", level: "Proficient" },
      { name: "Vector Databases (Pinecone/pgvector)", level: "Proficient" },
    ],
  },
  {
    title: "DevOps & Cloud",
    description: "Containerization, automated deployment, and production reliability",
    skills: [
      { name: "Docker & Containerization", level: "Expert" },
      { name: "Git & GitHub Actions (CI/CD)", level: "Expert" },
      { name: "AWS (S3, EC2, Lambda, CloudFront)", level: "Proficient" },
      { name: "Vercel & Edge Networks", level: "Expert" },
      { name: "Linux / Bash Scripting", level: "Expert" },
      { name: "Nginx & Reverse Proxies", level: "Proficient" },
    ],
  },
];

export const education: Education[] = [
  {
    degree: "Bachelor of Technology in Computer Science & Engineering",
    institution: "Anna University Affiliated Engineering College",
    period: "2021 — 2025",
    location: "Tamil Nadu, India",
    highlights: [
      "Specialized in Distributed Systems, Data Structures & Algorithms, and Cloud Computing.",
      "Led the University Developer Student Club; organized 5+ hackathons with 300+ participants.",
      "Graduated with First Class Honors and completed capstone project in automated cloud observability.",
    ],
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/shriramau",
    handle: "@shriramau",
    icon: "Github",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/shriramau",
    handle: "/in/shriramau",
    icon: "Linkedin",
  },
  {
    name: "Twitter / X",
    url: "https://x.com/shriramau",
    handle: "@shriramau",
    icon: "Twitter",
  },
  {
    name: "Email",
    url: "mailto:shriram2005au@gmail.com",
    handle: "shriram2005au@gmail.com",
    icon: "Mail",
  },
];

