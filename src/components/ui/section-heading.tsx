import React from "react";

interface SectionHeadingProps {
  number: string;
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  number,
  badge,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}`}>
      <div className={`flex items-center gap-2 mb-3 ${isCenter ? "justify-center" : ""}`}>
        <span className="font-mono text-xs font-semibold tracking-wider text-purple-600 dark:text-purple-400">
          {number}
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">{"//"}</span>
        {badge && (
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {badge}
          </span>
        )}
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
