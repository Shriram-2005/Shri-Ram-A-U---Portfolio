import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  personalInfo as defaultPersonalInfo,
  featuredProjects as defaultProjects,
  experiences as defaultExperiences,
  education as defaultEducation,
  honors as defaultHonors,
  skillCategories as defaultSkillCategories,
  socialLinks as defaultSocialLinks,
} from "@/data/portfolio-data";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qsfxoyrkevqjosjcuknn.supabase.co";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_WVAJSSJY8M6waYaO2coLlQ_DLKBezPu";

let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedAdminClient) return cachedAdminClient;
  const key = supabaseSecretKey || supabasePublishableKey;
  if (!supabaseUrl || !key) {
    return null;
  }

  try {
    cachedAdminClient = createClient(supabaseUrl, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return cachedAdminClient;
  } catch (err) {
    console.error("Failed to initialize Supabase Admin client:", err);
    return null;
  }
}

export function getSupabasePublic(): SupabaseClient | null {
  const key = supabasePublishableKey || supabaseSecretKey;
  if (!supabaseUrl || !key) return null;

  try {
    return createClient(supabaseUrl, key, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.error("Failed to initialize Supabase Public client:", err);
    return null;
  }
}

/**
 * Default fallback data bundle from codebase portfolio-data.ts
 */
export const defaultPortfolioBundle = {
  personalInfo: defaultPersonalInfo,
  projects: defaultProjects,
  experiences: defaultExperiences,
  education: defaultEducation,
  honors: defaultHonors,
  skillCategories: defaultSkillCategories,
  socialLinks: defaultSocialLinks,
};

export type PortfolioBundle = typeof defaultPortfolioBundle;

/**
 * Fetch all portfolio content from Supabase.
 * If Supabase is empty or table doesn't exist yet, seamlessly falls back to codebase defaults.
 */
export async function fetchFullPortfolio(): Promise<PortfolioBundle> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return defaultPortfolioBundle;
  }

  try {
    const { data, error } = await supabase
      .from("portfolio_content")
      .select("key, data");

    if (error || !data || data.length === 0) {
      return defaultPortfolioBundle;
    }

    const resultMap = new Map<string, unknown>();
    for (const row of data) {
      resultMap.set(row.key, row.data);
    }

    return {
      personalInfo: (resultMap.get("personalInfo") as typeof defaultPersonalInfo) || defaultPersonalInfo,
      projects: (resultMap.get("projects") as typeof defaultProjects) || defaultProjects,
      experiences: (resultMap.get("experiences") as typeof defaultExperiences) || defaultExperiences,
      education: (resultMap.get("education") as typeof defaultEducation) || defaultEducation,
      honors: (resultMap.get("honors") as typeof defaultHonors) || defaultHonors,
      skillCategories: (resultMap.get("skillCategories") as typeof defaultSkillCategories) || defaultSkillCategories,
      socialLinks: (resultMap.get("socialLinks") as typeof defaultSocialLinks) || defaultSocialLinks,
    };
  } catch (err) {
    console.warn("Could not query Supabase portfolio_content, using defaults:", err);
    return defaultPortfolioBundle;
  }
}

/**
 * Saves a specific section or the entire bundle to Supabase.
 */
export async function savePortfolioSection(key: keyof PortfolioBundle, data: unknown): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("portfolio_content")
      .upsert(
        {
          key,
          data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) {
      console.warn(`Upsert warning for section ${key}:`, error.message, "- trying direct update");
      const updateRes = await supabase
        .from("portfolio_content")
        .update({ data, updated_at: new Date().toISOString() })
        .eq("key", key);
      return !updateRes.error;
    }
    return true;
  } catch (err) {
    console.error(`Exception saving portfolio section ${key}:`, err);
    return false;
  }
}

/**
 * Seeds all default portfolio content from codebase into Supabase if empty.
 */
export async function seedDefaultsToSupabase(): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const entries = Object.entries(defaultPortfolioBundle).map(([key, data]) => ({
    key,
    data,
    updated_at: new Date().toISOString(),
  }));

  try {
    const { error } = await supabase
      .from("portfolio_content")
      .upsert(entries, { onConflict: "key" });
    if (error) {
      console.error("Failed to seed Supabase portfolio_content:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception seeding Supabase portfolio_content:", err);
    return false;
  }
}

/**
 * Fetch a setting from portfolio_settings (e.g. secret_keyword, admin_email)
 */
export async function getPortfolioSetting(key: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data) return null;
    return data.value;
  } catch {
    return null;
  }
}

/**
 * Save a setting to portfolio_settings
 */
export async function setPortfolioSetting(key: string, value: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("setPortfolioSetting: getSupabaseAdmin returned null");
    return false;
  }

  try {
    const { error } = await supabase
      .from("portfolio_settings")
      .upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) {
      console.warn(`Upsert warning for ${key}:`, error.message, "- trying direct update");
      const updateRes = await supabase
        .from("portfolio_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
      return !updateRes.error;
    }

    return true;
  } catch (err) {
    console.error(`Error setting portfolio_setting ${key}:`, err);
    return false;
  }
}

