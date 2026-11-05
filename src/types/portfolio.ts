export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "Full-Stack" | "Mobile & Edge AI" | "Web & Cloud" | "Blockchain & Web3";
  featured: boolean;
  metrics?: { label: string; value: string }[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  apkUrl?: string;
  driveUrl?: string;
  badge?: string;
  image?: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  type: "Full-time" | "Contract" | "Internship" | "Open Source";
  description: string;
  achievements: string[];
  technologies: string[];
}

export type SkillLevel =
  | "Production experience"
  | "Project experience"
  | "Working knowledge"
  | "Currently learning"
  | "Expert"
  | "Proficient"
  | "Familiar";

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level?: SkillLevel;
    iconName?: string;
  }[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  grade?: string;
  highlights: string[];
}

export interface Honor {
  title: string;
  event: string;
  date: string;
  description: string;
}

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  icon: string;
}
