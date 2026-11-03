"use client";

import React, { useState, useRef, useEffect } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { personalInfo, featuredProjects, skillCategories } from "@/data/portfolio-data";
import { Terminal as TerminalIcon } from "lucide-react";

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
      content: "Welcome to Shriram's Interactive Shell v2.4 (x86_64-apple-darwin)",
    },
    {
      type: "system",
      content: "Type 'help' to inspect commands or tap any quick-command pill below.",
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    setCommandHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [{ type: "input", content: rawCmd }];

    switch (cmd) {
      case "help":
        newLines.push({
          type: "output",
          content: (
            <div className="flex flex-col gap-1 text-[11px] sm:text-xs">
              <span className="font-bold text-purple-400">Available commands:</span>
              <span>  <span className="text-zinc-200 font-semibold">bio</span>          - Learn about Shri Ram</span>
              <span>  <span className="text-zinc-200 font-semibold">projects</span>     - List key engineering projects</span>
              <span>  <span className="text-zinc-200 font-semibold">skills</span>       - Inspect tech competencies</span>
              <span>  <span className="text-zinc-200 font-semibold">contact</span>      - Output communication channels</span>
              <span>  <span className="text-zinc-200 font-semibold">cat resume</span>   - Print resume highlights</span>
              <span>  <span className="text-zinc-200 font-semibold">date</span>         - Display current timestamp</span>
              <span>  <span className="text-zinc-200 font-semibold">clear</span>        - Clear terminal screen</span>
              <span>  <span className="text-zinc-200 font-semibold">sudo</span>         - Administrative access</span>
            </div>
          ),
        });
        break;

      case "bio":
        newLines.push({
          type: "output",
          content: `${personalInfo.name} — ${personalInfo.role}. ${personalInfo.shortBio}`,
        });
        break;

      case "projects":
        newLines.push({
          type: "output",
          content: (
            <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs">
              {featuredProjects.map((p) => (
                <div key={p.id} className="flex flex-col">
                  <span className="font-bold text-zinc-100">
                    • {p.title} <span className="text-purple-400">[{p.category}]</span>
                  </span>
                  <span className="text-zinc-400 text-[10px] sm:text-[11px] pl-2 sm:pl-3">{p.tagline}</span>
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
          content: `Email: ${personalInfo.email}\nPhone: ${personalInfo.phone || "+91 70196 13040"}\nLinkedIn: ${personalInfo.linkedin}\nGitHub: ${personalInfo.github}`,
        });
        break;

      case "cat resume":
      case "cat resume.txt":
      case "resume":
        newLines.push({
          type: "output",
          content: `Shri Ram A U | B.Tech CSE (Presidency University Bangalore, CGPA: 8.20)\nRole: AI Solutions Developer Intern @ Saina Human AI\nKey Projects: Intent (Edge-AI Notification Firewall - 3.68ms warm inference), Garment ERP (Multi-Tenant PostgreSQL RLS), Blockchain Certs (Sepolia)\nAward: 2nd Place / 50+ Teams (Project Exhibition, Nov 2025)\nTarget: 6-Month Engineering Internship (Jan–Jun 2027) with PPO pathways\nDirect: ${personalInfo.email} | +91 70196 13040\nResume: Downloadable at /resume.pdf`,
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
          content: `command not found: "${cmd}". Type 'help' for available commands.`,
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
    <section id="terminal" className="py-14 sm:py-20 md:py-28 border-t border-zinc-200/60 dark:border-zinc-800/80">
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
          onClick={() => inputRef.current?.focus()}
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
          <div className="p-3.5 sm:p-5 max-h-72 sm:max-h-96 overflow-y-auto flex flex-col gap-2">
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
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
