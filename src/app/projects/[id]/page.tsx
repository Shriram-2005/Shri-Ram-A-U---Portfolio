import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { featuredProjects, personalInfo } from "@/data/portfolio-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { GithubIcon } from "@/components/ui/icons";
import { Footer } from "@/components/footer";
import { ReadingProgress } from "@/components/reading-progress";
import { PrintHeader, PrintFooter } from "@/components/print-layout";
import { CaseStudyActions } from "@/components/case-study-actions";
import {
  ArrowLeft,
  ArrowUpRight,
  Globe,
  Smartphone,
  ExternalLink,
  Download,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  TestTube2,
  UserCheck,
  MessageSquareCode,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return featuredProjects.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = featuredProjects.find((p) => p.id === id);

  if (!project) {
    return {
      title: "Project Not Found | Shri Ram A U",
    };
  }

  return {
    title: `${project.title} - Engineering Case Study | Shri Ram A U`,
    description: project.description,
  };
}

function formatDomain(url?: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = featuredProjects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const arch = project.architecture;

  // Find index for previous / next project navigation
  const currentIndex = featuredProjects.findIndex((p) => p.id === id);
  const nextProject = featuredProjects[(currentIndex + 1) % featuredProjects.length];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col justify-between">
      {/* Scroll Reading Progress Bar */}
      <ReadingProgress />

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 print:hidden">
        <div className="mx-auto max-w-5xl px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Projects</span>
            <span className="sm:hidden font-mono text-xs">Projects</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 mr-0.5 sm:mr-2 shrink-0 transition-transform hover:scale-105"
              title="Return to Home"
            >
              <Image
                src="/aus-logo.png"
                alt="AUS Logo"
                width={100}
                height={37}
                quality={95}
                className="h-6 sm:h-7 w-auto object-contain shrink-0"
              />
              <span className="hidden sm:inline">{personalInfo.name}</span>
            </Link>
            <CaseStudyActions title={project.title} tagline={project.tagline} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Case Study Content */}
      <main className="flex-1 py-10 sm:py-14 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-col gap-8 sm:gap-10">
          {/* Printable Candidate & Case Study Header */}
          <PrintHeader
            pageTitle={`${project.title} - Engineering Case Study`}
            category={project.category}
          />

          {/* Breadcrumb / Top Meta */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 flex-wrap print:hidden">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/#projects" className="hover:underline">Projects</Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-xs">{project.title}</span>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category */}
              <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-mono font-medium text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300">
                {project.category}
              </span>

              {/* Domain / Live Status */}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50/80 px-3 py-1 text-xs font-mono font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{formatDomain(project.liveUrl)}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}

              {project.apkUrl && !project.liveUrl && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-50/80 px-3 py-1 text-xs font-mono font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-950/40 dark:text-sky-300">
                  <Smartphone className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{project.id === "intent-firewall" ? "intent-firewall.apk" : "audio-streaming.apk"}</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg font-medium text-purple-600 dark:text-purple-400">
              {project.tagline}
            </p>

            {/* Action CTA Buttons */}
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  <span>Open Live Application</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {project.apkUrl && (
                <a
                  href={project.apkUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  <Download className="h-4 w-4" />
                  <span>Download APK</span>
                </a>
              )}

              {project.driveUrl && (
                <a
                  href={project.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  <span>Google Drive Mirror</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>

          {/* Metrics Strip */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
              {project.metrics.map((m, mIdx) => (
                <div key={mIdx} className="text-center overflow-hidden">
                  <div className="font-mono text-base sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {m.value}
                  </div>
                  <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Overview & Highlights */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Overview &amp; Implementation Details
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              {project.description}
            </p>

            <div className="mt-2 flex flex-col gap-2.5 rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Core Engineering Highlights
              </div>
              <div className="flex flex-col gap-2">
                {project.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Architecture & Engineering Decisions */}
          {arch && (
            <div className="flex flex-col gap-5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Architecture &amp; Technical Decisions
                </h2>
              </div>

              {/* Personal Ownership Card */}
              <div className="rounded-2xl border border-purple-500/25 bg-purple-50/40 p-4 sm:p-5 dark:border-purple-900/40 dark:bg-purple-950/20">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  <UserCheck className="h-4 w-4" />
                  <span>Personal Ownership &amp; Scope</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                  {arch.ownership}
                </p>
              </div>

              {/* Problem vs Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Engineering Bottleneck
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {arch.problem}
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 sm:p-5 dark:border-purple-900/50 dark:bg-purple-950/30">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    Architectural Solution
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {arch.solution}
                  </p>
                </div>
              </div>

              {/* Security / Latency Implementation Card */}
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-50/40 p-4 sm:p-5 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{arch.securityOrPerformance.title}</span>
                </div>
                <ul className="mt-3 flex flex-col gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  {arch.securityOrPerformance.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">›</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testing & CI/CD Strategy Card */}
              <div className="rounded-2xl border border-sky-500/25 bg-sky-50/40 p-4 sm:p-5 dark:border-sky-500/20 dark:bg-sky-950/20">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                  <TestTube2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span>Testing &amp; CI/CD Strategy</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {arch.testingAndVerification}
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-sky-200/60 dark:border-sky-800/50 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-800 dark:text-zinc-200">Failure Modes &amp; Auth:</strong>{" "}
                  {arch.failureModesAndAuth}
                </div>
              </div>

              {/* Recruiter & Staff Engineer Q&A */}
              {arch.keyDecisions && arch.keyDecisions.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    <MessageSquareCode className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Recruiter &amp; Staff Engineer Q&amp;A</span>
                  </div>
                  {arch.keyDecisions.map((qa, qIdx) => (
                    <div
                      key={qIdx}
                      className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/90 shadow-2xs"
                    >
                      <div className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300">
                        Q: {qa.question}
                      </div>
                      <div className="mt-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {qa.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tech Stack Tags Strip */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Technologies &amp; Libraries
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-zinc-200/80 bg-zinc-100/80 px-3 py-1 text-xs font-mono text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Next Project & Back Navigation Banner */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/40 print:hidden">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Projects on Main Page</span>
            </Link>

            <Link
              href={`/projects/${nextProject.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <span>Next Project: {nextProject.title.split(":")[0]}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Printable Footer */}
          <PrintFooter />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
