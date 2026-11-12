"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { PortfolioBundle, defaultPortfolioBundle } from "@/lib/supabase";

const PortfolioContext = createContext<PortfolioBundle>(defaultPortfolioBundle);

export function PortfolioProvider({
  children,
  initialData = defaultPortfolioBundle,
}: {
  children: ReactNode;
  initialData?: PortfolioBundle;
}) {
  const [data, setData] = useState<PortfolioBundle>(initialData);
  const [prevInitialData, setPrevInitialData] = useState<PortfolioBundle>(initialData);

  // Sync state during render when initialData changes without cascading effects
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setData(initialData);
  }

  // Client-side refresh on mount and window focus so CMS edits reflect immediately
  useEffect(() => {
    let isMounted = true;

    const refreshData = async () => {
      try {
        const res = await fetch("/api/portfolio", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setData(json.data);
          }
        }
      } catch {
        // Fallback to current state
      }
    };

    refreshData();

    const onFocus = () => refreshData();
    window.addEventListener("focus", onFocus);
    return () => {
      isMounted = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioBundle {
  return useContext(PortfolioContext);
}
