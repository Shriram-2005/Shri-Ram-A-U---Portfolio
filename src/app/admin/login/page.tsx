"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ShieldCheck,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Clock,
  RefreshCw,
  Mail,
  Send,
  Lock,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [gateVerified, setGateVerified] = useState<boolean | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Client-side Gate Verification on mount
  useEffect(() => {
    async function checkGate() {
      try {
        const res = await fetch("/api/admin/auth/gate-check");
        if (!res.ok) {
          router.replace("/");
          return;
        }
        const data = await res.json();
        if (!data.passed) {
          router.replace("/");
          return;
        }
        setGateVerified(true);
      } catch {
        router.replace("/");
      }
    }
    checkGate();
  }, [router]);

  // 60-Second Resend Cooldown Countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // 30-Second OTP Validity Timer
  useEffect(() => {
    if (otpExpiry <= 0) return;
    const interval = setInterval(() => {
      setOtpExpiry((prev) => {
        if (prev <= 1) {
          // Automatically trigger serverless IMAP cleanup of expired OTP email from Gmail
          fetch("/api/admin/otp/cleanup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: otp.trim() || undefined }),
          }).catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpiry, otp]);

  const handleSendOtp = async () => {
    if (resendCooldown > 0 || sendingOtp) return;

    setError("");
    setSendingOtp(true);

    try {
      const res = await fetch("/api/admin/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "login" }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtp("");
        setResendCooldown(60); // 60 seconds strict cooldown before resend
        setOtpExpiry(30); // 30 seconds code lifespan
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);
      } else {
        setError(data.error || "Failed to dispatch verification code.");
      }
    } catch {
      setError("Network error dispatching verification code. Please check connection.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent || otp.length < 6) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid or expired code. Please request a new code.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Network error authenticating. Please try again.");
      setLoading(false);
    }
  };

  // If gate check is still verifying, show clean loader
  if (gateVerified === null) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin text-purple-600 mr-2" />
        <span>Verifying terminal gateway credentials...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center px-4 py-16 sm:py-20 relative overflow-hidden transition-colors">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar with Back Button & Theme Toggle */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="w-full max-w-md z-10">
        {/* Branding header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <Image
              src="/aus-logo.png"
              alt="AUS Logo"
              width={120}
              height={45}
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Passwordless Admin Portal
          </h1>
          <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-mono">
            Terminal Gateway Verified | 30s One-Time Code
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/90 p-5 sm:p-8 backdrop-blur-xl shadow-xl transition-colors">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-mono font-medium shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Owner Authenticated</span>
            </div>

            {/* Countdown Badge / Status Badge */}
            {otpSent ? (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shrink-0 ${
                  otpExpiry > 0
                    ? "bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 animate-pulse"
                    : "bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-300"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{otpExpiry > 0 ? `${otpExpiry}s active` : "Expired"}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 text-xs font-mono shrink-0">
                <Clock className="h-3.5 w-3.5" />
                <span>30s Code Window</span>
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-5">
            {otpSent
              ? "A 6-digit access code has been dispatched to your email. Enter the code below to access the CMS."
              : "Click the button below to dispatch a secure 30-second one-time login code to your authorized email address."}
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <span className="font-bold shrink-0">Notice:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Explicit Send OTP Button if not yet sent */}
          {!otpSent ? (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                {sendingOtp ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Dispatching Security Code via SMTP...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Login OTP</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono text-center">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span>Dispatches directly to shriram2005au@gmail.com</span>
              </div>
            </div>
          ) : (
            /* Step 2: Enter OTP Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 mb-2 text-center">
                  Enter 6-Digit Access Code
                </label>
                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    className="w-full rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 px-4 py-3.5 text-2xl font-mono font-bold tracking-[0.4em] sm:tracking-[0.5em] text-center text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-hidden transition-all shadow-inner"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Verifying Access..." : "Verify & Enter CMS"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* 60-Second Cooldown Resend Section */}
              <div className="mt-2 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-zinc-500 dark:text-zinc-400 font-mono text-center sm:text-left">
                  Didn&apos;t receive code?
                </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || resendCooldown > 0}
                  className="inline-flex items-center gap-1 font-mono text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`h-3 w-3 ${sendingOtp ? "animate-spin" : ""}`} />
                  <span>
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : "Resend OTP"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-[11px] font-mono text-zinc-500 dark:text-zinc-500 flex items-center justify-center gap-1.5">
          <Lock className="h-3 w-3" />
          <span>Protected Gateway | 60-second cooldown protection</span>
        </div>
      </div>
    </div>
  );
}
