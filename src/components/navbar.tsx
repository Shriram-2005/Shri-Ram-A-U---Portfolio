"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { personalInfo } from "@/data/portfolio-data";
import { Search, Menu, X, FileText, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenCommand: () => void;
}

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Work", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Terminal", href: "#terminal" },
  { name: "Contact", href: "#contact" },
];

export function Navbar({ onOpenCommand }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shortcutKey, setShortcutKey] = useState("Ctrl+K");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
      setShortcutKey(isMac ? "⌘K" : "Ctrl+K");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          return;
        }
      }
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "py-2 sm:py-3" : "py-3 sm:py-5"
        }`}
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <nav
            className={`flex items-center justify-between rounded-2xl border px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-300 backdrop-blur-xl ${
              scrolled
                ? "border-zinc-200/80 bg-white/85 shadow-lg shadow-zinc-950/[0.03] dark:border-zinc-800/80 dark:bg-zinc-900/85 dark:shadow-black/20"
                : "border-transparent bg-white/40 dark:bg-zinc-900/40 sm:bg-transparent sm:dark:bg-transparent"
            }`}
          >
            {/* Logo / Monogram */}
            <a
              href="#"
              className="group flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              <div className="relative flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/aus-logo.png"
                  alt="AUS Logo"
                  width={78}
                  height={30}
                  className="h-6 sm:h-7 w-auto object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight font-bold">{personalInfo.name}</span>
                <span className="hidden sm:inline text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                  AI & Systems Engineer
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 rounded-full border border-zinc-200/70 bg-zinc-100/60 p-1 dark:border-zinc-800/80 dark:bg-zinc-900/60">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                      isActive
                        ? "text-zinc-950 dark:text-zinc-50 font-semibold"
                        : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 rounded-full bg-white shadow-xs dark:bg-zinc-800"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Action buttons on right */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Cmd+K / Ctrl+K trigger */}
              <button
                onClick={onOpenCommand}
                className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                aria-label="Search and command palette"
              >
                <Search className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-mono text-[11px]">Search</span>
                <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  {shortcutKey}
                </kbd>
              </button>

              <ThemeToggle />

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-3 top-16 z-40 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl md:hidden dark:border-zinc-800 dark:bg-zinc-900/95"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                ))}
                <div className="mt-2 border-t border-zinc-200 pt-3 dark:border-zinc-800 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCommand();
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <span>Search Command Menu</span>
                    </span>
                    <span className="font-mono text-xs">{shortcutKey}</span>
                  </button>

                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    <FileText className="h-3.5 w-3.5 text-zinc-400" />
                    <span>View Resume (PDF)</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
