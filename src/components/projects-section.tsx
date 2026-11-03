"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredProjects } from "@/data/portfolio-data";
import { GithubIcon } from "@/components/ui/icons";
import {
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  "All",
  "Mobile & Edge AI",
  "Full-Stack",
  "Blockchain & Web3",
  "Web & Cloud",
] as const;

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return featuredProjects;
    return featuredProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="projects" className="py-20 md:py-28 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            number="02"
            badge="Selected Work"
            title="Featured Engineering Projects"
            description="Deep dive into on-device AI notification firewalls, multi-tenant Next.js & Supabase SaaS architectures, and blockchain credential validation systems."
          />

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-200/80 bg-zinc-100/60 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60 self-start md:self-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-category-pill"
                      className="absolute inset-0 rounded-xl bg-white shadow-xs dark:bg-zinc-800"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects List */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-xs transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              >
                <div>
                  {/* Top Bar: Category & Links */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[11px] font-mono font-medium text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300">
                      {project.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.title} on GitHub`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                          <GithubIcon className="h-4 w-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.title} live preview`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {project.title}
                  </h3>
                  <div className="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                    {project.tagline}
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>

                  {/* Metrics Strip */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800/60 dark:bg-zinc-800/30">
                      {project.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="text-center">
                          <div className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {m.value}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Highlights */}
                  <div className="mt-5 flex flex-col gap-2">
                    {project.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Tags Bottom Strip */}
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-5 dark:border-zinc-800/80">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Additional Projects & Live Vercel Deployments Banner */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Looking for more live Vercel deployments & repositories?
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl">
              I have multiple additional web apps, client prototypes, and live staging URLs deployed across Vercel and GitHub. Feel free to explore my full GitHub profile or request a live demo walkthrough.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://github.com/Shriram-2005"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Explore GitHub</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
