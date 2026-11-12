"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePortfolio } from "@/context/portfolio-context";
import {
  Terminal as TerminalIcon,
  ArrowUpRight,
  Globe,
  Download,
  ExternalLink,
  ShieldAlert,
  Clock,
  KeyRound,
  RefreshCw,
} from "lucide-react";

interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  content: string | React.ReactNode;
}

type TerminalMode =
  | "normal"
  | "admin_menu"
  | "gate_otp"
  | "change_otp1"
  | "change_old_pass"
  | "change_new_pass"
  | "change_confirm_pass"
  | "change_otp2";

const quickCommands = ["bio", "projects", "skills", "cat resume", "contact", "clear"];

export function TerminalSection() {
  const router = useRouter();
  const { personalInfo, projects: featuredProjects, skillCategories } = usePortfolio();
  const [inputVal, setInputVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("");
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

  // Administrative & Security State
  const [terminalMode, setTerminalMode] = useState<TerminalMode>("normal");
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [tempOldPass, setTempOldPass] = useState<string>("");
  const [tempNewPass, setTempNewPass] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // 30-Second Exact Expiry Timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTerminalMode("normal");
          setTempOldPass("");
          setTempNewPass("");
          // Automatically trigger serverless IMAP cleanup of expired OTP email from Gmail
          fetch("/api/admin/otp/cleanup", { method: "POST" }).catch(() => {});
          setHistory((h) => [
            ...h,
            {
              type: "error",
              content: "[TIMEOUT] 30-second verification window expired. OTP email automatically expunged from Gmail. Request cancelled.",
            },
          ]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

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

  // Smooth scroll internal terminal output without lagging on timer ticks
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history, isProcessing]);

  const isInitialMount = useRef(true);

  // Refocus input strictly after processing actions, never on initial page load to avoid scrolling user down
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isProcessing) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    }
  }, [isProcessing]);

  const isPasswordInput =
    terminalMode === "change_old_pass" ||
    terminalMode === "change_new_pass" ||
    terminalMode === "change_confirm_pass";

  const getPromptPrefix = () => {
    switch (terminalMode) {
      case "admin_menu":
        return "admin-menu> ";
      case "gate_otp":
        return `[terminal-otp (${otpCountdown}s)]> `;
      case "change_otp1":
        return `[otp-1 (${otpCountdown}s)]> `;
      case "change_old_pass":
        return "current-keyword: ";
      case "change_new_pass":
        return "new-keyword: ";
      case "change_confirm_pass":
        return "confirm-new-keyword: ";
      case "change_otp2":
        return `[confirm-otp (${otpCountdown}s)]> `;
      default:
        return "guest@shriram:~$ ";
    }
  };

  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    if (!isPasswordInput) {
      setCommandHistory((prev) => [...prev, rawCmd]);
      setHistoryIndex(-1);
    }

    // Record entered line in terminal history (masked if password input)
    const maskedContent = isPasswordInput ? "•".repeat(trimmed.length) : rawCmd;
    const newLines: TerminalLine[] = [{ type: "input", content: maskedContent }];

    const lower = trimmed.toLowerCase();

    // -------------------------------------------------------------
    // STATE: ADMIN MENU (continue | change secret word | exit)
    // -------------------------------------------------------------
    if (terminalMode === "admin_menu") {
      if (lower === "1" || lower === "continue") {
        newLines.push({
          type: "output",
          content: "[STEP 1/2] Dispatching 30-second gateway access code to shriram2005au@gmail.com...",
        });
        setHistory((prev) => [...prev, ...newLines]);
        setIsProcessing(true);
        setProcessingText("Dispatching 30-second gateway access code via SMTP...");

        try {
          const res = await fetch("/api/admin/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ purpose: "terminal_gate" }),
          });
          const data = await res.json();

          if (data.success) {
            setOtpCountdown(30);
            setTerminalMode("gate_otp");
            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content: (
                  <div className="flex flex-col gap-1 text-amber-600 dark:text-amber-300">
                    <div className="flex items-center gap-2 font-bold">
                      <Clock className="h-3.5 w-3.5 animate-spin" />
                      <span>[DISPATCHED] 30-Second Gateway Code sent via SMTP to shriram2005au@gmail.com!</span>
                    </div>
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
                      Enter the 6-digit code below within 30 seconds to unlock the Admin Login Portal:
                    </div>
                  </div>
                ),
              },
            ]);
          } else {
            setTerminalMode("normal");
            setHistory((prev) => [
              ...prev,
              { type: "error", content: `[ERROR] Failed to send gateway code: ${data.error || "SMTP failure"}` },
            ]);
          }
        } catch {
          setTerminalMode("normal");
          setHistory((prev) => [
            ...prev,
            { type: "error", content: "[ERROR] Network error dispatching gateway code." },
          ]);
        } finally {
          setIsProcessing(false);
          setProcessingText("");
        }
        return;
      }

      if (lower === "3" || lower === "exit" || lower === "quit" || lower === "cancel") {
        newLines.push({
          type: "output",
          content: "Exited administrative console. Returned to guest shell.",
        });
        setTerminalMode("normal");
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      if (lower === "2" || lower === "change" || lower === "change secret word") {
        newLines.push({
          type: "output",
          content: "[STEP 1/2] Initiating 2-Step Verification for Secret Keyword change...",
        });
        newLines.push({
          type: "system",
          content: "Dispatching 30-second authorization OTP to shriram2005au@gmail.com via SMTP...",
        });
        setHistory((prev) => [...prev, ...newLines]);
        setIsProcessing(true);
        setProcessingText("Dispatching 30-second authorization OTP via SMTP...");

        try {
          const res = await fetch("/api/admin/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ purpose: "request_change" }),
          });
          const data = await res.json();

          if (data.success) {
            setOtpCountdown(30);
            setTerminalMode("change_otp1");
            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content: (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300 font-bold">
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    <span>[DISPATCHED] A 6-digit OTP has been sent. You have exactly 30 seconds to enter it.</span>
                  </div>
                ),
              },
            ]);
          } else {
            setTerminalMode("normal");
            setHistory((prev) => [
              ...prev,
              { type: "error", content: `[ERROR] Failed to send OTP: ${data.error || "SMTP failure"}` },
            ]);
          }
        } catch {
          setTerminalMode("normal");
          setHistory((prev) => [
            ...prev,
            { type: "error", content: "[ERROR] Network error dispatching OTP." },
          ]);
        } finally {
          setIsProcessing(false);
          setProcessingText("");
        }
        return;
      }

      newLines.push({
        type: "error",
        content: "Invalid option. Type 'continue' to unlock login, 'change' to update secret word, or 'exit'.",
      });
      setHistory((prev) => [...prev, ...newLines]);
      return;
    }

    // -------------------------------------------------------------
    // STATE: GATE OTP (Unlock access to /admin/login)
    // -------------------------------------------------------------
    if (terminalMode === "gate_otp") {
      if (lower === "cancel" || lower === "exit") {
        setOtpCountdown(0);
        setTerminalMode("normal");
        newLines.push({ type: "output", content: "Gateway authorization aborted. Returned to guest shell." });
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      setIsProcessing(true);
      setProcessingText("Verifying 6-digit gateway code and unlocking portal...");

      try {
        const res = await fetch("/api/admin/terminal/verify-gate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp: trimmed }),
        });
        const data = await res.json();

        if (data.success) {
          setOtpCountdown(0);
          setTerminalMode("normal");
          newLines.push({
            type: "output",
            content: (
              <div className="rounded-lg border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-emerald-800 dark:text-emerald-300 flex flex-col gap-1">
                <div className="font-bold flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4" />
                  <span>[GATEWAY UNLOCKED] Terminal authorization verified! Redirecting to Admin Login Portal (/admin/login)...</span>
                </div>
                <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
                  Temporary 15-minute gate pass granted. Transferring now...
                </div>
              </div>
            ),
          });
          setHistory((prev) => [...prev, ...newLines]);
          router.push("/admin/login");
          return;
        } else {
          newLines.push({
            type: "error",
            content: `[ERROR] ${data.error || "Invalid gateway code."} Please re-enter code or type 'cancel'.`,
          });
        }
      } catch {
        newLines.push({ type: "error", content: "[ERROR] Failed to verify gateway code." });
      } finally {
        setIsProcessing(false);
        setProcessingText("");
      }

      setHistory((prev) => [...prev, ...newLines]);
      return;
    }

    // -------------------------------------------------------------
    // STATE: CHANGE OTP 1 (Validate authorization to change)
    // -------------------------------------------------------------
    if (terminalMode === "change_otp1") {
      if (lower === "cancel" || lower === "exit") {
        setOtpCountdown(0);
        setTerminalMode("normal");
        newLines.push({ type: "output", content: "Secret keyword update aborted." });
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      setIsProcessing(true);
      setProcessingText("Verifying authorization OTP...");

      try {
        const res = await fetch("/api/admin/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purpose: "request_change", otp: trimmed }),
        });
        const data = await res.json();

        if (data.valid) {
          setOtpCountdown(0);
          setTerminalMode("change_old_pass");
          newLines.push({
            type: "output",
            content: "[OTP 1 VERIFIED] Authorization confirmed. Enter your CURRENT secret keyword:",
          });
        } else {
          newLines.push({
            type: "error",
            content: `[ERROR] ${data.error || "Invalid OTP."} Try again or type 'cancel'.`,
          });
        }
      } catch {
        newLines.push({ type: "error", content: "[ERROR] Failed to verify OTP." });
      } finally {
        setIsProcessing(false);
        setProcessingText("");
      }

      setHistory((prev) => [...prev, ...newLines]);
      return;
    }

    // -------------------------------------------------------------
    // STATE: CHANGE OLD PASSWORD
    // -------------------------------------------------------------
    if (terminalMode === "change_old_pass") {
      if (lower === "cancel" || lower === "exit") {
        setTerminalMode("normal");
        newLines.push({ type: "output", content: "Protocol aborted." });
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      setIsProcessing(true);
      setProcessingText("Verifying current secret keyword...");

      try {
        const res = await fetch("/api/admin/secret-word/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: trimmed }),
        });
        const data = await res.json();

        if (data.valid) {
          setTempOldPass(trimmed);
          setTerminalMode("change_new_pass");
          newLines.push({
            type: "output",
            content: "[CURRENT PASSWORD MATCHED] Enter your NEW secret keyword (min 4 characters):",
          });
        } else {
          setTerminalMode("normal");
          newLines.push({
            type: "error",
            content: "[ERROR] Current secret keyword does not match. Update protocol terminated.",
          });
        }
      } catch {
        setTerminalMode("normal");
        newLines.push({ type: "error", content: "[ERROR] Verification error." });
      } finally {
        setIsProcessing(false);
        setProcessingText("");
      }

      setHistory((prev) => [...prev, ...newLines]);
      return;
    }

    // -------------------------------------------------------------
    // STATE: CHANGE NEW PASSWORD
    // -------------------------------------------------------------
    if (terminalMode === "change_new_pass") {
      if (lower === "cancel" || lower === "exit") {
        setTerminalMode("normal");
        newLines.push({ type: "output", content: "Protocol aborted." });
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      if (trimmed.length < 4) {
        newLines.push({
          type: "error",
          content: "[ERROR] Secret keyword must be at least 4 characters long. Try again:",
        });
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      setTempNewPass(trimmed);
      setTerminalMode("change_confirm_pass");
      newLines.push({
        type: "output",
        content: "Confirm your NEW secret keyword:",
      });
      setHistory((prev) => [...prev, ...newLines]);
      return;
    }

    // -------------------------------------------------------------
    // STATE: CHANGE CONFIRM PASSWORD & DISPATCH OTP 2
    // -------------------------------------------------------------
    if (terminalMode === "change_confirm_pass") {
      if (lower === "cancel" || lower === "exit") {
        setTerminalMode("normal");
        newLines.push({ type: "output", content: "Protocol aborted." });
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      if (trimmed !== tempNewPass) {
        setTerminalMode("normal");
        setTempOldPass("");
        setTempNewPass("");
        newLines.push({
          type: "error",
          content: "[ERROR] New passwords do not match. Update protocol cancelled.",
        });
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      newLines.push({
        type: "output",
        content: "[PASSWORDS MATCHED] Proceeding to final security confirmation.",
      });
      newLines.push({
        type: "system",
        content: "[STEP 2/2] Dispatching confirmation OTP to shriram2005au@gmail.com (30s expiry)...",
      });
      setHistory((prev) => [...prev, ...newLines]);

      setIsProcessing(true);
      setProcessingText("Dispatching final 30-second confirmation OTP via SMTP...");

      try {
        const res = await fetch("/api/admin/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purpose: "confirm_change" }),
        });
        const data = await res.json();

        if (data.success) {
          setOtpCountdown(30);
          setTerminalMode("change_otp2");
          setHistory((prev) => [
            ...prev,
            {
              type: "output",
              content: (
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Clock className="h-3.5 w-3.5 animate-spin" />
                  <span>[DISPATCHED] Final 30-second confirmation OTP sent to your email. Enter code to commit:</span>
                </div>
              ),
            },
          ]);
        } else {
          setTerminalMode("normal");
          setHistory((prev) => [
            ...prev,
            { type: "error", content: `[ERROR] Failed to send confirmation OTP: ${data.error || "SMTP failure"}` },
          ]);
        }
      } catch {
        setTerminalMode("normal");
        setHistory((prev) => [
          ...prev,
          { type: "error", content: "[ERROR] Network error dispatching confirmation OTP." },
        ]);
      } finally {
        setIsProcessing(false);
        setProcessingText("");
      }
      return;
    }

    // -------------------------------------------------------------
    // STATE: CHANGE OTP 2 (Final confirmation to commit new password)
    // -------------------------------------------------------------
    if (terminalMode === "change_otp2") {
      if (lower === "cancel" || lower === "exit") {
        setOtpCountdown(0);
        setTerminalMode("normal");
        setTempOldPass("");
        setTempNewPass("");
        newLines.push({ type: "output", content: "Protocol aborted." });
        setHistory((prev) => [...prev, ...newLines]);
        return;
      }

      setIsProcessing(true);
      setProcessingText("Validating confirmation OTP and committing new secret keyword...");

      try {
        const res = await fetch("/api/admin/secret-word/change", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: tempOldPass,
            newPassword: tempNewPass,
            confirmPassword: tempNewPass,
            otp: trimmed,
          }),
        });
        const data = await res.json();

        if (data.success) {
          setOtpCountdown(0);
          setTerminalMode("normal");
          setTempOldPass("");
          setTempNewPass("");
          newLines.push({
            type: "output",
            content: (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 text-emerald-300 flex flex-col gap-1">
                <div className="font-bold flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4" />
                  <span>[SUCCESS] Secret keyword permanently updated!</span>
                </div>
                <div className="text-[11px] text-zinc-300">
                  Your new secret keyword is now active. Use it on your next terminal session.
                </div>
              </div>
            ),
          });
        } else {
          newLines.push({
            type: "error",
            content: `[ERROR] ${data.error || "Failed to commit changes."} Try again or type 'cancel'.`,
          });
        }
      } catch {
        newLines.push({ type: "error", content: "[ERROR] Network error saving new secret keyword." });
      } finally {
        setIsProcessing(false);
        setProcessingText("");
      }

      setHistory((prev) => [...prev, ...newLines]);
      return;
    }

    // -------------------------------------------------------------
    // STATE: NORMAL COMMAND SHELL
    // -------------------------------------------------------------
    const projectMatch = featuredProjects.find((p) => {
      if (lower === p.id.toLowerCase() || lower === `project ${p.id.toLowerCase()}` || lower === `open ${p.id.toLowerCase()}`) {
        return true;
      }
      if (lower === "intent" && p.id === "intent-firewall") return true;
      if (lower === "garment" && p.id === "garment-erp") return true;
      if (lower === "blockchain" && p.id === "blockchain-verification") return true;
      if (lower === "logistics" && p.id === "logistics-portal") return true;
      if (lower === "ielts" && p.id === "ielts-platform") return true;
      if ((lower === "audio" || lower === "music") && p.id === "audio-streaming") return true;
      if (lower.startsWith("project ")) {
        const sub = lower.replace("project ", "").trim();
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
                  <span>[Repository]</span>
                </a>
              )}
            </div>
          </div>
        ),
      });
      setHistory((prev) => [...prev, ...newLines]);
      return;
    }

    switch (lower) {
      case "help":
        newLines.push({
          type: "output",
          content: (
            <div className="flex flex-col gap-1 text-[11px] sm:text-xs">
              <span className="text-zinc-400 font-semibold mb-1">Standard Shell Utilities:</span>
              <div><span className="text-purple-300 font-bold">bio</span> - Executive engineering background & focus</div>
              <div><span className="text-purple-300 font-bold">projects</span> - View all featured systems with deep links</div>
              <div><span className="text-purple-300 font-bold">skills</span> - Full engineering toolbox & proficiency</div>
              <div><span className="text-purple-300 font-bold">cat resume</span> - Text version of candidate evaluation packet</div>
              <div><span className="text-purple-300 font-bold">contact</span> - Direct contact channels & email</div>
              <div><span className="text-purple-300 font-bold">clear</span> - Reset terminal window</div>
            </div>
          ),
        });
        break;

      case "bio":
        newLines.push({
          type: "output",
          content: `${personalInfo.name} | ${personalInfo.role}\n${personalInfo.shortBio}`,
        });
        break;

      case "projects":
        newLines.push({
          type: "output",
          content: (
            <div className="flex flex-col gap-2.5 text-[11px] sm:text-xs">
              <span className="text-purple-300 font-semibold">Featured Production Systems:</span>
              {featuredProjects.map((p, idx) => (
                <div key={p.id} className="border-l-2 border-purple-500/50 pl-2.5 py-0.5">
                  <div className="font-bold text-zinc-100 flex items-center gap-2">
                    <span>{idx + 1}. {p.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">[{p.category}]</span>
                  </div>
                  <div className="text-zinc-400 text-[10px] sm:text-[11px] mt-0.5">{p.tagline}</div>
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
            <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs">
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
                <span className="font-mono text-zinc-400">+91 70196 •••••</span>
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
          content: `Shri Ram A U | B.Tech CSE (Presidency University Bangalore, CGPA: 8.20)\nRole: AI Solutions Developer Intern @ Saina Human AI\nKey Projects: Intent (Edge-AI Notification Firewall - 3.68ms warm inference), Garment ERP (Multi-Tenant PostgreSQL RLS), Blockchain Certs (Sepolia)\nAward: 2nd Place / 50+ Teams (Project Exhibition, Nov 2025)\nTarget: 6-Month Engineering Internship (Jan-Jun 2027) with PPO pathways\nDirect: ${personalInfo.email}\nResume: Downloadable at /resume.pdf`,
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
        // Input sanity check before querying security endpoint (anti-injection & anti-DoS)
        if (
          trimmed.length >= 3 &&
          trimmed.length <= 64 &&
          !trimmed.includes(" ") &&
          !/[<>{}\\\/;&|]/.test(trimmed)
        ) {
          setIsProcessing(true);
          setProcessingText("Verifying administrative credentials...");

          try {
            const res = await fetch("/api/admin/secret-word/validate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keyword: trimmed }),
            });
            const data = await res.json();

            if (res.status === 429) {
              newLines.push({
                type: "error",
                content: (
                  <div className="rounded-lg border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 p-2.5 text-rose-700 dark:text-rose-300 text-xs font-mono">
                    [SECURITY LOCKOUT] {data.error || "Too many failed attempts. Terminal temporarily locked."}
                  </div>
                ),
              });
              setHistory((prev) => [...prev, ...newLines]);
              return;
            }

            if (data.valid) {
              setTerminalMode("admin_menu");
              newLines.push({
                type: "output",
                content: (
                  <div className="rounded-xl border border-purple-300 dark:border-purple-500/50 bg-purple-50 dark:bg-purple-950/40 p-4 text-xs font-mono flex flex-col gap-2.5 shadow-xl transition-colors">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider border-b border-purple-200 dark:border-purple-800/60 pb-2">
                      <ShieldAlert className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>[SECURITY PROTOCOL ACTIVATED] Administrative Access Unlocked</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-200">
                      Secret keyword recognized. Access level: Portfolio Owner &amp; Administrator.
                    </p>
                    <div className="flex flex-col gap-1.5 text-zinc-700 dark:text-zinc-300 pt-1">
                      <div>
                        <strong className="text-purple-700 dark:text-purple-300 font-bold">[1] continue</strong>
                        <span className="text-zinc-600 dark:text-zinc-400"> - 30s OTP authorization to unlock Admin Login Portal</span>
                      </div>
                      <div>
                        <strong className="text-purple-700 dark:text-purple-300 font-bold">[2] change secret word</strong>
                        <span className="text-zinc-600 dark:text-zinc-400"> - Update secret keyword (2-step OTP validation)</span>
                      </div>
                      <div>
                        <strong className="text-purple-700 dark:text-purple-300 font-bold">[3] exit</strong>
                        <span className="text-zinc-600 dark:text-zinc-400"> - Return to standard terminal shell</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-purple-700 dark:text-purple-300/80 pt-1 border-t border-purple-200 dark:border-purple-900/50">
                      Type <span className="font-bold text-zinc-900 dark:text-white">&apos;continue&apos;</span>, <span className="font-bold text-zinc-900 dark:text-white">&apos;change&apos;</span>, or <span className="font-bold text-zinc-900 dark:text-white">&apos;exit&apos;</span>:
                    </div>
                  </div>
                ),
              });
              setHistory((prev) => [...prev, ...newLines]);
              return;
            }
          } catch {
          } finally {
            setIsProcessing(false);
            setProcessingText("");
          }
        }

        newLines.push({
          type: "error",
          content: `command not found: "${lower}". Type 'help' for available commands or 'projects' to view projects.`,
        });
        break;
    }

    setHistory((prev) => [...prev, ...newLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isProcessing) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      const val = inputVal;
      setInputVal("");
      handleCommand(val);
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
        <div className="mx-auto max-w-4xl mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
            Quick run:
          </span>
          {quickCommands.map((q) => (
            <button
              key={q}
              onClick={() => handleCommand(q)}
              disabled={terminalMode !== "normal"}
              className="shrink-0 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[11px] text-zinc-700 transition-colors hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-purple-400 dark:hover:text-purple-300"
            >
              ${q}
            </button>
          ))}
        </div>

        {/* macOS Terminal Window */}
        <div
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
          className="mx-auto max-w-4xl cursor-text overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 shadow-2xl font-mono text-xs sm:text-sm transition-colors"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/90 dark:bg-zinc-900/90 px-3 sm:px-4 py-2.5 sm:py-3 select-none transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium min-w-0 px-1">
              <TerminalIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span className="truncate max-w-[150px] xs:max-w-[220px] sm:max-w-none">
                {terminalMode === "normal" ? "shriram@terminal:~" : "shriram@terminal:[SECURITY ACCESS]"}
              </span>
            </div>

            <div className="text-[10px] sm:text-[11px] text-zinc-500 shrink-0">
              {terminalMode === "normal" ? "zsh" : "admin-shell"}
            </div>
          </div>

          {/* Terminal Output Body */}
          <div
            ref={terminalBodyRef}
            className="p-3.5 sm:p-5 max-h-72 sm:max-h-96 overflow-y-auto flex flex-col gap-2"
          >
            {history.map((line, idx) => (
              <div key={idx} className="leading-relaxed whitespace-pre-wrap break-words">
                {line.type === "input" && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-600 dark:text-zinc-400">
                    <span className="text-purple-600 dark:text-purple-400 shrink-0 font-bold">guest@shriram:~$</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{line.content}</span>
                  </div>
                )}
                {line.type === "output" && (
                  <div className="text-zinc-800 dark:text-zinc-300 pl-2 sm:pl-4">{line.content}</div>
                )}
                {line.type === "error" && (
                  <div className="text-rose-600 dark:text-rose-400 pl-2 sm:pl-4">{line.content}</div>
                )}
                {line.type === "system" && (
                  <div className="text-zinc-500 dark:text-zinc-500 text-[11px] sm:text-xs italic">{line.content}</div>
                )}
              </div>
            ))}

            {/* Live 30-Second Security Timer Bar */}
            {otpCountdown > 0 && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs animate-pulse">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-bold">EXACT 30-SECOND TIMER ACTIVE</span>
                </div>
                <div className="font-mono font-extrabold text-sm text-amber-900 dark:text-amber-200">
                  {otpCountdown}s remaining
                </div>
              </div>
            )}

            {/* Input Row or Processing Loading Indicator */}
            {isProcessing ? (
              <div className="flex items-center gap-2 pt-2 pb-1 text-purple-600 dark:text-purple-400 font-mono text-xs animate-pulse select-none">
                <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
                <span className="font-semibold">{processingText || "Processing request, please wait..."}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
                <span className="text-purple-600 dark:text-purple-400 shrink-0 font-bold">
                  {getPromptPrefix()}
                </span>
                <input
                  ref={inputRef}
                  type={isPasswordInput ? "password" : "text"}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-hidden font-mono caret-purple-600 dark:caret-purple-400 text-base sm:text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={
                    terminalMode === "gate_otp" ||
                    terminalMode === "change_otp1" ||
                    terminalMode === "change_otp2"
                      ? "Enter 6-digit OTP from email..."
                      : isPasswordInput
                      ? "Type password and press Enter..."
                      : ""
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
