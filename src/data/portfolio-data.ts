import { Project, Experience, SkillCategory, Education, Honor, SocialLink } from "@/types/portfolio";

export const personalInfo = {
  name: "Shri Ram A U",
  preferredName: "Shri Ram",
  role: "AI Solutions Developer & Software Engineer (Mobile, Next.js, Edge AI)",
  tagline: "Architecting on-device edge AI systems, multi-tenant cloud platforms, and production mobile & web applications.",
  shortBio:
    "7th-semester Computer Science undergraduate at Presidency University Bangalore and AI Solutions Developer Intern at Saina Human AI. Experienced in building mobile and web applications in Kotlin, Java, JavaScript, Python, and Dart, with deep backend focus on PostgreSQL (RLS), Supabase, and SQLite data design. Creator of Intent—an on-device edge-AI notification firewall operating at 3.68ms warm inference latency.",
  location: "Greater Bengaluru Area, India (IST, UTC+5:30)",
  phone: "+91 70196 13040",
  availability: "Open to 6-month engineering internships (Jan–Jun 2027) with PPO pathways",
  email: "shriram2005au@gmail.com",
  github: "https://github.com/Shriram-2005",
  linkedin: "https://www.linkedin.com/in/shriramau",
  twitter: "https://x.com/shriramau",
  resumeUrl: "/resume.pdf",
  stats: [
    { label: "Edge-AI Inference Latency", value: "3.68ms" },
    { label: "Presidency University CGPA", value: "8.20" },
    { label: "Project Exhibition Rank", value: "2nd / 50+" },
    { label: "PostgreSQL RLS Tables", value: "19 Tables" },
  ],
};

