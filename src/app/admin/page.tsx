"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { PortfolioBundle, defaultPortfolioBundle } from "@/lib/supabase";
import { Project, Experience, Education, Honor, SocialLink } from "@/types/portfolio";
import {
  Save,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  User,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Wrench,
  Share2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "personal" | "projects" | "experience" | "skills" | "education" | "social"
  >("personal");

  const [data, setData] = useState<PortfolioBundle>(defaultPortfolioBundle);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Check authentication & load data
  useEffect(() => {
    async function init() {
      try {
        const sessionRes = await fetch("/api/admin/auth/session");
        const session = await sessionRes.json();
        if (!session.authenticated) {
          router.push("/admin/login");
          return;
        }

        const contentRes = await fetch("/api/admin/content");
        if (contentRes.ok) {
          const contentJson = await contentRes.json();
          if (contentJson.success && contentJson.data) {
            setData(contentJson.data);
            if (contentJson.data.projects?.length > 0) {
              setExpandedProject(contentJson.data.projects[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleSaveAll = async () => {
    setSaving(true);
    let allSuccess = true;

    const sections: (keyof PortfolioBundle)[] = [
      "personalInfo",
      "projects",
      "experiences",
      "education",
      "honors",
      "skillCategories",
      "socialLinks",
    ];

    for (const section of sections) {
      try {
        const res = await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, data: data[section] }),
        });
        if (!res.ok) allSuccess = false;
      } catch {
        allSuccess = false;
      }
    }

    setSaving(false);
    if (allSuccess) {
      toast("All changes saved to Supabase! Live website updated.", "success");
    } else {
      toast("Some sections could not be saved. Check Supabase connection.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-mono text-sm">
        <RefreshCw className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400 mr-2" />
        <span>Loading Portfolio CMS...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col transition-colors">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <Link href="/" target="_blank" className="flex items-center gap-1.5 sm:gap-2">
            <Image
              src="/aus-logo.png"
              alt="AUS Logo"
              width={75}
              height={28}
              className="h-5 sm:h-6 w-auto object-contain shrink-0"
            />
            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white hidden sm:inline">
              Portfolio Manager
            </span>
          </Link>
          <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase Connected</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2.5 sm:px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            title="View Live Website"
          >
            <span className="hidden sm:inline">Live Site</span>
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-2.5 sm:px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save All"}</span>
            <span className="sm:hidden">{saving ? "Saving..." : "Save"}</span>
          </button>

          {/* Theme Toggle Component in Header */}
          <ThemeToggle />

          {/* Logout button: redirects to portfolio home page */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80 p-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Log Out (Returns to Portfolio)"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-60 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === "personal"
                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Personal Bio &amp; Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === "projects"
                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <FolderGit2 className="h-4 w-4" />
            <span>Projects &amp; Case Studies</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === "experience"
                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Work Experience</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === "skills"
                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Wrench className="h-4 w-4" />
            <span>Skills &amp; Toolbox</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === "education"
                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Education &amp; Honors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === "social"
                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Social Links</span>
          </button>
        </aside>

        {/* Editor Body */}
        <main className="flex-1 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs transition-colors">
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === "personal" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Personal Information</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Controls hero section, header title, contact cards, and SEO metadata.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.name}
                    onChange={(e) =>
                      setData({ ...data, personalInfo: { ...data.personalInfo, name: e.target.value } })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.preferredName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalInfo: { ...data.personalInfo, preferredName: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    Professional Role / Title
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.role}
                    onChange={(e) =>
                      setData({ ...data, personalInfo: { ...data.personalInfo, role: e.target.value } })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.tagline}
                    onChange={(e) =>
                      setData({ ...data, personalInfo: { ...data.personalInfo, tagline: e.target.value } })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    Short Biography
                  </label>
                  <textarea
                    rows={3}
                    value={data.personalInfo.shortBio}
                    onChange={(e) =>
                      setData({ ...data, personalInfo: { ...data.personalInfo, shortBio: e.target.value } })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 leading-relaxed focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) =>
                      setData({ ...data, personalInfo: { ...data.personalInfo, email: e.target.value } })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.location}
                    onChange={(e) =>
                      setData({ ...data, personalInfo: { ...data.personalInfo, location: e.target.value } })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={data.personalInfo.github}
                    onChange={(e) =>
                      setData({ ...data, personalInfo: { ...data.personalInfo, github: e.target.value } })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={data.personalInfo.linkedin}
                    onChange={(e) =>
                      setData({ ...data, personalInfo: { ...data.personalInfo, linkedin: e.target.value } })
                    }
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Stats Strip Editor */}
              <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Hero Highlight Stats
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newStats = [...data.personalInfo.stats, { label: "New Stat", value: "0" }];
                      setData({ ...data, personalInfo: { ...data.personalInfo, stats: newStats } });
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-200 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Stat</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.personalInfo.stats.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-2.5"
                    >
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => {
                          const updated = [...data.personalInfo.stats];
                          updated[idx].value = e.target.value;
                          setData({ ...data, personalInfo: { ...data.personalInfo, stats: updated } });
                        }}
                        placeholder="Value (e.g. 3.68ms)"
                        className="w-24 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-base sm:text-xs font-mono font-bold text-purple-600 dark:text-purple-300 focus:border-purple-500 focus:outline-hidden"
                      />
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) => {
                          const updated = [...data.personalInfo.stats];
                          updated[idx].label = e.target.value;
                          setData({ ...data, personalInfo: { ...data.personalInfo, stats: updated } });
                        }}
                        placeholder="Label"
                        className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-base sm:text-xs text-zinc-800 dark:text-zinc-200 focus:border-purple-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.personalInfo.stats.filter((_, i) => i !== idx);
                          setData({ ...data, personalInfo: { ...data.personalInfo, stats: updated } });
                        }}
                        className="text-zinc-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === "projects" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Featured Projects &amp; Case Studies
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Add, edit, or remove systems. Each slug powers /projects/[slug].
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newId = `new-project-${Date.now().toString().slice(-4)}`;
                    const newProj: Project = {
                      id: newId,
                      title: "New Engineering Project",
                      tagline: "Short architectural summary",
                      description: "Detailed system description and implementation.",
                      category: "Full-Stack",
                      featured: true,
                      metrics: [{ label: "Throughput", value: "10k req/s" }],
                      highlights: ["Core highlight 1", "Core highlight 2"],
                      tags: ["Next.js", "TypeScript", "PostgreSQL"],
                      architecture: {
                        ownership: "Solo ownership of backend and architecture.",
                        problem: "Engineering bottleneck description.",
                        solution: "Implemented architectural solution.",
                        securityOrPerformance: {
                          title: "Security & Optimization",
                          points: ["Point 1", "Point 2"],
                        },
                        testingAndVerification: "Unit testing and CI pipeline.",
                        failureModesAndAuth: "Fallback strategies.",
                        keyDecisions: [{ question: "Why this stack?", answer: "Technical justification." }],
                      },
                    };
                    setData({ ...data, projects: [newProj, ...data.projects] });
                    setExpandedProject(newId);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects List Accordion */}
              <div className="flex flex-col gap-3">
                {data.projects.map((proj, pIdx) => {
                  const isExpanded = expandedProject === proj.id;
                  return (
                    <div
                      key={proj.id}
                      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950 overflow-hidden transition-colors"
                    >
                      {/* Project Header Bar */}
                      <div
                        onClick={() => setExpandedProject(isExpanded ? null : proj.id)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold">
                            #{pIdx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                              {proj.title}
                            </span>
                            <div className="text-xs text-zinc-500 font-mono">
                              /projects/{proj.id} • [{proj.category}]
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete project '${proj.title}'?`)) {
                                setData({ ...data, projects: data.projects.filter((p) => p.id !== proj.id) });
                              }
                            }}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Project Editor */}
                      {isExpanded && (
                        <div className="border-t border-zinc-200 dark:border-zinc-800/80 p-4 sm:p-6 flex flex-col gap-4 bg-white dark:bg-zinc-900/30">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                Project Slug (URL)
                              </label>
                              <input
                                type="text"
                                value={proj.id}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[pIdx].id = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                Category
                              </label>
                              <select
                                value={proj.category}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[pIdx].category = e.target.value as Project["category"];
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                              >
                                <option value="Full-Stack">Full-Stack</option>
                                <option value="Mobile & Edge AI">Mobile & Edge AI</option>
                                <option value="Web & Cloud">Web & Cloud</option>
                                <option value="Blockchain & Web3">Blockchain & Web3</option>
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[pIdx].title = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                Tagline
                              </label>
                              <input
                                type="text"
                                value={proj.tagline}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[pIdx].tagline = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                value={proj.description}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[pIdx].description = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                Live URL
                              </label>
                              <input
                                type="url"
                                value={proj.liveUrl || ""}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[pIdx].liveUrl = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                GitHub URL
                              </label>
                              <input
                                type="url"
                                value={proj.githubUrl || ""}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[pIdx].githubUrl = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                              />
                            </div>
                          </div>

                          {/* Architecture Details */}
                          {proj.architecture && (
                            <div className="mt-3 border-t border-zinc-200 dark:border-zinc-800 pt-3 flex flex-col gap-3">
                              <h4 className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
                                Technical Deep Dive &amp; Architecture
                              </h4>

                              <div>
                                <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                  Personal Ownership &amp; Scope
                                </label>
                                <textarea
                                  rows={2}
                                  value={proj.architecture.ownership}
                                  onChange={(e) => {
                                    const updated = [...data.projects];
                                    if (updated[pIdx].architecture) {
                                      updated[pIdx].architecture.ownership = e.target.value;
                                      setData({ ...data, projects: updated });
                                    }
                                  }}
                                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-200 focus:border-purple-500 focus:outline-hidden"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                    Engineering Bottleneck (Problem)
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={proj.architecture.problem}
                                    onChange={(e) => {
                                      const updated = [...data.projects];
                                      if (updated[pIdx].architecture) {
                                        updated[pIdx].architecture.problem = e.target.value;
                                        setData({ ...data, projects: updated });
                                      }
                                    }}
                                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-200 focus:border-purple-500 focus:outline-hidden"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                    Architectural Solution
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={proj.architecture.solution}
                                    onChange={(e) => {
                                      const updated = [...data.projects];
                                      if (updated[pIdx].architecture) {
                                        updated[pIdx].architecture.solution = e.target.value;
                                        setData({ ...data, projects: updated });
                                      }
                                    }}
                                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-base sm:text-xs text-zinc-900 dark:text-zinc-200 focus:border-purple-500 focus:outline-hidden"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: WORK EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Work Experience</h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Manage professional internships, roles, and achievements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newExp: Experience = {
                      id: `exp-${Date.now().toString().slice(-4)}`,
                      role: "Software Engineering Intern",
                      company: "Company Name",
                      location: "Bengaluru, India",
                      period: "Jan 2026 - Present",
                      type: "Internship",
                      description: "Engineered scalable systems and applications.",
                      achievements: ["Shipped production feature 1", "Optimized database queries"],
                      technologies: ["TypeScript", "Next.js", "PostgreSQL"],
                    };
                    setData({ ...data, experiences: [newExp, ...data.experiences] });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {data.experiences.map((exp, eIdx) => (
                  <div
                    key={exp.id}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950 p-4 sm:p-5 flex flex-col gap-3 transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
                      <div className="font-bold text-zinc-900 dark:text-white text-sm">
                        {exp.role} @ {exp.company}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setData({ ...data, experiences: data.experiences.filter((_, i) => i !== eIdx) });
                        }}
                        className="text-zinc-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Role Title
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[eIdx].role = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[eIdx].company = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Period
                        </label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[eIdx].period = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                        Overview Description
                      </label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[eIdx].description = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-200 focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === "skills" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Skills &amp; Toolbox</h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Group skills into categories and proficiency tiers.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {data.skillCategories.map((cat, cIdx) => (
                  <div
                    key={cat.title}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950 p-4 transition-colors"
                  >
                    <div className="font-bold text-purple-700 dark:text-purple-300 text-xs font-mono mb-3">
                      {cat.title} ({cat.skills.length} skills)
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-200"
                        >
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...data.skillCategories];
                              updated[cIdx].skills[sIdx].name = e.target.value;
                              setData({ ...data, skillCategories: updated });
                            }}
                            className="bg-transparent focus:outline-hidden text-base sm:text-xs w-28 text-zinc-900 dark:text-zinc-100"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...data.skillCategories];
                              updated[cIdx].skills = updated[cIdx].skills.filter((_, i) => i !== sIdx);
                              setData({ ...data, skillCategories: updated });
                            }}
                            className="text-zinc-400 hover:text-rose-500 font-bold ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...data.skillCategories];
                          updated[cIdx].skills.push({ name: "New Skill", level: "Proficient" });
                          setData({ ...data, skillCategories: updated });
                        }}
                        className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white cursor-pointer"
                      >
                        + Add Skill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EDUCATION & HONORS (WITH ADD & REMOVE) */}
          {activeTab === "education" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Education &amp; Honors</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Manage academic milestones, degrees, GPA, and exhibition awards.
                </p>
              </div>

              {/* Education List */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <h3 className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
                    Degrees &amp; Education ({data.education.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newEdu: Education = {
                        degree: "B.Tech in Computer Science & Engineering",
                        institution: "Presidency University, Bangalore",
                        period: "2023 - 2027",
                        location: "Bengaluru, India",
                        grade: "CGPA: 8.20",
                        highlights: ["Academic Distinction", "Key coursework in AI & Distributed Systems"],
                      };
                      setData({ ...data, education: [...data.education, newEdu] });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Education</span>
                  </button>
                </div>

                {data.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950 p-4 sm:p-5 flex flex-col gap-3 transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {edu.degree || "New Degree"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setData({ ...data, education: data.education.filter((_, i) => i !== idx) });
                        }}
                        className="text-zinc-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title="Remove Education Entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Degree / Program
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].degree = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].institution = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          CGPA / Grade
                        </label>
                        <input
                          type="text"
                          value={edu.grade || ""}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].grade = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-purple-700 dark:text-purple-300 font-bold focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Period
                        </label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].period = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={edu.location || ""}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].location = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Awards & Honors List */}
              <div className="flex flex-col gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <h3 className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
                    Awards &amp; Exhibition Honors ({data.honors.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newHonor: Honor = {
                        title: "Exhibition Award Title",
                        event: "Event / Hackathon Name",
                        date: "Nov 2025",
                        description: "Award description or project placement details.",
                      };
                      setData({ ...data, honors: [...data.honors, newHonor] });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Award / Honor</span>
                  </button>
                </div>

                {data.honors.map((hon, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950 p-4 sm:p-5 flex flex-col gap-3 transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {hon.title || "New Honor"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setData({ ...data, honors: data.honors.filter((_, i) => i !== idx) });
                        }}
                        className="text-zinc-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title="Remove Honor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Award Title
                        </label>
                        <input
                          type="text"
                          value={hon.title}
                          onChange={(e) => {
                            const updated = [...data.honors];
                            updated[idx].title = e.target.value;
                            setData({ ...data, honors: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs font-bold text-zinc-900 dark:text-white focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Event / Organizer
                        </label>
                        <input
                          type="text"
                          value={hon.event}
                          onChange={(e) => {
                            const updated = [...data.honors];
                            updated[idx].event = e.target.value;
                            setData({ ...data, honors: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                          Date / Year
                        </label>
                        <input
                          type="text"
                          value={hon.date}
                          onChange={(e) => {
                            const updated = [...data.honors];
                            updated[idx].date = e.target.value;
                            setData({ ...data, honors: updated });
                          }}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                        Achievement Description
                      </label>
                      <textarea
                        rows={2}
                        value={hon.description}
                        onChange={(e) => {
                          const updated = [...data.honors];
                          updated[idx].description = e.target.value;
                          setData({ ...data, honors: updated });
                        }}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-800 dark:text-zinc-300 focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SOCIAL LINKS (WITH ADD & REMOVE) */}
          {activeTab === "social" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Social &amp; Platform Links</h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Manage online links shown in footer and contact areas ({data.socialLinks.length}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newSocial: SocialLink = {
                      name: "Platform",
                      url: "https://",
                      handle: "@username",
                      icon: "globe",
                    };
                    setData({ ...data, socialLinks: [...data.socialLinks, newSocial] });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Social Link</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {data.socialLinks.map((soc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950 p-3.5 transition-colors"
                  >
                    <div className="w-full sm:w-36">
                      <label className="block text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mb-1">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. GitHub"
                        value={soc.name}
                        onChange={(e) => {
                          const updated = [...data.socialLinks];
                          updated[idx].name = e.target.value;
                          setData({ ...data, socialLinks: updated });
                        }}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="w-full sm:w-40">
                      <label className="block text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mb-1">
                        Handle / Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. shriramau"
                        value={soc.handle || ""}
                        onChange={(e) => {
                          const updated = [...data.socialLinks];
                          updated[idx].handle = e.target.value;
                          setData({ ...data, socialLinks: updated });
                        }}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={soc.url}
                        onChange={(e) => {
                          const updated = [...data.socialLinks];
                          updated[idx].url = e.target.value;
                          setData({ ...data, socialLinks: updated });
                        }}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-base sm:text-xs text-zinc-700 dark:text-zinc-300 focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="self-end sm:self-center pt-2 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setData({ ...data, socialLinks: data.socialLinks.filter((_, i) => i !== idx) });
                        }}
                        className="text-zinc-400 hover:text-rose-500 p-2 cursor-pointer transition-colors"
                        title="Remove Social Link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
