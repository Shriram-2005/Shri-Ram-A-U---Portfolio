"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, KeyRound, ArrowRight, ArrowLeft, Clock, RefreshCw } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Auto-send login OTP on mount
  useEffect(() => {
    async function triggerInitialOtp() {
      try {
        await fetch("/api/admin/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purpose: "login" }),
        });
      } catch (err) {
        console.error("Initial OTP send note:", err);
      }
    }
    triggerInitialOtp();
  }, []);

  // 30-second countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      const res = await fetch("/api/admin/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "login" }),
      });
      const data = await res.json();
      if (data.success) {
        setCountdown(30);
      } else {
        setError(data.error || "Failed to resend code.");
      }
    } catch {
      setError("Network error resending code.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/aus-logo.png"
              alt="AUS Logo"
              width={120}
              height={45}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Passwordless Admin Access
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            30-Second One-Time Code Verification
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-mono">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Owner Verification</span>
            </div>

            {/* 30-Second Countdown Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                countdown > 0
                  ? "bg-amber-950/70 border border-amber-500/50 text-amber-300 animate-pulse"
                  : "bg-rose-950/70 border border-rose-500/50 text-rose-300"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{countdown > 0 ? `${countdown}s` : "Expired"}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed mb-5">
            A 6-digit access code has been dispatched to your verified email. No username or password required.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-start gap-2">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                6-Digit Access Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  autoFocus
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-10 pr-4 py-3 text-lg font-mono font-bold tracking-widest text-center text-white placeholder:text-zinc-700 focus:border-purple-500 focus:outline-hidden"
                  placeholder="000000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Verifying Access..." : "Verify & Enter CMS"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Didn&apos;t receive code?</span>
            <button
              onClick={handleResend}
              disabled={resending || countdown > 20}
              className="inline-flex items-center gap-1 font-mono text-purple-400 hover:text-purple-300 disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />
              <span>Resend Code</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] font-mono text-zinc-600">
          Supabase PostgreSQL | 30s Time-Based One-Time Password
        </div>
      </div>
    </div>
  );
}
