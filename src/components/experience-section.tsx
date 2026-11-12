"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePortfolio } from "@/context/portfolio-context";
import { Calendar, MapPin, CheckCircle2 } from "lucide-react";

export function ExperienceSection() {
  const { experiences } = usePortfolio();
  return (
    <section id="experience" className="py-10 sm:py-14 md:py-16 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          number="03"
          badge="Track Record"
          title="Work Experience & Impact"
          description="A timeline of engineering roles where I designed systems, led architectural improvements, and shipped software."
        />

        <div className="relative border-l border-zinc-200 ml-2 sm:ml-6 pl-4 sm:pl-8 flex flex-col gap-8 sm:gap-12 dark:border-zinc-800">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-[23px] sm:-left-[39px] top-1.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-white ring-4 ring-purple-500/20 dark:bg-zinc-900">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-purple-600 dark:bg-purple-400 group-hover:scale-125 transition-transform" />
              </div>

              {/* Card Container */}
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-4 sm:p-7 shadow-xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {exp.role}
                    </h3>
                    <div className="mt-0.5 text-sm sm:text-base font-medium text-purple-600 dark:text-purple-400">
                      {exp.company}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {exp.period}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {exp.location}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-sans font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {exp.type}
                    </span>
                  </div>
                </div>

                <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {exp.description}
                </p>

                {/* Achievements */}
                <div className="mt-4 sm:mt-5 flex flex-col gap-2 border-t border-zinc-100 pt-3.5 sm:pt-4 dark:border-zinc-800/80">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                    Key Outcomes & Innovations
                  </span>
                  {exp.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300 leading-normal">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-1 sm:gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-mono text-zinc-700 dark:border-zinc-700/80 dark:bg-zinc-800/60 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
