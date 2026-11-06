"use client";

import React, { useState, useRef, useEffect } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { personalInfo, featuredProjects, skillCategories } from "@/data/portfolio-data";
import {
  Terminal as TerminalIcon,
  ArrowUpRight,
  Globe,
  Download,
  ExternalLink,
} from "lucide-react";

interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  content: string | React.ReactNode;
}

const quickCommands = ["bio", "projects", "skills", "cat resume", "contact", "clear"];

export function TerminalSection() {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: "system",
      content: "Welcome to Shriram's Interactive Shell v2.4 (cross-platform)",
    },
    {
      type: "system",
      content: "Type 'help' to inspect commands, 'projects' for interactive links, or tap any quick pill below.",
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
      const isWin = /Win/.test(navigator.userAgent);
      const pStr = isMac ? "x86_64-apple-darwin" : isWin ? "x86_64-pc-windows" : "x86_64-linux-gnu";
      setHistory((prev) => [
        {
          type: "system",
          content: `Welcome to Shriram's Interactive Shell v2.4 (${pStr})`,
        },
        prev[1] || {
          type: "system",
          content: "Type 'help' to inspect commands, 'projects' for interactive links, or tap any quick pill below.",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    setCommandHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [{ type: "input", content: rawCmd }];

    // Direct project inspection lookup (e.g. "intent", "garment", "blockchain", "project intent")
    const projectMatch = featuredProjects.find((p) => {
      if (cmd === p.id.toLowerCase() || cmd === `project ${p.id.toLowerCase()}` || cmd === `open ${p.id.toLowerCase()}`) {
        return true;
      }
      if (cmd === "intent" && p.id === "intent-firewall") return true;
      if (cmd === "garment" && p.id === "garment-erp") return true;
      if (cmd === "blockchain" && p.id === "blockchain-verification") return true;
      if (cmd === "logistics" && p.id === "logistics-portal") return true;
      if (cmd === "ielts" && p.id === "ielts-platform") return true;
      if ((cmd === "audio" || cmd === "music") && p.id === "audio-streaming") return true;
      if (cmd.startsWith("project ")) {
        const sub = cmd.replace("project ", "").trim();
        return p.id.includes(sub) || p.title.toLowerCase().includes(sub);
      }
      return false;
    });

    if (projectMatch) {
      newLines.push({
        type: "output",
        content: (
          <div className="flex flex-col gap-2 rounded-lg bg-zinc-900/80 p-3 border border-purple-500/30 text-[11px] sm:text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1 border-b border-zinc-800 pb-1.5">
              <span className="font-bold text-zinc-100">{projectMatch.title}</span>
              <span className="rounded bg-purple-950/70 border border-purple-800/50 px-1.5 py-0.2 text-[10px] font-mono text-purple-300">
                {projectMatch.category}
              </span>
            </div>
            <p className="text-zinc-300">{projectMatch.tagline}</p>
            <p className="text-zinc-400 text-[10px] sm:text-[11px]">{projectMatch.description}</p>
            {projectMatch.metrics && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {projectMatch.metrics.map((m) => (
                  <span key={m.label} className="rounded bg-zinc-800/80 px-2 py-0.5 border border-zinc-700/60 font-mono text-[10px] text-zinc-300">
                    <span className="text-purple-300">{m.label}:</span> {m.value}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60 font-mono">
              <a
                href={`/projects/${projectMatch.id}`}
                className="inline-flex items-center gap-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 px-2 py-1 transition-colors"
              >
                <span>[Case Study & Architecture]</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
              {projectMatch.liveUrl && (
                <a
                  href={projectMatch.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 px-2 py-1 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span>[Launch Live Web App ↗]</span>
                </a>
              )}
              {projectMatch.apkUrl && (
                <a
                  href={projectMatch.apkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 px-2 py-1 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  <span>[Download APK ⤓]</span>
                </a>
              )}
              {projectMatch.githubUrl && (
                <a
                  href={projectMatch.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-2 py-1 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>[GitHub Repo]</span>
                </a>
              )}
            </div>
          </div>
        ),
      });
      setHistory((prev) => [...prev, ...newLines]);
      return;
    }

    switch (cmd) {
      case "help":
        newLines.push({
          type: "output",
          content: (
            <div className="flex flex-col gap-1 text-[11px] sm:text-xs">
              <span className="font-bold text-purple-400">Available commands:</span>
              <span>  <span className="text-zinc-200 font-semibold">bio</span>              - Learn about Shri Ram</span>
              <span>  <span className="text-zinc-200 font-semibold">projects</span>         - List engineering projects with clickable links</span>
              <span>  <span className="text-zinc-200 font-semibold">project &lt;name&gt;</span>    - Inspect specific project (e.g. project intent, garment)</span>
              <span>  <span className="text-zinc-200 font-semibold">skills</span>           - Inspect tech competencies</span>
              <span>  <span className="text-zinc-200 font-semibold">contact</span>          - Output communication channels</span>
              <span>  <span className="text-zinc-200 font-semibold">phone</span>            - Reveal direct phone line (anti-spam)</span>
              <span>  <span className="text-zinc-200 font-semibold">cat resume</span>       - Print resume highlights</span>
              <span>  <span className="text-zinc-200 font-semibold">date</span>             - Display current timestamp</span>
              <span>  <span className="text-zinc-200 font-semibold">clear</span>            - Clear terminal screen</span>
              <span>  <span className="text-zinc-200 font-semibold">sudo</span>             - Administrative access</span>
            </div>
          ),
        });
        break;

      case "bio":
        newLines.push({
          type: "output",
          content: `${personalInfo.name} - ${personalInfo.role}. ${personalInfo.shortBio}`,
        });
        break;

      case "projects":
        newLines.push({
          type: "output",
          content: (
            <div className="flex flex-col gap-2.5 text-[11px] sm:text-xs py-1">
              <div className="text-purple-300 font-semibold border-b border-zinc-800 pb-1">
                Engineering Projects ({featuredProjects.length}) | Click any link below or type &apos;project &lt;name&gt;&apos;:
              </div>
              {featuredProjects.map((p) => (
                <div key={p.id} className="flex flex-col gap-1 rounded-lg bg-zinc-900/60 p-2.5 border border-zinc-800/80">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-zinc-100">
                      • {p.title}
                    </span>
                    <span className="rounded bg-purple-950/70 border border-purple-800/50 px-1.5 py-0.2 text-[10px] font-mono text-purple-300">
                      {p.category}
                    </span>
                  </div>
                  <span className="text-zinc-400 text-[10px] sm:text-[11px]">
                    {p.tagline}
                  </span>

                  {/* Interactive clickable links */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 mt-0.5 border-t border-zinc-800/50 font-mono text-[10px] sm:text-[11px]">
                    <a
                      href={`/projects/${p.id}`}
                      className="inline-flex items-center gap-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 transition-colors hover:text-purple-200"
                    >
                      <span>[Architecture & Case Study]</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>

                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 transition-colors hover:text-emerald-200"
                      >
                        <Globe className="h-3 w-3" />
                        <span>[Live Web App ↗]</span>
                      </a>
                    )}

                    {p.apkUrl && (
                      <a
                        href={p.apkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 transition-colors hover:text-cyan-200"
                      >
                        <Download className="h-3 w-3" />
                        <span>[Download APK ⤓]</span>
                      </a>
                    )}

                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-2 py-0.5 transition-colors hover:text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>[GitHub]</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ),
        });
        break;

      case "skills":
        newLines.push({
          type: "output",
          content: (
            <div className="flex flex-col gap-1 text-[11px] sm:text-xs">
              {skillCategories.map((c) => (
                <div key={c.title}>
                  <span className="text-purple-300 font-semibold">{c.title}:</span>{" "}
                  <span className="text-zinc-400">
                    {c.skills.map((s) => s.name).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          ),
        });
        break;

      case "contact":
        newLines.push({
          type: "output",
          content: (
            <div className="flex flex-col gap-1 text-[11px] sm:text-xs">
              <div><span className="text-purple-300 font-semibold">Email:</span> {personalInfo.email}</div>
              <div>
                <span className="text-purple-300 font-semibold">Phone:</span>{" "}
                <span className="font-mono text-zinc-400">+91 70196 •••••</span>{" "}
                <span className="text-[10px] text-zinc-500">(Type &apos;phone&apos; to unmask, or click Reveal in Contact)</span>
              </div>
              <div><span className="text-purple-300 font-semibold">LinkedIn:</span> {personalInfo.linkedin}</div>
              <div><span className="text-purple-300 font-semibold">GitHub:</span> {personalInfo.github}</div>
            </div>
          ),
        });
        break;

      case "phone":
      case "reveal phone":
        newLines.push({
          type: "output",
          content: (
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-200 font-mono">
              <span className="text-emerald-400 font-bold">Direct Line:</span>
              <a
                href={["tel:+91", "70196", "13040"].join("")}
                className="text-purple-300 hover:underline font-semibold"
              >
                {["+91", "70196", "13040"].join(" ")}
              </a>
              <span className="text-[10px] text-zinc-500">(WhatsApp / Voice)</span>
            </div>
          ),
        });
        break;

      case "cat resume":
      case "cat resume.txt":
      case "resume":
        newLines.push({
          type: "output",
          content: `Shri Ram A U | B.Tech CSE (Presidency University Bangalore, CGPA: 8.20)\nRole: AI Solutions Developer Intern @ Saina Human AI\nKey Projects: Intent (Edge-AI Notification Firewall - 3.68ms warm inference), Garment ERP (Multi-Tenant PostgreSQL RLS), Blockchain Certs (Sepolia)\nAward: 2nd Place / 50+ Teams (Project Exhibition, Nov 2025)\nTarget: 6-Month Engineering Internship (Jan-Jun 2027) with PPO pathways\nDirect: ${personalInfo.email} | Phone: Available upon request in Contact section\nResume: Downloadable at /resume.pdf`,
        });
        break;

      case "date":
        newLines.push({
          type: "output",
          content: new Date().toUTCString(),
        });
        break;

      case "clear":
        setHistory([]);
        return;

      case "sudo":
      case "sudo su":
        newLines.push({
          type: "error",
          content: `Permission denied: visitor is not in the sudoers file. This incident will be reported to Shri Ram.`,
        });
        break;

      default:
        newLines.push({
          type: "error",
          content: `command not found: "${cmd}". Type 'help' for available commands or 'projects' to view projects.`,
        });
        break;
    }

    setHistory((prev) => [...prev, ...newLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <section id="terminal" className="py-10 sm:py-14 md:py-16 border-t border-zinc-200/60 dark:border-zinc-800/80 print:hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          number="05"
          badge="Interactive Console"
          title="Developer Terminal"
          description="A working shell for quick inspection. Type commands or tap the quick pills below."
        />

        {/* Quick Command Pills for Mobile / Fast access */}
        <div className="mx-auto max-w-4xl mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
            Quick run:
          </span>
          {quickCommands.map((q) => (
            <button
              key={q}
              onClick={() => handleCommand(q)}
              className="shrink-0 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[11px] text-zinc-700 transition-colors hover:border-purple-500 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-purple-400 dark:hover:text-purple-300"
            >
              ${q}
            </button>
          ))}
        </div>

        {/* macOS Terminal Window */}
        <div
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
          className="mx-auto max-w-4xl cursor-text overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-700/80 bg-zinc-950 text-zinc-300 shadow-2xl font-mono text-xs sm:text-sm"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-3 sm:px-4 py-2.5 sm:py-3 select-none">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 font-medium">
              <TerminalIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>shriram@terminal:~</span>
            </div>

            <div className="text-[10px] sm:text-[11px] text-zinc-500">zsh</div>
          </div>

          {/* Terminal Output Body */}
          <div
            ref={terminalBodyRef}
            className="p-3.5 sm:p-5 max-h-72 sm:max-h-96 overflow-y-auto flex flex-col gap-2"
          >
            {history.map((line, idx) => (
              <div key={idx} className="leading-relaxed whitespace-pre-wrap break-words">
                {line.type === "input" && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-400">
                    <span className="text-purple-400 shrink-0">guest@shriram:~$</span>
                    <span className="text-zinc-100">{line.content}</span>
                  </div>
                )}
                {line.type === "output" && (
                  <div className="text-zinc-300 pl-2 sm:pl-4">{line.content}</div>
                )}
                {line.type === "error" && (
                  <div className="text-rose-400 pl-2 sm:pl-4">{line.content}</div>
                )}
                {line.type === "system" && (
                  <div className="text-zinc-500 text-[11px] sm:text-xs italic">{line.content}</div>
                )}
              </div>
            ))}

            {/* Input Row */}
            <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
              <span className="text-purple-400 shrink-0">guest@shriram:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-zinc-100 focus:outline-hidden font-mono caret-purple-400 text-base sm:text-xs"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
