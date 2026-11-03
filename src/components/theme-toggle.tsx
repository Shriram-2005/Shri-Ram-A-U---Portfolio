"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="flex h-9 w-20 sm:w-28 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100/50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50" />
    );
  }

  const options = [
    { key: "light", label: "Light", icon: Sun },
    { key: "system", label: "System", icon: Monitor },
    { key: "dark", label: "Dark", icon: Moon },
  ] as const;

  return (
    <div className="inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-100/80 p-0.5 sm:p-1 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 shadow-xs">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.key;

        return (
          <button
            key={option.key}
            onClick={() => setTheme(option.key)}
            className="relative flex items-center justify-center rounded-full px-2 py-1.5 sm:px-3 text-xs font-medium transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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
              <span className="hidden sm:inline">{option.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
