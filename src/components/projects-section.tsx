"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePortfolio } from "@/context/portfolio-context";
import { GithubIcon } from "@/components/ui/icons";
import {
  ArrowUpRight,
  Globe,
  Smartphone,
  Download,
  Cpu,
  Sparkles,
} from "lucide-react";

function formatDomain(url?: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ProjectsSection() {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const list = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return ["All", ...list];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory, projects]);

  return (
    <section id="projects" className="py-10 sm:py-14 md:py-16 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 sm:mb-8">
          <div>
            <SectionHeading
              number="02"
              badge="Selected Work"
              title="Featured Engineering Projects"
              description="A quick overview of my production systems, mobile APKs, and cloud platforms with dedicated case study links."
            />
            {/* Guide Tag */}
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-700 dark:border-purple-500/20 dark:bg-purple-950/40 dark:text-purple-300">
                <Sparkles className="h-3 w-3" />
                Dedicated Deep Dives
              </span>
              <span className="hidden sm:inline">
                Click View Full Details on any card to open the dedicated architecture and benchmark case study.
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="overflow-x-auto pb-1 sm:pb-0 max-w-full -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-2xl border border-zinc-200/80 bg-zinc-100/60 p-1 sm:p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative shrink-0 rounded-xl px-3 sm:px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
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
        </div>

        {/* Uniform Grid: Equal height cards across all rows and columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-xs transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              >
                <div>
                  {/* Top Row: Domain / Artifact Pill + Category + Quick Header Icons */}
                  <div className="flex items-center justify-between gap-2.5 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open live deployment: ${project.liveUrl}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/80 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/25 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                          </span>
                          <Globe className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{formatDomain(project.liveUrl)}</span>
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-50/80 px-2.5 py-1 text-xs font-mono font-semibold text-sky-700 dark:border-sky-500/25 dark:bg-sky-950/40 dark:text-sky-300">
                          <Smartphone className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                          <span>{project.id === "intent-firewall" ? "intent-firewall.apk" : "audio-streaming.apk"}</span>
                        </div>
                      )}

                      <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.title} on GitHub`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                          <GithubIcon className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.title} live demo`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 transition-all hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {project.apkUrl && !project.liveUrl && (
                        <a
                          href={project.apkUrl}
                          download
                          aria-label={`Download ${project.title} APK`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-300 bg-sky-50 text-sky-700 transition-all hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="mt-3.5 text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  {/* Tagline */}
                  <div className="mt-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                    {project.tagline}
                  </div>

                  {/* 2-line glimpse description */}
                  <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Metrics Strip */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-xl border border-zinc-100 bg-zinc-50/70 p-2 dark:border-zinc-800/60 dark:bg-zinc-800/30">
                      {project.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="text-center overflow-hidden">
                          <div className="font-mono text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {m.value}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Section: Tech Tags & Dedicated Link Button */}
                <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="rounded-md bg-zinc-100/60 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 dark:bg-zinc-800/60 dark:text-zinc-500">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Dedicated Case Study Link Button */}
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex w-full items-center justify-between rounded-xl border border-purple-500/25 bg-purple-50/60 px-3.5 py-2.5 text-xs font-semibold text-purple-700 transition-all hover:border-purple-500/40 hover:bg-purple-500/10 dark:border-purple-500/25 dark:bg-purple-950/30 dark:text-purple-300 dark:hover:bg-purple-950/60"
                  >
                    <span className="flex items-center gap-2">
                      <Cpu className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      <span>View Full Details &amp; Architecture</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Additional Projects & Live Vercel Deployments Banner */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Looking for more live Vercel deployments and repositories?
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              I have multiple additional web apps, client prototypes, and live staging URLs deployed across Vercel and GitHub. Feel free to explore my full GitHub profile or request a live demo walkthrough.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href="https://github.com/Shriram-2005"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Explore GitHub</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
