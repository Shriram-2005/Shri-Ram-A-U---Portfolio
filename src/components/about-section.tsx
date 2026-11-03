"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/data/portfolio-data";
import {
  Cpu,
  Gauge,
  GraduationCap,
  Code2,
  Workflow,
  CheckCircle,
} from "lucide-react";

const engineeringPrinciples = [
  {
    icon: Gauge,
    title: "Performance Is a Core Feature",
    description:
      "Latency directly dictates user trust. I obsess over minimizing database round-trips, eliminating rendering bottlenecks, and optimizing bundle weight.",
  },
  {
    icon: Cpu,
    title: "Determinism & Architectural Rigor",
    description:
      "Resilient systems are born from simple, isolated abstractions. I favor clear contracts, idempotency, structured telemetry, and predictable state transitions.",
  },
  {
    icon: Workflow,
    title: "Full-Lifecycle Product Craft",
    description:
      "A great system balances backend throughput with refined UI interactions. I build end-to-end solutions that look effortless and scale reliably.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          number="01"
          badge="Background"
          title="Engineering systems with depth and precision."
          description="A quick look into my technical philosophy, background, and what drives my work."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Narrative / Bio Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              I am a software engineer focused on building robust, high-concurrency systems and responsive web applications.
              My work spans from low-level data synchronization pipelines and distributed message queues to hyper-polished frontend user interfaces.
            </p>
            <p>
              Over the past several years, I have worked across the modern engineering stack—designing REST & gRPC APIs, optimizing PostgreSQL and Redis query patterns, and shipping complex web apps with Next.js, TypeScript, and Tailwind CSS.
            </p>
            <p>
              I believe that great software is never accidental: it requires disciplined architecture, rigorous type safety, continuous automated testing, and obsessive attention to user experience.
            </p>

            {/* Principles cards */}
            <div className="mt-4 flex flex-col gap-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-zinc-900 dark:text-zinc-200 font-mono">
                Core Engineering Tenets
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {engineeringPrinciples.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Education & Info Sidebar Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Education Card */}
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  <GraduationCap className="h-4 w-4" />
                  <span>Academic Foundation</span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {edu.degree}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span>{edu.institution}</span>
                  <span>•</span>
                  <span>{edu.period}</span>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800/80">
                  {edu.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <CheckCircle className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Fact / Philosophy Card */}
            <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-zinc-50 to-purple-50/30 p-6 dark:border-zinc-800 dark:from-zinc-900/60 dark:to-purple-950/20">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                <Code2 className="h-4 w-4" />
                <span>Daily Toolkit Mindset</span>
              </div>
              <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                &ldquo;I prefer shipping small, verifiable, and observable units of software rather than sprawling rewrites. Clean Git history, pragmatic typing, and comprehensive tests are non-negotiable.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
