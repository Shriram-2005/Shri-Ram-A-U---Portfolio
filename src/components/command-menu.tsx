"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/toast";
import { personalInfo, featuredProjects } from "@/data/portfolio-data";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import {
  Search,
  User,
  FolderGit2,
  Briefcase,
  Terminal,
  Mail,
  Copy,
  Sun,
  Moon,
  Laptop,
  FileText,
  X,
  Sparkles,
  ExternalLink,
  Globe,
  Smartphone,
  ShieldCheck,
  Download,
  ArrowUpRight,
} from "lucide-react";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  keywords?: string[];
  action: () => void;
}

interface CommandSection {
  section: string;
  items: CommandItem[];
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shortcutKey, setShortcutKey] = useState("Ctrl+K");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isKeyboardNavRef = useRef(false);
  const { setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
      setShortcutKey(isMac ? "⌘K" : "Ctrl+K");
    }
  }, []);

  const handleClose = () => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  };

  const commands: CommandSection[] = useMemo(
    () => [
      {
        section: "Projects & Deep-Dive Case Studies",
        items: [
          {
            id: "project-garment",
            title: "Garment ERP: Multi-Tenant Manufacturing SaaS",
            subtitle: "Full-Stack | 19 PostgreSQL RLS tables, security-definer functions & Gemini QA",
            icon: Globe,
            badge: "Case Study",
            keywords: [
              "garment",
              "erp",
              "saas",
              "multi-tenant",
              "postgres",
              "postgresql",
              "rls",
              "row level security",
              "gemini",
              "apparel",
              "manufacturing",
              "inventory",
              "19 tables",
              "case study",
              "architecture",
            ],
            action: () => {
              router.push("/projects/garment-erp");
              handleClose();
            },
          },
          {
            id: "project-intent",
            title: "Intent: Edge-AI Notification Firewall",
            subtitle: "Mobile & Edge AI | 3.68ms warm inference, offline INT8 LSTM & Kotlin service",
            icon: Smartphone,
            badge: "Case Study",
            keywords: [
              "intent",
              "edge-ai",
              "edge ai",
              "notification",
              "firewall",
              "3.68ms",
              "inference",
              "latency",
              "tflite",
              "tensorflow",
              "lstm",
              "kotlin",
              "android",
              "offline",
              "case study",
              "architecture",
            ],
            action: () => {
              router.push("/projects/intent-firewall");
              handleClose();
            },
          },
          {
            id: "project-blockchain",
            title: "Online Blockchain Certificate Generation & Validation",
            subtitle: "Blockchain & Web3 | Ethereum Sepolia contract, Keccak-256 & ELA tamper checks",
            icon: ShieldCheck,
            badge: "Case Study",
            keywords: [
              "blockchain",
              "certchain",
              "certificate",
              "verification",
              "ethereum",
              "sepolia",
              "solidity",
              "smart contract",
              "keccak",
              "ela",
              "tamper",
              "fraud",
              "case study",
              "architecture",
            ],
            action: () => {
              router.push("/projects/blockchain-verification");
              handleClose();
            },
          },
          {
            id: "project-logistics",
            title: "AUS Transport: Logistics Billing & Fleet Portal",
            subtitle: "Web & Cloud | Offline Firestore caching, split-screen billing & instant PDF export",
            icon: Globe,
            badge: "Case Study",
            keywords: [
              "logistics",
              "aus",
              "transport",
              "billing",
              "fleet",
              "invoicing",
              "firestore",
              "firebase",
              "pdf",
              "offline",
              "case study",
              "architecture",
            ],
            action: () => {
              router.push("/projects/logistics-portal");
              handleClose();
            },
          },
          {
            id: "project-ielts",
            title: "Intellify IELTS: Ed-Tech Web Platform & CMS",
            subtitle: "Web & Cloud | Deepgram STT speech scoring, Mux video streaming & instructor CMS",
            icon: Globe,
            badge: "Case Study",
            keywords: [
              "ielts",
              "intellify",
              "speech",
              "assessment",
              "deepgram",
              "mux",
              "video",
              "cms",
              "edtech",
              "razorpay",
              "case study",
              "architecture",
            ],
            action: () => {
              router.push("/projects/ielts-platform");
              handleClose();
            },
          },
          {
            id: "project-audio",
            title: "High-Bitrate Audio Streaming Client",
            subtitle: "Mobile & Edge AI | 320 kbps high-res playback, on-device AES decryption & local cache",
            icon: Smartphone,
            badge: "Case Study",
            keywords: [
              "audio",
              "music",
              "streaming",
              "exoplayer",
              "320 kbps",
              "decryption",
              "aes",
              "cache",
              "android",
              "kotlin",
              "case study",
              "architecture",
            ],
            action: () => {
              router.push("/projects/audio-streaming");
              handleClose();
            },
          },
        ],
      },
      {
        section: "Live Demos & App Deployments",
        items: [
          {
            id: "live-garment",
            title: "Launch Garment ERP (Live Demo)",
            subtitle: "garment-erp-one.vercel.app | Multi-tenant SaaS on Vercel",
            icon: ExternalLink,
            badge: "Live App",
            keywords: ["garment", "erp", "live", "demo", "deploy", "launch", "vercel"],
            action: () => {
              window.open("https://garment-erp-one.vercel.app/", "_blank", "noopener,noreferrer");
              handleClose();
            },
          },
          {
            id: "live-blockchain",
            title: "Launch Blockchain CertChain (Live Demo)",
            subtitle: "certchain-blockchain-verification.vercel.app | Ethereum Sepolia dApp",
            icon: ExternalLink,
            badge: "Live App",
            keywords: ["blockchain", "certchain", "live", "demo", "sepolia", "launch", "vercel"],
            action: () => {
              window.open("https://certchain-blockchain-verification.vercel.app/", "_blank", "noopener,noreferrer");
              handleClose();
            },
          },
          {
            id: "live-logistics",
            title: "Launch AUS Transport (Live Demo)",
            subtitle: "aus-transport-website.vercel.app | Fleet & Invoicing portal",
            icon: ExternalLink,
            badge: "Live App",
            keywords: ["logistics", "aus", "transport", "live", "demo", "launch", "vercel"],
            action: () => {
              window.open("https://aus-transport-website.vercel.app/", "_blank", "noopener,noreferrer");
              handleClose();
            },
          },
          {
            id: "live-ielts",
            title: "Launch Intellify IELTS (Live Demo)",
            subtitle: "intellify-prototype.vercel.app | Speech testing web app",
            icon: ExternalLink,
            badge: "Live App",
            keywords: ["ielts", "intellify", "live", "demo", "launch", "vercel"],
            action: () => {
              window.open("https://intellify-prototype.vercel.app/", "_blank", "noopener,noreferrer");
              handleClose();
            },
          },
          {
            id: "apk-intent",
            title: "Download Intent Edge-AI APK (Release v1.0.0)",
            subtitle: "github.com/Shriram-2005/intent-attention-firewall | Android Release",
            icon: Download,
            badge: "APK Release",
            keywords: ["intent", "apk", "download", "android", "release", "install", "edge ai"],
            action: () => {
              window.open("https://github.com/Shriram-2005/intent-attention-firewall/releases/download/v1.0.0/intent-firewall.apk", "_blank", "noopener,noreferrer");
              handleClose();
            },
          },
          {
            id: "apk-audio",
            title: "Download Audio Streaming APK (Release v1.0.0)",
            subtitle: "github.com/Shriram-2005/Music-App | Android Release",
            icon: Download,
            badge: "APK Release",
            keywords: ["audio", "music", "apk", "download", "android", "release", "install"],
            action: () => {
              window.open("https://github.com/Shriram-2005/Music-App/releases/download/v1.0.0/audio-streaming.apk", "_blank", "noopener,noreferrer");
              handleClose();
            },
          },
        ],
      },
      {
        section: "Navigation",
        items: [
          {
            id: "nav-about",
            title: "Go to About Me",
            subtitle: "Background, story & engineering mindset",
            icon: User,
            keywords: ["about", "bio", "education", "presidency", "university"],
            action: () => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              handleClose();
            },
          },
          {
            id: "nav-projects",
            title: "Go to Selected Work",
            subtitle: "Engineering projects & case studies overview",
            icon: FolderGit2,
            keywords: ["projects", "work", "portfolio", "selected"],
            action: () => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              handleClose();
            },
          },
          {
            id: "nav-experience",
            title: "Go to Experience",
            subtitle: "Career timeline, internship & impact",
            icon: Briefcase,
            keywords: ["experience", "internship", "saina", "timeline", "career"],
            action: () => {
              document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
              handleClose();
            },
          },
          {
            id: "nav-skills",
            title: "Go to Skills & Toolbox",
            subtitle: "Production experience, project stack & working knowledge",
            icon: Sparkles,
            keywords: ["skills", "toolbox", "stack", "technologies", "languages"],
            action: () => {
              document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
              handleClose();
            },
          },
          {
            id: "nav-terminal",
            title: "Open Dev Terminal",
            subtitle: "Interactive developer command line",
            icon: Terminal,
            keywords: ["terminal", "shell", "console", "cli", "bash", "zsh"],
            action: () => {
              document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
              handleClose();
            },
          },
          {
            id: "nav-contact",
            title: "Go to Contact",
            subtitle: "Direct email & communication channels",
            icon: Mail,
            keywords: ["contact", "email", "reach", "hire", "message"],
            action: () => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              handleClose();
            },
          },
        ],
      },
      {
        section: "Quick Actions",
        items: [
          {
            id: "action-copy-email",
            title: "Copy Email Address",
            subtitle: personalInfo.email,
            icon: Copy,
            keywords: ["copy", "email", "clipboard"],
            action: () => {
              navigator.clipboard.writeText(personalInfo.email);
              toast("Email copied to clipboard!", "success");
              handleClose();
            },
          },
          {
            id: "action-resume",
            title: "View Resume (PDF)",
            subtitle: "Direct PDF download & preview",
            icon: FileText,
            keywords: ["resume", "cv", "pdf", "download"],
            action: () => {
              window.open(personalInfo.resumeUrl, "_blank");
              handleClose();
            },
          },
          {
            id: "action-github",
            title: "Open GitHub Profile",
            subtitle: personalInfo.github,
            icon: GithubIcon,
            keywords: ["github", "code", "repositories", "profile"],
            action: () => {
              window.open(personalInfo.github, "_blank");
              handleClose();
            },
          },
          {
            id: "action-linkedin",
            title: "Open LinkedIn Profile",
            subtitle: personalInfo.linkedin,
            icon: LinkedinIcon,
            keywords: ["linkedin", "social", "connect", "profile"],
            action: () => {
              window.open(personalInfo.linkedin, "_blank");
              handleClose();
            },
          },
        ],
      },
      {
        section: "Theme",
        items: [
          {
            id: "theme-light",
            title: "Switch to Light Mode",
            subtitle: "Clean high-contrast daytime theme",
            icon: Sun,
            keywords: ["light", "day", "theme"],
            action: () => {
              setTheme("light");
              toast("Switched to Light mode", "info");
              handleClose();
            },
          },
          {
            id: "theme-dark",
            title: "Switch to Dark Mode",
            subtitle: "Deep obsidian midnight theme",
            icon: Moon,
            keywords: ["dark", "night", "theme", "black"],
            action: () => {
              setTheme("dark");
              toast("Switched to Dark mode", "info");
              handleClose();
            },
          },
          {
            id: "theme-system",
            title: "Switch to System Preference",
            subtitle: "Follows OS appearance",
            icon: Laptop,
            keywords: ["system", "os", "theme", "auto"],
            action: () => {
              setTheme("system");
              toast("Set theme to System default", "info");
              handleClose();
            },
          },
        ],
      },
    ],
    [router, setTheme, toast]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();

    return commands
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const inTitle = item.title.toLowerCase().includes(lower);
          const inSubtitle = item.subtitle.toLowerCase().includes(lower);
          const inKeywords = item.keywords?.some((k) =>
            k.toLowerCase().includes(lower)
          );
          return inTitle || inSubtitle || inKeywords;
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [commands, query]);

  const flatItems = useMemo(
    () => filteredCommands.flatMap((s) => s.items),
    [filteredCommands]
  );

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setSelectedIndex(0);
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        document.body.style.overflow = prevOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Keep selectedIndex within valid range when search query filters results
  useEffect(() => {
    if (selectedIndex >= flatItems.length) {
      setSelectedIndex(0);
    }
  }, [flatItems.length, selectedIndex]);

  // Auto-scroll the list to ensure the selected item is always visible
  useEffect(() => {
    if (!listRef.current) return;

    if (selectedIndex === 0) {
      listRef.current.scrollTop = 0;
      return;
    }

    if (isKeyboardNavRef.current) {
      const container = listRef.current;
      const selectedElement = container.querySelector<HTMLElement>('[data-selected="true"]');
      if (selectedElement) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = selectedElement.getBoundingClientRect();

        if (itemRect.bottom > containerRect.bottom) {
          container.scrollTop += itemRect.bottom - containerRect.bottom + 12;
        } else if (itemRect.top < containerRect.top) {
          container.scrollTop -= containerRect.top - itemRect.top + 12;
        }
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
      } else if (e.key === "Home") {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        setSelectedIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        setSelectedIndex(Math.max(0, flatItems.length - 1));
      } else if (e.key === "Enter" && flatItems[selectedIndex]) {
        e.preventDefault();
        flatItems[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flatItems, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-3 sm:pt-24 sm:px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95"
          >
            {/* Search Input Bar */}
            <div className="flex items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <Search className="h-4 w-4 text-zinc-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search projects (Intent, Garment, Blockchain...), case studies, commands..."
                className="w-full bg-transparent text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden dark:text-zinc-100"
              />
              <button
                onClick={handleClose}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Close command palette"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Command List */}
            <div ref={listRef} className="max-h-96 overflow-y-auto p-2 scroll-py-2">
              {flatItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No matching projects or commands found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                filteredCommands.map((section) => (
                  <div key={section.section} className="mb-2">
                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {section.section}
                    </div>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const globalIndex = flatItems.findIndex((fi) => fi.id === item.id);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={item.id}
                          data-selected={isSelected}
                          onClick={item.action}
                          onMouseEnter={() => {
                            isKeyboardNavRef.current = false;
                            setSelectedIndex(globalIndex);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors scroll-my-1 ${
                            isSelected
                              ? "bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-200"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                isSelected
                                  ? "bg-purple-600 text-white"
                                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{item.title}</span>
                                {item.badge && (
                                  <span className="shrink-0 rounded-md border border-purple-200 bg-purple-50 px-1.5 py-0.2 text-[10px] font-semibold text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-zinc-500 truncate dark:text-zinc-400">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-1.5">
                            {isSelected ? (
                              <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                                ↵ Enter
                              </span>
                            ) : (
                              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 opacity-60" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer with key hints */}
            <div className="hidden sm:flex items-center justify-between border-t border-zinc-200 px-4 py-2.5 text-[11px] text-zinc-400 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↑
                  </kbd>{" "}
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↓
                  </kbd>{" "}
                  to navigate
                </span>
                <span>
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↵
                  </kbd>{" "}
                  to open
                </span>
                <span>
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    {shortcutKey}
                  </kbd>{" "}
                  to toggle
                </span>
              </div>
              <div>
                <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                  Esc
                </kbd>{" "}
                to close
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
