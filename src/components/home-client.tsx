"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { CommandMenu } from "@/components/command-menu";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { SkillsSection } from "@/components/skills-section";
import { TerminalSection } from "@/components/terminal-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { PrintHeader, PrintFooter } from "@/components/print-layout";

export function HomeClient() {
  const [commandOpen, setCommandOpen] = useState(false);

  // Global keyboard shortcut: Ctrl+K on Windows/Linux, Cmd+K on macOS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors">
      {/* Floating navigation bar */}
      <Navbar onOpenCommand={() => setCommandOpen(true)} />

      {/* Global Command Menu (Cmd+K / Ctrl+K) */}
      <CommandMenu isOpen={commandOpen} onClose={() => setCommandOpen(false)} />

      {/* Main Portfolio Sections */}
      <main className="flex flex-col">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
          <PrintHeader pageTitle="Engineering Portfolio & Systems Showcase" />
        </div>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <SkillsSection />
        <TerminalSection />
        <ContactSection />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
          <PrintFooter />
        </div>
      </main>

      {/* Refined footer */}
      <Footer />
    </div>
  );
}

