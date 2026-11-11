"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  personalInfo as defaultPersonalInfo,
  featuredProjects as defaultProjects,
  experiences as defaultExperiences,
  education as defaultEducation,
  honors as defaultHonors,
  skillCategories as defaultSkillCategories,
  socialLinks as defaultSocialLinks,
} from "@/data/portfolio-data";
import { Project, Experience, SkillCategory, Education, Honor, SocialLink } from "@/types/portfolio";

export interface PortfolioContextType {
  personalInfo: typeof defaultPersonalInfo;
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  honors: Honor[];
  skillCategories: SkillCategory[];
  socialLinks: SocialLink[];
  isLoading: boolean;
  isCustomData: boolean;
  refreshPortfolio: () => Promise<void>;
}

const defaultContextValue: PortfolioContextType = {
  personalInfo: defaultPersonalInfo,
  projects: defaultProjects,
  experiences: defaultExperiences,
  education: defaultEducation,
  honors: defaultHonors,
  skillCategories: defaultSkillCategories,
  socialLinks: defaultSocialLinks,
  isLoading: false,
  isCustomData: false,
  refreshPortfolio: async () => {},
};

const PortfolioContext = createContext<PortfolioContextType>(defaultContextValue);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [education, setEducation] = useState<Education[]>(defaultEducation);
  const [honors, setHonors] = useState<Honor[]>(defaultHonors);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(defaultSkillCategories);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomData, setIsCustomData] = useState(false);

  const fetchPortfolio = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          if (d.personalInfo) setPersonalInfo(d.personalInfo);
          if (d.projects && Array.isArray(d.projects)) setProjects(d.projects);
          if (d.experiences && Array.isArray(d.experiences)) setExperiences(d.experiences);
          if (d.education && Array.isArray(d.education)) setEducation(d.education);
          if (d.honors && Array.isArray(d.honors)) setHonors(d.honors);
          if (d.skillCategories && Array.isArray(d.skillCategories)) setSkillCategories(d.skillCategories);
          if (d.socialLinks && Array.isArray(d.socialLinks)) setSocialLinks(d.socialLinks);
          setIsCustomData(true);
        }
      }
    } catch (err) {
      console.warn("Could not load dynamic portfolio data, using defaults:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        projects,
        experiences,
        education,
        honors,
        skillCategories,
        socialLinks,
        isLoading,
        isCustomData,
        refreshPortfolio: fetchPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