export const featuredProjects: Project[] = [
  {
    id: "intent-firewall",
    title: "Intent: Edge-AI Notification Firewall",
    tagline: "On-Device Offline Notification Firewall & Priority Engine",
    description:
      "Rebuilt from scratch for the Google Solutions Challenge: a native Android background service in Kotlin that classifies system notifications with an on-device LSTM model in TensorFlow Lite with zero cloud calls and no data transmission.",
    category: "Mobile & Edge AI",
    featured: true,
    metrics: [
      { label: "Warm Latency", value: "3.68ms" },
      { label: "Data Leaving Device", value: "0 bytes" },
      { label: "Exhibition Award", value: "2nd / 50+ Teams" },
    ],
    tags: ["Kotlin", "Flutter", "TensorFlow Lite", "LSTM", "SQLite", "Android SDK", "Edge AI"],
    githubUrl: "https://github.com/Shriram-2005/intent-attention-firewall",
    highlights: [
      "Deployed an on-device LSTM model via TensorFlow Lite, keeping all personal notifications and processing strictly local.",
      "Optimized memory allocation and SQLite queries to reach 3.68ms warm inference latency under Android 14 background execution limits.",
      "Implemented velocity-based driving detection to automatically hold back non-critical notifications while traveling.",
      "Secured 2nd place solo against 50+ multi-member teams at Presidency University, with industry judges from Aptiv commending its edge-AI system design.",
    ],
  },
  {
    id: "garment-erp",
    title: "Garment ERP: Multi-Tenant Manufacturing SaaS",
    tagline: "Production Apparel ERP with Row-Level Security & Gemini AI",
    description:
      "A multi-tenant manufacturing SaaS platform engineered for apparel production lines, featuring complete PostgreSQL row-level security (RLS) across 19 tables, security-definer isolation, and automated defect analysis.",
    category: "Full-Stack",
    featured: true,
    metrics: [
      { label: "Tenant Isolation", value: "19 RLS Tables" },
      { label: "RBAC Security", value: "3-Tier Session" },
      { label: "Defect Analysis", value: "Gemini API" },
    ],
    tags: ["Next.js", "Supabase", "PostgreSQL (RLS)", "Gemini API", "Tailwind CSS", "jsPDF"],
    githubUrl: "https://github.com/Shriram-2005/Garment_ERP",
    highlights: [
      "Built a multi-tenant manufacturing SaaS with PostgreSQL row-level security across 19 tables and security-definer functions to strictly isolate tenant data.",
      "Implemented 3-tier role-based access control with Next.js middleware session checks, blocking unauthorized routes and API access.",
      "Engineered an apparel manufacturing pipeline covering BOM, inventory thresholds, cutting, stitching, QA defect audits, and dispatch invoicing.",
      "Integrated the Gemini API to automate QA defect analysis and generate paginated audit PDFs via jsPDF with bulk CSV/Excel import.",
    ],
  },
  {
    id: "blockchain-verification",
    title: "Online Blockchain Certificate Generation & Validation",
    tagline: "Ethereum Sepolia Smart Contract & Anti-Tamper ELA Verification",
    description:
      "A decentralized academic credential issuance and verification ecosystem featuring Ethereum Sepolia smart contracts, Keccak-256 cryptographic hashing, and automated Error Level Analysis (ELA) for marksheet fraud detection.",
    category: "Blockchain & Web3",
    featured: true,
    metrics: [
      { label: "Smart Contract", value: "Sepolia Testnet" },
      { label: "Verification", value: "Instant On-Chain" },
      { label: "Tamper Detection", value: "ELA + OCR" },
    ],
    tags: ["Solidity", "Ethers.js", "Next.js", "Supabase", "Python", "Flask", "Ethereum"],
    githubUrl: "https://github.com/Shriram-2005/certchain-blockchain-verification",
    highlights: [
      "Deployed Solidity contract on Ethereum Sepolia testnet with issuer-only access control, Keccak-256 hashing, and an immutable on-chain audit trail.",
      "Engineered a Python/Flask service screening uploaded marksheets for tampering using Error Level Analysis (ELA), OCR grade cross-checks, and institution validation.",
      "Built a Next.js and Supabase verification portal with embedded QR code generation for one-scan authenticity checks.",
    ],
  },
  {
    id: "ielts-platform",
    title: "IELTS Ed-Tech Web Platform & Dynamic CMS",
    tagline: "Automated Speech Assessments & Interactive Video CMS",
    description:
      "A full-stack IELTS preparation platform featuring dynamic media delivery, speech-to-text automated evaluations, and a hidden instructor Content Management System.",
    category: "Web & Cloud",
    featured: true,
    metrics: [
      { label: "Audio Scoring", value: "Deepgram API" },
      { label: "Video Delivery", value: "Mux Streaming" },
      { label: "Payments", value: "Razorpay" },
    ],
    tags: ["Next.js", "Tailwind CSS", "Supabase", "Mux", "Deepgram API", "Razorpay"],
    highlights: [
      "Developed a responsive web frontend in Next.js and Tailwind CSS, backed by Supabase user authentication and role permissions.",
      "Integrated Mux for video streaming and Deepgram APIs for automated speech-to-text (STT) and text-to-speech (TTS) language assessments.",
      "Connected Razorpay payment gateways and architected a hidden admin CMS allowing instructors to manage mock tests and videos in real time without code updates.",
    ],
  },
  {
    id: "logistics-portal",
    title: "Logistics Billing & Fleet Operations Web Portal",
    tagline: "Cloud-Synced Invoicing & Fleet Expense Management",
    description:
      "A production web application built to digitize commercial transport logistics billing and replace manual Excel spreadsheets.",
    category: "Web & Cloud",
    featured: false,
    metrics: [
      { label: "Manual Work", value: "-60% Overhead" },
      { label: "Export", value: "Instant PDF" },
      { label: "Sync", value: "Real-Time Firebase" },
    ],
    tags: ["Next.js", "React", "Firebase Firestore", "Tailwind CSS", "PDF Export"],
    highlights: [
      "Developed an automated split-screen invoice generation interface with live document preview and instant PDF export.",
      "Integrated Firebase Authentication and cloud storage for secure bill creation and multi-device synchronization.",
      "Built operational tracking modules to log driver assignments, fleet diesel expenses, and client payment statuses.",
    ],
  },
  {
    id: "audio-streaming",
    title: "High-Bitrate Audio Streaming Client",
    tagline: "On-Device Decryption & Low-Bandwidth Personal Streaming",
    description:
      "A personal music streaming application built for uninterrupted high-bitrate playback, on-device audio stream decryption, and local bandwidth caching.",
    category: "Web & Cloud",
    featured: false,
    metrics: [
      { label: "Bitrate", value: "320 kbps High-Res" },
      { label: "Bandwidth Cache", value: "Adaptive Local" },
      { label: "Sessions", value: "Firebase Auth" },
    ],
    tags: ["JavaScript", "Firebase", "Web Audio API", "LocalStorage"],
    highlights: [
      "Implemented on-device audio stream decryption to maintain uninterrupted 320 kbps high-quality playback.",
      "Built an adaptive local data cache and bandwidth tracker to minimize repeat network consumption (~10 MB/track).",
      "Engineered offline download storage and manual playlist import/export tools with Firebase session management.",
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "AI Solutions Developer Intern",
    company: "Saina Human AI Pvt. Ltd.",
    location: "Kochi, Kerala, India (Remote)",
    period: "Oct 2026 — Present",
    type: "Internship",
    description:
      "Developing AI-powered solutions, automation pipelines, and production proofs-of-concept for internal and client-facing workflows.",
    achievements: [
      "Architected LLM routing workflows and Telegram webhooks integrating the Gemini API and Groq LPU for low-latency reasoning.",
      "Evaluated, prototyped, and deployed emerging AI models into production-ready proof-of-concept systems across cross-functional technical teams.",
      "Documented development work and supported delivery across technical, creative, and business stakeholders.",
    ],
    technologies: ["Gemini API", "Groq LPU", "Python", "LLM Routing", "Next.js", "Telegram Webhooks", "Automation"],
  },
];

export const honors: Honor[] = [
  {
    title: "2nd Place, Project Exhibition",
    event: "Presidency University",
    date: "Nov 2025",
    description:
      "Secured 2nd place for an earlier Intent prototype, built solo, against 50+ multi-member development teams. Industry judges from Aptiv commended its edge-AI system design.",
  },
];

export const education: Education[] = [
  {
    degree: "Bachelor of Technology in Computer Science and Engineering",
    institution: "Presidency University Bangalore",
    period: "Oct 2023 — May 2027 (Expected)",
    location: "Bangalore, India",
    grade: "CGPA: 8.20 (7th Semester)",
    highlights: [
      "Specialized in Mobile Systems, Edge AI, Distributed Data Design, and Object-Oriented Software Architecture.",
      "Secured 2nd place in Project Exhibition against 50+ multi-member teams for solo-built edge-AI notification firewall.",
      "Active builder in the Google Solutions Challenge 2026.",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    description: "Core programming languages for systems, mobile, and web",
    skills: [
      { name: "Java", level: "Expert" },
      { name: "Kotlin", level: "Expert" },
      { name: "Dart", level: "Expert" },
      { name: "JavaScript / TypeScript", level: "Expert" },
      { name: "Python", level: "Proficient" },
      { name: "Solidity", level: "Proficient" },
      { name: "C / C++", level: "Proficient" },
      { name: "SQL", level: "Expert" },
    ],
  },
  {
    title: "Frontend & Mobile",
    description: "Mobile applications, responsive frontends, and component architecture",
    skills: [
      { name: "Next.js (App Router)", level: "Expert" },
      { name: "React", level: "Expert" },
      { name: "Flutter", level: "Expert" },
      { name: "Android SDK (Native)", level: "Expert" },
      { name: "Tailwind CSS v4", level: "Expert" },
      { name: "Framer Motion", level: "Proficient" },
      { name: "Jetpack Compose", level: "Proficient" },
      { name: "HTML5 / CSS3", level: "Expert" },
    ],
  },
  {
    title: "Backend & Databases",
    description: "Database isolation, cloud backends, and API infrastructure",
    skills: [
      { name: "Supabase", level: "Expert" },
      { name: "PostgreSQL (Row-Level Security)", level: "Expert" },
      { name: "SQLite", level: "Expert" },
      { name: "Firebase Firestore", level: "Expert" },
      { name: "REST APIs", level: "Expert" },
      { name: "Flask / FastAPI", level: "Proficient" },
      { name: "Node.js", level: "Proficient" },
    ],
  },
  {
    title: "ML & Edge AI",
    description: "On-device models, neural inference, and LLM automation pipelines",
    skills: [
      { name: "TensorFlow Lite", level: "Expert" },
      { name: "LSTM On-Device Models", level: "Expert" },
      { name: "Gemini API", level: "Expert" },
      { name: "Groq LPU", level: "Proficient" },
      { name: "Edge AI Optimization", level: "Expert" },
      { name: "LLM Routing & Webhooks", level: "Proficient" },
    ],
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/Shriram-2005",
    handle: "@Shriram-2005",
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
