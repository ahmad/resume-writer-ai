export interface ResumeData {
  changeSummary: string;
  resumeName: string;
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: {
    [key: string]: string[];
  };
  experience: Experience[];
  education: Education[];
  projects: Project[];
  generated?: boolean;
  template?: 'modern' | 'ats-friendly';
}


export interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  year: string;
} 

export interface Project {
  title: string;
  description: string;
  link: Link;
}

export interface Link {
  label: string;
  href: string;
}