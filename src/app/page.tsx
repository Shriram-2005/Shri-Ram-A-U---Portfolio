import React from "react";
import { fetchFullPortfolio } from "@/lib/supabase";
import { PortfolioProvider } from "@/context/portfolio-context";
import { HomeClient } from "@/components/home-client";

// Force dynamic rendering so updates saved in Supabase or CMS reflect immediately
export const dynamic = "force-dynamic";

export default async function Home() {
  const portfolioData = await fetchFullPortfolio();

  return (
    <PortfolioProvider initialData={portfolioData}>
      <HomeClient />
    </PortfolioProvider>
  );
}
