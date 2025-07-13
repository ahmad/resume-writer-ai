export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ResumeApiResponse extends ApiResponse<ResumeData> {
  changeSummary?: string;
}

export interface CoverLetterApiResponse extends ApiResponse<CoverLetter> {
  // Add any cover letter specific fields here
}

export interface JobApiResponse extends ApiResponse<JobData> {
  // Add any job specific fields here
}

// Re-export types that might be needed
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

export interface CoverLetter {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  content: string;
  date: string;
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

export interface JobData {
  id?: string;
  userId: string;
  jobDescription: string;
  aiResume?: ResumeData;
  selectedResume: ResumeData;
  jobUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: any;
  updatedAt: any;
} 