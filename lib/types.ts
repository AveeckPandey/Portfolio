export interface Project {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image?: string;
  url?: string;
  github?: string;
  metrics?: string[];
  featured?: boolean;
}

export interface AIProject extends Project {
  model?: string;
  retrieval?: string;
  evaluation?: string;
  latency?: string;
  architecture?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ExpertiseItem {
  title: string;
  description: string;
  icon?: string;
}

export interface HeroContent {
  greeting: string;
  name: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
}

export interface PortfolioData {
  identity: {
    title: string;
    shortTitle: string;
    metaTitle: string;
    metaDescription: string;
  };
  hero: HeroContent;
  expertise: ExpertiseItem[];
  projects: (Project | AIProject)[];
  experience: ExperienceItem[];
  skills: SkillCategory[];
}
