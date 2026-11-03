export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "Full-Stack" | "Systems" | "AI & ML" | "Dev Tools";
  featured: boolean;
  metrics?: { label: string; value: string }[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
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

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level?: "Expert" | "Proficient" | "Familiar";
    iconName?: string;
  }[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  icon: string;
}
