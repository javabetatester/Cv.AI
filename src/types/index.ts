export interface CVData {
  name: string;
  position: string;
  area: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  summary: string;
  skills: {
    programming: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
    methodologies: string[];
    languages: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    period: string;
    location: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    course: string;
    year: string;
    location: string;
    projects: string[];
  }>;
  certifications: Array<{
    name: string;
    institution: string;
    year: string;
  }>;
  projects: Array<{
    name: string;
    technologies: string[];
    description: string;
    achievements: string[];
    link?: string;
  }>;
  achievements: string[];
  activities: string[];
  keywords: string[];
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export type Step = 'upload' | 'job-description' | 'processing' | 'result';

export interface UploadedFile {
  file: File;
  name: string;
  size: string;
}