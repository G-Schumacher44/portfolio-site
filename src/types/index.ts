export interface NavItem {
  label: string;
  href: string;
  children?: NavDropdownItem[];
}

export interface NavDropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface StatItem {
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface ServiceData {
  title: string;
  description: string;
  includes: string[];
  proofLabel: string;
  proofHref: string;
  proofExternal?: boolean;
  icon: string;
}

export interface CaseStudyData {
  title: string;
  image: string;
  imageAlt: string;
  problem: string;
  delivered: string;
  impact: string;
  techStack: string;
  modalSrc: string;
  links: { label: string; href: string; external?: boolean }[];
}

export interface ProjectData {
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  techStack: string;
  modalSrc: string;
  links: { label: string; href: string; external?: boolean }[];
}

export interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

export interface SkillItem {
  label: string;
  href?: string;
}

export interface PipelineStage {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  stats: string[];
  codeSnippet?: string;
  codeLanguage?: string;
  details: string;
  links?: { label: string; href: string; external?: boolean }[];
}

export interface ContactCard {
  title: string;
  description: string;
  ctas: { label: string; href: string; primary?: boolean; external?: boolean }[];
}
