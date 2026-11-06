"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { personalInfo, socialLinks } from "@/data/portfolio-data";
import { useToast } from "@/components/ui/toast";
import {
  Mail,
  Copy,
  Check,
  Send,
  MessageSquare,
  MapPin,
  Clock,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export function ContactSection() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    toast("Email copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast("Please complete all required fields.", "error");
      return;
    }

    setSubmitting(true);
    setSubmitted(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver message.");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast("Message delivered directly to Shri Ram's inbox!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-10 sm:py-14 md:py-16 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          number="06"
          badge="Direct Contact"
          title="Let's build something exceptional together."
          description="Have an internship role, project, or technical question? Feel free to reach out directly."
        />

        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12">
          {/* Direct channels & info */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
            {/* Quick copy email box */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 sm:p-7 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Direct Email
              </span>
              <div className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono break-all">
                {personalInfo.email}
              </div>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                Guaranteed reply within 24 hours. Feel free to copy or send directly.
              </p>

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "Copied to Clipboard" : "Copy Email"}</span>
                </button>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${personalInfo.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <Mail className="h-4 w-4 text-purple-500" />
                  <span>Open in Gmail</span>
                </a>
              </div>
            </div>

            {/* Location & Timezone Details */}
            <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Location & Schedule
              </h4>
              <div className="mt-3 flex flex-col gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500 shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-500 shrink-0" />
                  <a href="tel:+917019613040" className="hover:underline font-mono">
                    +91 70196 13040
                  </a>
                </div>
                <div className="flex items-start gap-2 leading-relaxed">
                  <Clock className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                  <span>Available for 6-Month Internships (Jan-Jun 2027) with PPO pathways</span>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Connect on Social Platforms
              </span>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-zinc-700"
                  >
                    <span>{s.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white p-5 sm:p-7 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                <MessageSquare className="h-4 w-4" />
                <span>Send a Message</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Your Name <span className="text-purple-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Your Email <span className="text-purple-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Subject / Topic
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. 6-Month Internship / Edge AI Project"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Message <span className="text-purple-500">*</span>
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {formData.message.length} chars
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about the role, project, or technical challenge..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/20 px-3 py-2 text-xs text-purple-700 dark:text-purple-300">
                <ShieldCheck className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                <span>
                  Direct inbox delivery: no desktop mail app required. You can send your message directly from here.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Delivering to Shri Ram...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message Directly</span>
                  </>
                )}
              </button>

              {submitted && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/50 dark:text-emerald-300">
                  <div className="font-semibold mb-0.5">Message delivered successfully!</div>
                  <div>Your inquiry has landed directly in Shri Ram&apos;s mailbox. A response will be sent to your email address within 24 hours.</div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
