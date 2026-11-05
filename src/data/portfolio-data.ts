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
  resumeReleaseUrl:
    "https://github.com/Shriram-2005/Shri-Ram-A-U---Portfolio/releases/download/v1.0.1/Shri.Ram.A.U.-.Resume.pdf",
  stats: [
    { label: "Edge-AI Inference Latency", value: "3.68ms" },
    { label: "Presidency University CGPA", value: "8.20" },
    { label: "Project Exhibition Rank", value: "2nd / 50+" },
    { label: "PostgreSQL RLS Tables", value: "19 Tables" },
  ],
};

export const featuredProjects: Project[] = [
  {
    id: "garment-erp",
    title: "Garment ERP: Multi-Tenant Manufacturing SaaS",
    tagline: "Production Apparel ERP with Row-Level Security & Gemini AI",
    description:
      "A production multi-tenant manufacturing SaaS platform engineered for apparel lines, featuring complete PostgreSQL row-level security across 19 tables, security-definer isolation, and automated Gemini defect analysis.",
    category: "Full-Stack",
    featured: true,
    metrics: [
      { label: "Tenant Isolation", value: "19 RLS Tables" },
      { label: "RBAC Security", value: "3-Tier Session" },
      { label: "Defect Analysis", value: "Gemini API" },
    ],
    tags: ["Next.js", "Supabase", "PostgreSQL (RLS)", "Gemini API", "Tailwind CSS", "jsPDF"],
    liveUrl: "https://garment-erp-one.vercel.app/",
    githubUrl: "https://github.com/Shriram-2005/Garment_ERP",
    badge: "Live Web App",
    highlights: [
      "Built a multi-tenant manufacturing SaaS with PostgreSQL row-level security across 19 tables and security-definer functions to strictly isolate tenant data.",
      "Implemented 3-tier role-based access control with Next.js middleware session checks, blocking unauthorized routes and API access.",
      "Engineered an apparel manufacturing pipeline covering BOM, inventory thresholds, cutting, stitching, QA defect audits, and dispatch invoicing.",
      "Integrated the Gemini API to automate QA defect analysis and generate paginated audit PDFs via jsPDF with bulk CSV/Excel import.",
    ],
    architecture: {
      ownership: "Full-Stack Lead & Data Architect — Designed complete multi-tenant schema, 19 RLS policies, Next.js server actions, and Gemini defect pipeline.",
      problem: "Preventing cross-tenant data leakage across 19 production manufacturing tables while maintaining sub-100ms dashboard queries.",
      solution: "Engineered Supabase PostgreSQL Row-Level Security (RLS) linked to JWT user claims, supplemented by SECURITY DEFINER stored procedures for complex inventory ledger rollups.",
      securityOrPerformance: {
        title: "RLS Enforcement & Multi-Tenant Isolation",
        points: [
          "JWT Tenant Binding: Decoded tenant ID directly from auth.jwt() -> app_metadata -> organization_id on every SQL execution.",
          "FORCE ROW LEVEL SECURITY applied across all 19 tables, guaranteeing that even table owners cannot bypass policies in production.",
          "SECURITY DEFINER Functions: Encapsulated complex cross-table inventory deductions with explicit 'SET search_path = public' to eliminate search-path injection vulnerabilities.",
          "Role-Based Access Control: 3-tier authorization (Admin, Manager, QA Auditor) validated at both Next.js Edge Middleware and Postgres database layers.",
        ],
      },
      failureModesAndAuth: "Next.js Edge Middleware validates signed Supabase JWTs before page render. Network mutations feature optimistic rollbacks, and file uploads use short-lived (15-min) signed S3 URLs.",
      testingAndVerification: "Tested via automated tenant penetration scripts simulating cross-tenant query injection (User A querying Tenant B IDs yielding 0 rows). Integrated GitHub Actions CI with Next.js build validation.",
      keyDecisions: [
        {
          question: "How do you prevent cross-tenant data leakage?",
          answer: "By enforcing Row-Level Security at the Postgres engine level rather than relying on application-level WHERE clauses. Every SELECT, INSERT, UPDATE, and DELETE query must satisfy (organization_id = auth.jwt() ->> 'organization_id'), verified by synthetic cross-tenant injection test suites.",
        },
        {
          question: "Why use SECURITY DEFINER functions?",
          answer: "For operations touching multiple tables with varying permissions (like converting cutting bundles to finished inventory), SECURITY DEFINER functions execute with controlled elevated privileges while enforcing parameter validation and fixed search paths.",
        },
      ],
    },
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
    liveUrl: "https://certchain-blockchain-verification.vercel.app/",
    githubUrl: "https://github.com/Shriram-2005/certchain-blockchain-verification",
    badge: "Live Web3 App",
    highlights: [
      "Deployed Solidity contract on Ethereum Sepolia testnet with issuer-only access control, Keccak-256 hashing, and an immutable on-chain audit trail.",
      "Engineered a Python/Flask service screening uploaded marksheets for tampering using Error Level Analysis (ELA), OCR grade cross-checks, and institution validation.",
      "Built a Next.js and Supabase verification portal with embedded QR code generation for one-scan authenticity checks.",
    ],
    architecture: {
      ownership: "Sole Web3 & Smart Contract Developer — Authored Solidity contract, deployed to Ethereum Sepolia, built Next.js dApp and Python ELA verification API.",
      problem: "Eliminating fraudulent academic credentials and detecting both on-chain counterfeits and off-chain digital document tampering.",
      solution: "Dual-layer verification combining Ethereum Sepolia immutable smart contract registries with a Python computer vision microservice running Error Level Analysis (ELA).",
      securityOrPerformance: {
        title: "Cryptographic Integrity & ELA Anti-Tampering",
        points: [
          "Keccak-256 Hash Anchoring: Only salted cryptographic hashes of academic records are committed on-chain, preserving student PII privacy while guaranteeing tamper detection.",
          "Gas Optimization: Packed storage variables and tightly sized byte structs reduced issuance gas consumption by ~28% per transaction.",
          "Error Level Analysis (ELA): Python/Flask service scans uploaded marksheet image compression levels to highlight modified grades or forged institutional stamps.",
          "Non-Repudiation: Contract restricts certificate minting strictly to verified institutional signer addresses using OpenZeppelin AccessControl.",
        ],
      },
      failureModesAndAuth: "Web3 wallet connection handles RPC timeouts with automatic Infura/Alchemy failover fallbacks. Contract transactions feature gas estimate buffers and explicit revert reason strings.",
      testingAndVerification: "Full Hardhat unit test suite testing issuance, verification, revocation, and re-entrancy attack scenarios. Verified contract source published on Sepolia Etherscan with 100% test pass rate.",
      keyDecisions: [
        {
          question: "How did you test your blockchain certificate verification system?",
          answer: "Used Hardhat for local EVM fork simulation and unit tests covering unauthorized issuance reverts, invalid hash queries, and certificate revocation. Verified on Sepolia testnet with live MetaMask transaction signing.",
        },
        {
          question: "Why store hashes on-chain instead of complete documents?",
          answer: "Storing full documents or images on-chain is cost-prohibitive and violates privacy laws (GDPR/FERPA). Keccak-256 hashes cost ~45,000 gas to record and allow instantaneous mathematical verification of any document off-chain.",
        },
      ],
    },
  },
  {
    id: "ielts-platform",
    title: "Intellify IELTS: Ed-Tech Web Platform & Dynamic CMS",
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
    liveUrl: "https://intellify-prototype.vercel.app/",
    badge: "Live Web App",
    highlights: [
      "Developed a responsive web frontend in Next.js and Tailwind CSS, backed by Supabase user authentication and role permissions.",
      "Integrated Mux for video streaming and Deepgram APIs for automated speech-to-text (STT) and text-to-speech (TTS) language assessments.",
      "Connected Razorpay payment gateways and architected a hidden admin CMS allowing instructors to manage mock tests and videos in real time without code updates.",
    ],
    architecture: {
      ownership: "Full-Stack Engineer — Built responsive Next.js frontend, hidden instructor CMS, Supabase role authentication, and Deepgram/Mux streaming integrations.",
      problem: "Delivering real-time phoneme-level speech assessment and protected video streaming without server bandwidth saturation.",
      solution: "Engineered chunked audio streaming to Deepgram's automated speech evaluation API and delegated heavy media delivery to Mux signed playback URLs.",
      securityOrPerformance: {
        title: "Audio Streaming & Media Pipeline",
        points: [
          "Low-Latency Speech Evaluation: Implemented MediaRecorder chunking to pipe user speech directly to Deepgram STT WebSocket endpoints.",
          "Protected Video Delivery: Mux signed playback tokens generated on protected server routes with 2-hour expiration, preventing video URL scraping.",
          "Hidden Admin CMS: Gated by Supabase JWT custom claims (role = instructor) with PostgreSQL RLS isolating instructor mock test authoring tools.",
          "Webhooks Integration: Async webhook handlers capture Razorpay payment completion to trigger instant student enrollment.",
        ],
      },
      failureModesAndAuth: "Automatic fallback from WebSocket audio streaming to chunked multipart POST retry with exponential backoff on intermittent network connections. Session refresh managed via Supabase HttpOnly cookies.",
      testingAndVerification: "Jest unit tests for speech score aggregation algorithms and mock payment verification handlers.",
      keyDecisions: [
        {
          question: "How do you handle API failures during live audio assessment?",
          answer: "The client records local audio buffers concurrently in indexedDB. If the real-time Deepgram WebSocket drops, the client automatically falls back to an async REST batch submission without forcing the user to re-record.",
        },
      ],
    },
  },
  {
    id: "logistics-portal",
    title: "AUS Transport: Logistics Billing & Fleet Operations Web Portal",
    tagline: "Cloud-Synced Invoicing & Fleet Expense Management",
    description:
      "A production web application built to digitize commercial transport logistics billing and replace manual Excel spreadsheets with live document preview and instant PDF export.",
    category: "Web & Cloud",
    featured: true,
    metrics: [
      { label: "Manual Work", value: "-60% Overhead" },
      { label: "Export", value: "Instant PDF" },
      { label: "Sync", value: "Real-Time Firebase" },
    ],
    tags: ["Next.js", "React", "Firebase Firestore", "Tailwind CSS", "PDF Export"],
    liveUrl: "https://aus-transport-website.vercel.app/",
    badge: "Live Web App",
    highlights: [
      "Developed an automated split-screen invoice generation interface with live document preview and instant PDF export.",
      "Integrated Firebase Authentication and cloud storage for secure bill creation and multi-device synchronization.",
      "Built operational tracking modules to log driver assignments, fleet diesel expenses, and client payment statuses.",
    ],
    architecture: {
      ownership: "Lead Systems & Frontend Developer — Replaced error-prone manual paper/Excel invoicing for commercial fleet operations with automated digital billing.",
      problem: "Eliminating billing calculation errors and manual dispatch overhead across multi-device fleet operations with real-time sync.",
      solution: "Constructed a split-screen live invoice generator with reactive state preview, integer arithmetic for currency precision, and Firestore offline synchronization.",
      securityOrPerformance: {
        title: "Data Integrity & Real-Time Sync",
        points: [
          "Zero Rounding Error Math: Handled all monetary arithmetic in integer paise/cents to avoid floating-point calculation discrepancies on heavy fleet billing.",
          "Offline-First Operation: Leveraged Firestore offline persistence so dispatchers can draft bills at remote loading docks with automatic sync upon reconnect.",
          "Real-Time Document Preview: React state bindings synchronize split-screen invoice previews in real time (< 50ms render latency).",
          "Fleet Ledger Tracking: Tracks diesel expenses, vehicle maintenance logs, and payment settlement flags with index queries.",
        ],
      },
      failureModesAndAuth: "Firestore offline write-ahead cache buffers operations locally when network drops. Firebase Auth enforces domain-restricted user credentials.",
      testingAndVerification: "Unit tested tax, demurrage, and diesel surcharge calculation engines with edge-case test matrices (zero amounts, negative balances, multi-tier tax brackets).",
      keyDecisions: [
        {
          question: "How do you ensure billing reliability without network connectivity?",
          answer: "By utilizing Firestore's local IndexedDB write-ahead log. Invoices created offline are assigned deterministic client-generated UUIDs and queue locally, resolving seamlessly without duplicate bill numbers upon reconnection.",
        },
      ],
    },
  },
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
    apkUrl: "https://github.com/Shriram-2005/intent-attention-firewall/releases/download/v1.0.0/intent-firewall.apk",
    driveUrl: "https://drive.google.com/file/d/1k8boUKWiHlhP9mSJuI-kjhkylKH2jI1i/view?usp=sharing",
    badge: "Android APK",
    highlights: [
      "Deployed an on-device LSTM model via TensorFlow Lite, keeping all personal notifications and processing strictly local.",
      "Optimized memory allocation and SQLite queries to reach 3.68ms warm inference latency under Android 14 background execution limits.",
      "Implemented velocity-based driving detection to automatically hold back non-critical notifications while traveling.",
      "Secured 2nd place solo against 50+ multi-member teams at Presidency University, with industry judges from Aptiv commending its edge-AI system design.",
    ],
    architecture: {
      ownership: "Solo Architect & Systems Developer — Designed on-device ML architecture, wrote 100% of Kotlin background services, Room/SQLite database, and notification listeners.",
      problem: "Classifying Android system notifications with deep neural networks in real time under Android 14 strict background execution limits with 0ms UI blocking and 0 cloud calls.",
      solution: "Engineered an on-device INT8 quantized LSTM model executed via TensorFlow Lite with Android NNAPI hardware acceleration, reaching 3.68ms warm inference.",
      securityOrPerformance: {
        title: "Sub-4ms Inference & Zero-Cloud Privacy",
        points: [
          "INT8 Quantization: Quantized LSTM weights from 32-bit floats to 8-bit integers, reducing model binary footprint by 75% and speeding up vector dot-products on mobile ARM cores.",
          "Android NNAPI Acceleration: Bound TFLite interpreter to Android Neural Networks API, delegating computation to mobile NPU/DSP hardware.",
          "Pre-Allocated Direct ByteBuffers: Zero dynamic heap allocations during inference loop, preventing Android garbage collector pauses (GC_ALLOC).",
          "Zero Bytes Transmitted: Pure offline execution with 0 internet permissions declared in the production AndroidManifest.xml.",
          "Battery-Conscious State Machine: Pauses background polling when device is static; triggers location velocity checks only on registered activity transitions.",
        ],
      },
      failureModesAndAuth: "Service operates inside an Android Foreground Service with Sticky lifecycle. If memory pressure triggers Android OS process death, Room SQLite state and notification queues restore instantly on reboot.",
      testingAndVerification: "Benchmarked using Android Profiler across 5,000 synthetic notification bursts. Awarded 2nd place solo against 50+ teams at Presidency University, commended by Aptiv engineers.",
      keyDecisions: [
        {
          question: "How did you achieve 3.68 ms inference latency?",
          answer: "Through three specific optimizations: 1) INT8 post-training quantization reducing memory bandwidth demands; 2) Android NNAPI hardware delegate offloading tensor operations to the device NPU; and 3) Pre-allocating native ByteBuffers and vocabulary caches to achieve zero heap allocations in the critical inference path.",
        },
        {
          question: "Which parts did you personally implement?",
          answer: "100% of the project was built solo: trained the LSTM model in Python, converted it to TFLite, developed the native Android NotificationListenerService, engineered the SQLite filtering database, and designed the UI.",
        },
      ],
    },
  },
  {
    id: "audio-streaming",
    title: "High-Bitrate Audio Streaming Client",
    tagline: "On-Device Decryption & Low-Bandwidth Personal Streaming",
    description:
      "A personal music streaming mobile application built for uninterrupted high-bitrate playback, on-device audio stream decryption, and local bandwidth caching.",
    category: "Mobile & Edge AI",
    featured: true,
    metrics: [
      { label: "Bitrate", value: "320 kbps High-Res" },
      { label: "Bandwidth Cache", value: "Adaptive Local" },
      { label: "Sessions", value: "Firebase Auth" },
    ],
    tags: ["Android", "Kotlin", "Firebase", "Web Audio / MediaSession", "LocalStorage"],
    githubUrl: "https://github.com/Shriram-2005/Music-App",
    apkUrl: "https://github.com/Shriram-2005/Music-App/releases/download/v1.0.0/audio-streaming.apk",
    driveUrl: "https://drive.google.com/file/d/1eZLkaouVN6-T0gZpmY2WuMcWi2DDLwrk/view?usp=sharing",
    badge: "Android APK",
    highlights: [
      "Implemented on-device audio stream decryption to maintain uninterrupted 320 kbps high-quality playback.",
      "Built an adaptive local data cache and bandwidth tracker to minimize repeat network consumption (~10 MB/track).",
      "Engineered offline download storage and manual playlist import/export tools with Firebase session management.",
    ],
    architecture: {
      ownership: "Solo Mobile Engineer — Built native Android music streaming client in Kotlin, audio pipeline, decryption buffers, and custom bandwidth caching.",
      problem: "Delivering uninterrupted 320 kbps high-bitrate audio playback while minimizing mobile data usage and preventing unauthorized audio file extraction.",
      solution: "Engineered an adaptive chunked disk cache with on-the-fly AES stream decryption piped directly into ExoPlayer audio sinks without persistent unencrypted files.",
      securityOrPerformance: {
        title: "Audio Pipeline & Bandwidth Caching",
        points: [
          "On-the-Fly Stream Decryption: Decrypts AES-encrypted audio streams in-memory via custom DataSource buffers directly feeding the ExoPlayer playback pipeline.",
          "Adaptive Local Bandwidth Cache: LRU disk cache stores encrypted chunks locally (~10MB/track), eliminating repeat network consumption on replay.",
          "MediaSessionService Lifecycle: Background service binding with foreground notification controls, surviving app backgrounding and system sleep states.",
          "Audio Focus Handling: Manages Transient and Ducking audio focus changes (calls, navigation alerts) seamlessly.",
        ],
      },
      failureModesAndAuth: "Graceful stream degradation on network drop with automatic retry backoff. Firebase Auth handles session persistence with secure token storage.",
      testingAndVerification: "Simulated packet loss and bandwidth throttling (2G/3G/airplane mode) to verify buffer underrun recovery and zero-leak playback teardown with LeakCanary.",
      keyDecisions: [
        {
          question: "How do you protect audio content on-device?",
          answer: "Audio files are never saved unencrypted to device storage. Encrypted chunks are cached on disk and decrypted on-the-fly inside an in-memory byte stream immediately before feeding the hardware audio decoder.",
        },
      ],
    },
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
      { name: "JavaScript / TypeScript", level: "Production experience" },
      { name: "Kotlin", level: "Production experience" },
      { name: "SQL", level: "Production experience" },
      { name: "Java", level: "Project experience" },
      { name: "Python", level: "Project experience" },
      { name: "Dart", level: "Project experience" },
      { name: "Solidity", level: "Project experience" },
      { name: "C / C++", level: "Working knowledge" },
      { name: "Go", level: "Currently learning" },
    ],
  },
  {
    title: "Frontend & Mobile",
    description: "Mobile applications, responsive frontends, and component architecture",
    skills: [
      { name: "Next.js (App Router)", level: "Production experience" },
      { name: "React", level: "Production experience" },
      { name: "Tailwind CSS v4", level: "Production experience" },
      { name: "Android SDK (Native)", level: "Production experience" },
      { name: "HTML5 / CSS3", level: "Production experience" },
      { name: "Flutter", level: "Project experience" },
      { name: "Jetpack Compose", level: "Project experience" },
      { name: "Framer Motion", level: "Project experience" },
      { name: "React Native", level: "Currently learning" },
    ],
  },
  {
    title: "Backend & Databases",
    description: "Database isolation, cloud backends, and API infrastructure",
    skills: [
      { name: "PostgreSQL (Row-Level Security)", level: "Production experience" },
      { name: "Supabase", level: "Production experience" },
      { name: "REST APIs", level: "Production experience" },
      { name: "SQLite", level: "Project experience" },
      { name: "Firebase Firestore", level: "Project experience" },
      { name: "Node.js", level: "Working knowledge" },
      { name: "Flask / FastAPI", level: "Working knowledge" },
      { name: "Docker & Containers", level: "Currently learning" },
    ],
  },
  {
    title: "ML & Edge AI",
    description: "On-device models, neural inference, and LLM automation pipelines",
    skills: [
      { name: "Gemini API", level: "Production experience" },
      { name: "Groq LPU", level: "Production experience" },
      { name: "LLM Routing & Webhooks", level: "Production experience" },
      { name: "TensorFlow Lite", level: "Project experience" },
      { name: "LSTM On-Device Models", level: "Project experience" },
      { name: "Edge AI Optimization", level: "Project experience" },
      { name: "PyTorch", level: "Working knowledge" },
      { name: "Agentic Workflows", level: "Currently learning" },
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
