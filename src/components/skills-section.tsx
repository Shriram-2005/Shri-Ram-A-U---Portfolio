"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { skillCategories } from "@/data/portfolio-data";
import { Code, Server, Database, Cloud } from "lucide-react";

const categoryIcons = [Code, Server, Database, Cloud];

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 md:py-28 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          number="04"
          badge="Toolbox"
          title="Technical Competencies & Stack"
          description="A breakdown of the languages, frameworks, distributed primitives, and cloud services I operate with in production."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {skillCategories.map((cat, idx) => {
            const Icon = categoryIcons[idx % categoryIcons.length];

            return (
              <div
                key={cat.title}
                className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/70 px-3 py-2 text-xs transition-colors hover:border-zinc-200 dark:border-zinc-800/60 dark:bg-zinc-800/40 dark:hover:border-zinc-700"
                      >
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {skill.name}
                        </span>
                        {skill.level && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono ${
                              skill.level === "Expert"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                                : "bg-zinc-200/60 text-zinc-600 dark:bg-zinc-700/60 dark:text-zinc-400"
                            }`}
                          >
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
