"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor, Check } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Close dropdown on click outside
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (!mounted) {
    return (
      <div className="flex h-8 w-8 sm:h-8 sm:w-28 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100/50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50" />
    );
  }

  const options = [
    { key: "system", label: "System Default", icon: Monitor },
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
  ] as const;

  const activeTheme = theme || "system";
  const ActiveIcon = activeTheme === "light" ? Sun : activeTheme === "dark" ? Moon : Monitor;

  return (
    <>
      {/* Mobile: Single Compact Icon Button with Dropdown */}
      <div ref={dropdownRef} className="relative sm:hidden">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/80 bg-zinc-50 text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 shadow-2xs"
          aria-label="Toggle theme dropdown"
          aria-expanded={dropdownOpen}
          title={`Theme: ${activeTheme}`}
        >
          <ActiveIcon className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[150px] overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95"
            >
              <div className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Theme
              </div>
              <div className="flex flex-col gap-0.5">
                {options.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = activeTheme === opt.key;

                  return (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setTheme(opt.key);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-colors ${
                        isSelected
                          ? "bg-purple-50 text-purple-900 dark:bg-purple-950/50 dark:text-purple-200 font-semibold"
                          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/70"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon
                          className={`h-3.5 w-3.5 ${
                            isSelected
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-zinc-400"
                          }`}
                        />
                        <span>{opt.label}</span>
                      </span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop (sm+): Segmented 3-Option Pill Control */}
      <div className="hidden sm:inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-100/80 p-0.5 sm:p-1 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 shadow-xs">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = activeTheme === option.key;

          return (
            <button
              key={option.key}
              onClick={() => setTheme(option.key)}
              className="relative flex items-center justify-center rounded-full px-2 py-1 sm:px-2.5 text-xs font-medium transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label={`Set ${option.label} theme`}
            >
              {isActive && (
                <motion.div
                  layoutId="theme-toggle-active-indicator"
                  className="absolute inset-0 rounded-full bg-white dark:bg-zinc-800 shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden md:inline">
                  {option.label === "System Default" ? "System" : option.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
