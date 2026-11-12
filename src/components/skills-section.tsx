"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePortfolio } from "@/context/portfolio-context";
import type { SkillLevel } from "@/types/portfolio";
import { Code, Server, Database, BrainCircuit } from "lucide-react";

const categoryIcons = [Code, Server, Database, BrainCircuit];

function getLevelBadgeStyle(level?: SkillLevel) {
  switch (level) {
    case "Production experience":
      return "border-emerald-500/25 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Project experience":
      return "border-purple-500/25 bg-purple-50 text-purple-700 dark:border-purple-500/20 dark:bg-purple-950/40 dark:text-purple-300";
    case "Working knowledge":
      return "border-sky-500/25 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-950/40 dark:text-sky-300";
    case "Currently learning":
      return "border-amber-500/25 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-300";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

function getLevelDotStyle(level?: SkillLevel) {
  switch (level) {
    case "Production experience":
      return "bg-emerald-500";
    case "Project experience":
      return "bg-purple-500";
    case "Working knowledge":
      return "bg-sky-500";
    case "Currently learning":
      return "bg-amber-500";
    default:
      return "bg-zinc-400";
  }
}

export function SkillsSection() {
  const { skillCategories } = usePortfolio();
  return (
    <section id="skills" className="py-10 sm:py-14 md:py-16 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          number="04"
          badge="Toolbox"
          title="Technical Competencies & Stack"
          description="A structured breakdown of my technical stack across production-tested deployments, end-to-end projects, systems fundamentals, and active frontiers."
        />

        {/* Legend */}
        <div className="mb-8 flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 mr-1">
            Proficiency tiers:
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Production experience
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-50/70 px-2.5 py-1 text-[11px] font-medium text-purple-700 dark:border-purple-500/20 dark:bg-purple-950/40 dark:text-purple-300">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Project experience
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-50/70 px-2.5 py-1 text-[11px] font-medium text-sky-700 dark:border-sky-500/20 dark:bg-sky-950/40 dark:text-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            Working knowledge
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-50/70 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Currently learning
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {skillCategories.map((cat, idx) => {
            const Icon = categoryIcons[idx % categoryIcons.length];

            return (
              <div
                key={cat.title}
                className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 sm:p-7 shadow-xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 leading-tight">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-3 py-2 text-xs transition-colors hover:border-zinc-200 hover:bg-zinc-100/60 dark:border-zinc-800/60 dark:bg-zinc-800/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/70"
                      >
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {skill.name}
                        </span>
                        {skill.level && (
                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium tracking-tight ${getLevelBadgeStyle(
                              skill.level
                            )}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${getLevelDotStyle(skill.level)}`}
                            />
                            {skill.level}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
