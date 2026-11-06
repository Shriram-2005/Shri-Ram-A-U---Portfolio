import { Project, Experience, SkillCategory, Education, Honor, SocialLink } from "@/types/portfolio";

export const personalInfo = {
  name: "Shri Ram A U",
  preferredName: "Shri Ram",
  role: "AI Solutions Developer & Software Engineer (Mobile, Next.js, Edge AI)",
  tagline: "Architecting on-device edge AI systems, multi-tenant cloud platforms, and production mobile & web applications.",
  shortBio:
    "7th-semester Computer Science undergraduate at Presidency University Bangalore and AI Solutions Developer Intern at Saina Human AI. Experienced in building mobile and web applications in Kotlin, Java, JavaScript, Python, and Dart, with deep backend focus on PostgreSQL (RLS), Supabase, and SQLite data design. Creator of Intent: an on-device edge-AI notification firewall operating at 3.68ms warm inference latency.",
  location: "Greater Bengaluru Area, India (IST, UTC+5:30)",
  phone: "+91 70196 13040",
  availability: "Open to 6-month engineering internships (Jan-Jun 2027) with PPO pathways",
  email: "shriram2005au@gmail.com",
  github: "https://github.com/Shriram-2005",
  linkedin: "https://www.linkedin.com/in/shriramau",
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
      ownership: "Full-Stack Lead: I designed the entire 19-table database schema, wrote the PostgreSQL RLS security policies, and built the Next.js frontend and Gemini QA integration.",
      problem: "Preventing tenant companies from accidentally or maliciously reading each other's manufacturing and billing data across 19 tables, without slowing down queries.",
      solution: "I pushed security into the PostgreSQL database engine using Supabase Row-Level Security (RLS) and JWT claims, instead of relying on frontend WHERE clauses.",
      securityOrPerformance: {
        title: "How tenant isolation works across all 19 tables",
        points: [
          "Tenant ID inside JWT: When a user signs in, their organization_id is baked right into their token metadata, which Postgres reads via auth.jwt().",
          "FORCE ROW LEVEL SECURITY: Turned this on for every table so even table owners and service queries cannot bypass isolation rules by mistake.",
          "SECURITY DEFINER stored procedures: Complex multi-step actions (like deducting fabric stock when a cutter finishes a bundle) run through dedicated Postgres functions with a locked search_path to prevent privilege escalation.",
          "Role-based access: Next.js middleware checks user roles (Admin, Manager, QA Auditor) before pages load, while Postgres policies back it up on raw data reads.",
        ],
      },
      failureModesAndAuth: "Next.js Edge Middleware checks the JWT on every request. If a network blip happens during an order update, the UI rolls back optimistically, and defect photos upload to short-lived signed S3 URLs.",
      testingAndVerification: "Wrote penetration test scripts that impersonate User A from Tenant 1 and deliberately attempt to fetch or update Tenant 2's records, verifying that Postgres returns 0 rows every time.",
      keyDecisions: [
        {
          question: "How do you prevent cross-tenant data leakage?",
          answer: "I do not trust application-level filters. Instead, every single table has PostgreSQL Row-Level Security forced on it. Every query automatically verifies that organization_id matches the authenticated user's JWT claim. If a developer forgets a tenant filter in a frontend query, Postgres still blocks the data.",
        },
        {
          question: "Why did you use SECURITY DEFINER functions?",
          answer: "When a worker marks a garment bundle as completed, several inventory tables need updating at once. Rather than giving the worker's role direct write access to the central inventory ledger, the app calls a SECURITY DEFINER function that validates the batch and updates the ledger with a locked search path.",
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
      ownership: "Sole Web3 Developer: I wrote and deployed the Solidity smart contract to Sepolia, built the Next.js dApp, and wrote the Python image analysis service.",
      problem: "Stopping counterfeit academic marksheets and catching forged or photoshopped certificate images before they get verified.",
      solution: "A dual check: I anchor salted Keccak-256 hashes of academic records on Ethereum Sepolia, and use a Python service running Error Level Analysis (ELA) to catch edited photos.",
      securityOrPerformance: {
        title: "On-chain verification and image tamper detection",
        points: [
          "Only hashes on-chain: Storing full PDF certificates on Ethereum is slow, expensive, and leaks student privacy. Storing only the Keccak-256 hash costs roughly 45,000 gas and is mathematically tamper-proof.",
          "Gas optimization: Packed struct fields and tightly sized uint variables reduced minting gas costs by 28% per issuance.",
          "Error Level Analysis (ELA): Uploaded marksheets are scanned by a Python/Flask service to spot digital compression mismatches where grades, names, or stamps were photoshopped.",
          "Issuer-only minting: The Solidity contract uses OpenZeppelin access controls so only verified university wallet addresses can mint or revoke credentials.",
        ],
      },
      failureModesAndAuth: "If the primary Ethereum RPC node throttles or drops out, the dApp automatically fails over between Infura and Alchemy. Contract calls include custom revert strings for clear user feedback.",
      testingAndVerification: "Wrote a Hardhat test suite testing unauthorized mint attempts, hash lookups, and revocations. Verified the contract on Sepolia Etherscan with 100% test pass rate.",
      keyDecisions: [
        {
          question: "How did you test your blockchain certificate verification system?",
          answer: "I used Hardhat to run local EVM tests against simulated attack vectors, like non-owner wallets trying to mint certificates or verifying nonexistent hashes. Once tests passed locally, I deployed to the Sepolia testnet and verified transactions using MetaMask.",
        },
        {
          question: "Why store hashes on-chain instead of actual certificates?",
          answer: "Putting documents or images on a public blockchain costs too much gas and violates basic student privacy. A Keccak-256 hash takes up 32 bytes, costs very little gas, and lets anyone with the original file verify its authenticity in seconds.",
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
      ownership: "Full-Stack Developer: Built the Next.js student portal, the instructor mock test CMS, Supabase auth, and integrated Deepgram STT and Mux video streaming.",
      problem: "Giving students live pronunciation feedback on spoken answers without server crashes, while keeping lesson videos secure.",
      solution: "Piped microphone audio chunks straight to Deepgram's API, and protected video content using signed Mux playback tokens that expire after 2 hours.",
      securityOrPerformance: {
        title: "Audio streaming and protected video delivery",
        points: [
          "Chunked audio streaming: Browser records user audio using MediaRecorder and streams chunks to Deepgram STT over WebSockets for rapid scoring.",
          "Signed video playback: Mux playback tokens are minted on server routes with a 2-hour lifespan so users cannot download or scrape video URLs.",
          "Unlisted instructor CMS: Hidden route protected by Supabase JWT custom claims (role = instructor) allowing teachers to update questions without deploying new code.",
          "Payment webhooks: Razorpay webhooks securely verify signatures before unlocking courses for students.",
        ],
      },
      failureModesAndAuth: "If the student's internet drops while speaking, audio chunks buffer in browser storage (IndexedDB) and auto-retry as a batch file so they don't have to restart their mock test.",
      testingAndVerification: "Wrote Jest unit tests for the speech scoring algorithm and mocked Razorpay webhook payloads to test payment verification.",
      keyDecisions: [
        {
          question: "How do you handle API failures during live audio assessment?",
          answer: "Audio is recorded locally in the browser buffer at the same time it is being streamed. If the live WebSocket connection drops, the app catches the error and sends the full audio buffer via a standard POST request, so the student never loses their recording.",
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
      ownership: "Lead Systems Developer: Built the complete web portal to replace messy paper bills and spreadsheets with instant PDF invoices and fleet tracking.",
      problem: "Dispatchers were making costly calculation errors in manual Excel sheets that frequently got overwritten or lost.",
      solution: "Built a split-screen invoice generator with instant PDF rendering, integer currency math to avoid rounding bugs, and Firestore offline caching.",
      securityOrPerformance: {
        title: "Reliable billing and offline sync",
        points: [
          "Integer math for money: JavaScript floating-point arithmetic causes bugs like 0.1 + 0.2 != 0.3, so I stored all currency as whole paise to guarantee exact totals.",
          "Works in offline loading docks: Dispatchers can create and save bills even when there is no mobile signal; Firestore syncs everything back up when they reconnect.",
          "Split-screen live preview: Typing on the left shows the formatted PDF on the right in real time without lag.",
          "Fleet expense tracking: Tracks diesel costs, driver assignments, and pending client dues with indexed queries.",
        ],
      },
      failureModesAndAuth: "Firestore local cache holds pending bills in IndexedDB during internet cutouts. Firebase Auth restricts dashboard access to company employees.",
      testingAndVerification: "Wrote unit test cases for fuel surcharges, multi-tier GST tax calculations, and penalty fees to ensure zero billing discrepancies.",
      keyDecisions: [
        {
          question: "How do you ensure billing reliability without network connectivity?",
          answer: "I enabled Firestore's offline persistence. When dispatchers create an invoice at a remote loading dock, the bill gets saved with a client-generated UUID to the local database, and syncs automatically without duplicate bill numbers once back online.",
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
      ownership: "Solo built from scratch: I trained the model, wrote all the Android Kotlin background services, set up the SQLite database, and built the UI.",
      problem: "Running an LSTM neural network inside a phone background service without draining the battery or getting killed by Android 14's strict background execution limits.",
      solution: "I quantized the model weights to INT8 to shrink its memory footprint, tied it into Android's NNAPI hardware delegate, and pre-allocated byte buffers so Garbage Collection pauses don't freeze the app.",
      securityOrPerformance: {
        title: "How I hit 3.68ms warm latency and kept data local",
        points: [
          "Quantized model to INT8: Squeezed model weights down by 75% so matrix multiplications run directly on mobile ARM cores without choking RAM.",
          "NNAPI hardware delegate: Routed inference straight to the phone's NPU/DSP instead of running it on the main CPU.",
          "Zero-allocation loop: Pre-allocated direct ByteBuffers for token vectors. Creating new objects on every notification triggers Android GC pauses, so reusing fixed buffers kept it smooth.",
          "Zero internet permission: The production app manifest doesn't even declare INTERNET permission, so no notification text can ever leave the physical device.",
          "Smart polling: The app watches device sensors and stops polling when the phone is sitting still on a table to save battery.",
        ],
      },
      failureModesAndAuth: "Runs as an Android Foreground Service with a sticky lifecycle. If the OS kills the process under extreme memory load, it restores its state and queues from Room SQLite the moment it restarts.",
      testingAndVerification: "Benchmarked with Android Profiler across 5,000 synthetic notification bursts. Won 2nd place solo against 50+ teams at Presidency University, commended by Aptiv engineers.",
      keyDecisions: [
        {
          question: "How did you achieve 3.68 ms inference latency?",
          answer: "Three practical things: First, I quantized the LSTM from float32 to INT8 in TensorFlow Lite, which cut weight size by 75%. Second, I hooked up Android's NNAPI delegate so matrix math runs on the NPU/DSP. Third, I pre-allocated native ByteBuffers and vocabulary lookups instead of allocating new strings on every notification, which completely stopped Android's Garbage Collector from causing micro-stutters.",
        },
        {
          question: "Which parts of this project did you personally implement?",
          answer: "Everything. I trained the LSTM model in Python, converted it to TFLite, wrote the Android NotificationListenerService in Kotlin, wrote the local SQLite queries, and built the companion interface.",
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
      ownership: "Solo Mobile Engineer: Built the native Android app in Kotlin, set up the ExoPlayer audio pipeline, on-the-fly decryption, and local bandwidth caching.",
      problem: "Playing high-bitrate 320 kbps audio smoothly on mobile without re-downloading songs on repeat or leaving raw audio files exposed.",
      solution: "Built a custom cache that stores encrypted audio chunks locally (~10MB/song) and decrypts them in-memory directly into ExoPlayer.",
      securityOrPerformance: {
        title: "Audio streaming pipeline and local caching",
        points: [
          "In-memory stream decryption: Audio chunks are encrypted with AES on disk and decrypted on-the-fly inside memory buffers right before feeding the hardware player.",
          "Smart bandwidth cache: Replaying a song uses 0 mobile data because the encrypted chunks are pulled from local storage.",
          "Background MediaSession: Background service keeps playback running smoothly even when the screen is turned off or when other apps are open.",
          "Audio focus management: Smoothly pauses or lowers volume (audio ducking) when phone calls or navigation directions come in.",
        ],
      },
      failureModesAndAuth: "Handles network buffering gracefully with retry backoff. Firebase Auth handles user playlists and favorites securely.",
      testingAndVerification: "Tested with Android network throttler (simulating 2G/3G and tunnel disconnects) and checked for memory leaks using LeakCanary.",
      keyDecisions: [
        {
          question: "How do you protect audio content on-device?",
          answer: "Audio files are never saved unencrypted to disk. The app caches encrypted byte chunks locally and decrypts them in-memory only as the audio player requests them, preventing raw files from being dumped.",
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
    period: "Oct 2026 - Present",
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
    period: "Oct 2023 - May 2027 (Expected)",
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
    name: "Email",
    url: "mailto:shriram2005au@gmail.com",
    handle: "shriram2005au@gmail.com",
    icon: "Mail",
  },
];
