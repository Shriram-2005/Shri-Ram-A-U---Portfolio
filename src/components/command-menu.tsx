"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/toast";
import { personalInfo } from "@/data/portfolio-data";
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
} from "lucide-react";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme } = useTheme();
  const { toast } = useToast();

  const commands = useMemo(
    () => [
      {
        section: "Navigation",
        items: [
          {
            id: "nav-about",
            title: "Go to About Me",
            subtitle: "Background, story & philosophy",
            icon: User,
            action: () => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              onClose();
            },
          },
          {
            id: "nav-projects",
            title: "Go to Selected Work",
            subtitle: "Case studies & featured projects",
            icon: FolderGit2,
            action: () => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              onClose();
            },
          },
          {
            id: "nav-experience",
            title: "Go to Experience",
            subtitle: "Career timeline & impact",
            icon: Briefcase,
            action: () => {
              document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
              onClose();
            },
          },
          {
            id: "nav-skills",
            title: "Go to Skills & Toolbox",
            subtitle: "Frontend, backend, systems & cloud",
            icon: Sparkles,
            action: () => {
              document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
              onClose();
            },
          },
          {
            id: "nav-terminal",
            title: "Open Dev Terminal",
            subtitle: "Interactive developer command line",
            icon: Terminal,
            action: () => {
              document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
              onClose();
            },
          },
          {
            id: "nav-contact",
            title: "Go to Contact",
            subtitle: "Get in touch & direct email",
            icon: Mail,
            action: () => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              onClose();
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
            action: () => {
              navigator.clipboard.writeText(personalInfo.email);
              toast("Email copied to clipboard!", "success");
              onClose();
            },
          },
          {
            id: "action-resume",
            title: "View Resume",
            subtitle: "Download or view PDF",
            icon: FileText,
            action: () => {
              window.open(personalInfo.resumeUrl, "_blank");
              onClose();
            },
          },
          {
            id: "action-github",
            title: "Open GitHub Profile",
            subtitle: personalInfo.github,
            icon: GithubIcon,
            action: () => {
              window.open(personalInfo.github, "_blank");
              onClose();
            },
          },
          {
            id: "action-linkedin",
            title: "Open LinkedIn Profile",
            subtitle: personalInfo.linkedin,
            icon: LinkedinIcon,
            action: () => {
              window.open(personalInfo.linkedin, "_blank");
              onClose();
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
            action: () => {
              setTheme("light");
              toast("Switched to Light mode", "info");
              onClose();
            },
          },
          {
            id: "theme-dark",
            title: "Switch to Dark Mode",
            subtitle: "Deep obsidian midnight theme",
            icon: Moon,
            action: () => {
              setTheme("dark");
              toast("Switched to Dark mode", "info");
              onClose();
            },
          },
          {
            id: "theme-system",
            title: "Switch to System Preference",
            subtitle: "Follows OS appearance",
            icon: Laptop,
            action: () => {
              setTheme("system");
              toast("Set theme to System default", "info");
              onClose();
            },
          },
        ],
      },
    ],
    [onClose, setTheme, toast]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();

    return commands
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(lower) ||
            item.subtitle.toLowerCase().includes(lower)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [commands, query]);

  const flatItems = useMemo(
    () => filteredCommands.flatMap((s) => s.items),
    [filteredCommands]
  );

  const handleClose = () => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open handled by parent
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
      } else if (e.key === "Enter" && flatItems[selectedIndex]) {
        e.preventDefault();
        flatItems[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, flatItems, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-28">
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
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95"
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
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden dark:text-zinc-100"
              />
              <button
                onClick={handleClose}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Command List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {flatItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No matching commands found.
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
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-200"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                isSelected
                                  ? "bg-purple-600 text-white"
                                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                              ↵ Enter
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer with key hints */}
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2.5 text-[11px] text-zinc-400 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↑
                  </kbd>{" "}
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↓
                  </kbd>{" "}
                  to navigate
                </span>
                <span>
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↵
                  </kbd>{" "}
                  to select
                </span>
              </div>
              <div>
                <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                  Esc
                </kbd>{" "}
                to dismiss
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
