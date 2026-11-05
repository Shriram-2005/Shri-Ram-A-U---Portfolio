"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredProjects } from "@/data/portfolio-data";
import type { Project } from "@/types/portfolio";
import { GithubIcon } from "@/components/ui/icons";
import {
  CheckCircle2,
  ArrowUpRight,
  Globe,
  Smartphone,
  ExternalLink,
  Download,
  Cpu,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  TestTube2,
  UserCheck,
  MessageSquareCode,
  Sparkles,
} from "lucide-react";

const categories = [
  "All",
  "Mobile & Edge AI",
  "Full-Stack",
  "Blockchain & Web3",
  "Web & Cloud",
] as const;

function formatDomain(url?: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
}

function ProjectCard({ project, isExpanded, onToggle }: ProjectCardProps) {
  const arch = project.architecture;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={`group relative flex flex-col rounded-2xl border transition-all ${
        isExpanded
          ? "border-purple-500/40 bg-white shadow-lg dark:border-purple-500/30 dark:bg-zinc-900/80"
          : "border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
      } ${isExpanded ? "p-4 sm:p-6" : ""}`}
    >
      {/* Compact Glimpse Header */}
      <div>
        {/* Top Row: Domain Name / Project Artifact + Category + Quick Actions */}
        <div className="flex items-center justify-between gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Domain name or APK filename pill */}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={`Open live site: ${project.liveUrl}`}
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

            {/* Category badge */}
            <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {project.category}
            </span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} on GitHub`}
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-300 bg-sky-50 text-sky-700 transition-all hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Project Name */}
        <h3 className="mt-3 text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {project.title}
        </h3>

        {/* 1-Line Tagline / Glimpse */}
        <div className="mt-1 text-xs font-medium text-purple-600 dark:text-purple-400">
          {project.tagline}
        </div>

        {/* Quick Metric Pills Glimpse */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {project.metrics.map((m, mIdx) => (
              <span
                key={mIdx}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-200/70 bg-zinc-50 px-2 py-0.5 text-[11px] font-mono text-zinc-700 dark:border-zinc-800/80 dark:bg-zinc-800/50 dark:text-zinc-300"
              >
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{m.value}</span>
                <span className="text-zinc-400 dark:text-zinc-500 text-[10px]">({m.label})</span>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown / Expand Toggle Button */}
        <button
          type="button"
          onClick={onToggle}
          className={`mt-3.5 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
            isExpanded
              ? "border-purple-500/30 bg-purple-50/70 text-purple-800 dark:border-purple-500/30 dark:bg-purple-950/40 dark:text-purple-200"
              : "border-zinc-200/80 bg-zinc-50/70 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold">
              {isExpanded ? "Hide Details & Architecture" : "View Details & Architecture"}
            </span>
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px] text-purple-600 dark:text-purple-400">
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </div>
        </button>
      </div>

      {/* Expanded Details Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3.5">
              {/* Full Description */}
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {project.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Key Implementations
                </div>
                {project.highlights.map((item, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300 leading-normal">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Architecture & Engineering Decisions */}
              {arch && (
                <div className="flex flex-col gap-2.5 rounded-2xl border border-purple-500/20 bg-purple-50/30 p-3 sm:p-4 dark:border-purple-900/30 dark:bg-purple-950/20">
                  {/* Ownership */}
                  <div className="rounded-xl border border-zinc-200/80 bg-white/95 p-3 dark:border-zinc-800 dark:bg-zinc-900/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Personal Ownership &amp; Scope</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                      {arch.ownership}
                    </p>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="rounded-xl border border-zinc-200/70 bg-white/80 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Engineering Bottleneck
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {arch.problem}
                      </p>
                    </div>
                    <div className="rounded-xl border border-purple-200/70 bg-purple-50/50 p-2.5 dark:border-purple-900/40 dark:bg-purple-950/30">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                        Architectural Solution
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {arch.solution}
                      </p>
                    </div>
                  </div>

                  {/* Security / Latency Implementation */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/40 p-3 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{arch.securityOrPerformance.title}</span>
                    </div>
                    <ul className="mt-1.5 flex flex-col gap-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {arch.securityOrPerformance.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">›</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Testing & Failure Handling */}
                  <div className="rounded-xl border border-sky-500/20 bg-sky-50/40 p-3 dark:border-sky-500/20 dark:bg-sky-950/20">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                      <TestTube2 className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                      <span>Testing &amp; CI/CD Strategy</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {arch.testingAndVerification}
                    </p>
                    <div className="mt-1.5 pt-1.5 border-t border-sky-200/50 dark:border-sky-800/40 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-800 dark:text-zinc-200">Failure Modes &amp; Auth:</strong>{" "}
                      {arch.failureModesAndAuth}
                    </div>
                  </div>

                  {/* Recruiter Technical Q&A */}
                  {arch.keyDecisions && arch.keyDecisions.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        <MessageSquareCode className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Recruiter &amp; Staff Engineer Q&amp;A</span>
                      </div>
                      {arch.keyDecisions.map((qa, qIdx) => (
                        <div
                          key={qIdx}
                          className="rounded-xl border border-zinc-200 bg-white/95 p-3 dark:border-zinc-800 dark:bg-zinc-900/90 shadow-2xs"
                        >
                          <div className="text-xs font-bold text-purple-700 dark:text-purple-300">
                            Q: {qa.question}
                          </div>
                          <div className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {qa.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons & Tech Tags Strip */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                    >
                      <span>Open Live Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2">
                      {project.apkUrl && (
                        <a
                          href={project.apkUrl}
                          download
                          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download APK</span>
                        </a>
                      )}
                      {project.driveUrl && (
                        <a
                          href={project.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <span>Google Drive</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Collapse link */}
                  <button
                    type="button"
                    onClick={onToggle}
                    className="text-[11px] font-mono text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                  >
                    Collapse details ↑
                  </button>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleDeepDive = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return featuredProjects;
    return featuredProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Two independent columns on desktop to avoid grid row stretching
  const col1Projects = useMemo(
    () => filteredProjects.filter((_, idx) => idx % 2 === 0),
    [filteredProjects]
  );
  const col2Projects = useMemo(
    () => filteredProjects.filter((_, idx) => idx % 2 === 1),
    [filteredProjects]
  );

  return (
    <section id="projects" className="py-10 sm:py-14 md:py-16 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 sm:mb-8">
          <div>
            <SectionHeading
              number="02"
              badge="Selected Work"
              title="Featured Engineering Projects"
              description="A glimpse into my production systems, mobile APKs, and cloud platforms with one-click architecture breakdowns."
            />
            {/* Guide Tag */}
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-700 dark:border-purple-500/20 dark:bg-purple-950/40 dark:text-purple-300">
                <Sparkles className="h-3 w-3" />
                Interactive Deep Dives
              </span>
              <span className="hidden sm:inline">
                Click View Details &amp; Architecture on any project to explore benchmarks, tenant security, and direct ownership.
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

        {/* Mobile View: Single vertical column without empty space */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:hidden">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={expandedProjectId === project.id}
                onToggle={() => toggleDeepDive(project.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop View: Two independent masonry columns */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {col1Projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isExpanded={expandedProjectId === project.id}
                  onToggle={() => toggleDeepDive(project.id)}
                />
              ))}
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {col2Projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isExpanded={expandedProjectId === project.id}
                  onToggle={() => toggleDeepDive(project.id)}
                />
              ))}
            </AnimatePresence>
          </div>
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
