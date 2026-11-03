"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { personalInfo } from "@/data/portfolio-data";
import { Search, Menu, X } from "lucide-react";

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
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav
            className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 backdrop-blur-xl ${
              scrolled
                ? "border-zinc-200/80 bg-white/80 shadow-lg shadow-zinc-950/[0.03] dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-black/20"
                : "border-transparent bg-transparent"
            }`}
          >
            {/* Logo / Monogram */}
            <a
              href="#"
              className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white font-mono text-xs font-bold transition-transform group-hover:scale-105 dark:bg-white dark:text-zinc-900">
                SR
              </div>
              <div className="flex flex-col">
                <span className="leading-tight font-bold">{personalInfo.name}</span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                  Software Engineer
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
            <div className="flex items-center gap-2">
              {/* Cmd+K trigger */}
              <button
                onClick={onOpenCommand}
                className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                aria-label="Search and command palette"
              >
                <Search className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-mono text-[11px]">Search</span>
                <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.2 font-mono text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  ⌘K
                </kbd>
              </button>

              <ThemeToggle />

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl md:hidden dark:border-zinc-800 dark:bg-zinc-900/95"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {link.name}
                </a>
              ))}
              <div className="mt-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCommand();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Command Menu</span>
                  </span>
                  <span className="font-mono text-xs">⌘K</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
