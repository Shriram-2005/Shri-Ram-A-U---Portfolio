"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { usePortfolio } from "@/context/portfolio-context";
import {
  Cpu,
  Gauge,
  GraduationCap,
  Trophy,
  Workflow,
  CheckCircle,
} from "lucide-react";

const engineeringPrinciples = [
  {
    icon: Gauge,
    title: "Low-Latency & On-Device Autonomy",
    description:
      "Engineered edge models like Intent running at 3.68ms warm inference offline without sending a single byte of user data across the network.",
  },
  {
    icon: Cpu,
    title: "Multi-Tenant Data Isolation",
    description:
      "Deep experience with PostgreSQL row-level security (RLS), security-definer functions, and strict session isolation across production schemas.",
  },
  {
    icon: Workflow,
    title: "High-Velocity Product Execution",
    description:
      "Turning real-world specs into functional, production-ready web and mobile applications with zero friction, leveraging modern tooling and AI workflows.",
  },
];

export function AboutSection() {
  const { education, honors } = usePortfolio();
  return (
    <section id="about" className="py-10 sm:py-14 md:py-16 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          number="01"
          badge="Profile & Vision"
          title="Bridging Edge-AI, Cloud Architecture, and Product Delivery."
          description="A breakdown of my background, academic track, and engineering philosophy."
        />

        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12">
          {/* Narrative / Bio Column */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              I am a 7th-semester Computer Science undergraduate at <span className="font-semibold text-zinc-900 dark:text-zinc-100">Presidency University Bangalore</span> (CGPA: 8.20) and currently an <span className="font-semibold text-zinc-900 dark:text-zinc-100">AI Solutions Developer Intern at Saina Human AI</span>.
            </p>
            <p>
              My expertise spans the entire development lifecycle: from building native Android services in <span className="font-medium text-zinc-800 dark:text-zinc-200">Kotlin</span> with on-device <span className="font-medium text-zinc-800 dark:text-zinc-200">TensorFlow Lite</span> ML inference, to architecting multi-tenant web platforms using <span className="font-medium text-zinc-800 dark:text-zinc-200">Next.js</span>, <span className="font-medium text-zinc-800 dark:text-zinc-200">Tailwind CSS</span>, and <span className="font-medium text-zinc-800 dark:text-zinc-200">Supabase / PostgreSQL (RLS)</span>.
            </p>
            <p>
              I specialize in bridging technical complexity with business utility, breaking down system architectures, cloud constraints, and LLM automation pipelines into clear, actionable products that ship rapidly.
            </p>

            {/* Principles cards */}
            <div className="mt-2 sm:mt-4 flex flex-col gap-3 sm:gap-4">
              <h3 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-900 dark:text-zinc-200 font-mono">
                Core Engineering Strengths
              </h3>
              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {engineeringPrinciples.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 sm:gap-3.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 sm:p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
                    >
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Education & Honors Column */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            {/* Honors Card */}
            {honors.map((h, idx) => (
              <div
                key={`${h.title}-${h.date || idx}`}
                className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-6 shadow-sm dark:border-amber-900/50 dark:from-amber-950/30 dark:to-zinc-900/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-[11px] sm:text-xs">Competitive Recognition</span>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-semibold text-amber-800 dark:text-amber-300">
                    {h.date}
                  </span>
                </div>

                <h3 className="mt-2.5 sm:mt-3 text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {h.title}
                </h3>
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {h.event}
                </div>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {h.description}
                </p>
              </div>
            ))}

            {/* Education Card */}
            {education.map((edu, idx) => (
              <div
                key={`${edu.degree}-${edu.institution || idx}`}
                className="rounded-3xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-[11px] sm:text-xs">Academic Foundation</span>
                  </div>
                  {edu.grade && (
                    <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] sm:text-xs font-mono font-bold text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300">
                      {edu.grade}
                    </span>
                  )}
                </div>

                <h3 className="mt-2.5 sm:mt-3 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {edu.degree}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span>{edu.institution}</span>
                  <span>•</span>
                  <span>{edu.period}</span>
                </div>

                <div className="mt-3.5 sm:mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-3.5 sm:pt-4 dark:border-zinc-800/80">
                  {edu.highlights.map((h, hIdx) => (
                    <div key={`${edu.degree}-hl-${hIdx}`} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                      <CheckCircle className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
