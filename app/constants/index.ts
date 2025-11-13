// Mock interviewer configuration
export const interviewer = {
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an AI interviewer conducting a professional job interview."
      }
    ],
    temperature: 0.7,
    maxTokens: 500,
  },
  voice: {
    provider: "11labs",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    stability: 0.5,
    similarityBoost: 0.8,
    style: 0.2,
  },
  firstMessage: "Hello! Welcome to your interview today.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  recordingEnabled: true,
  endCallMessage: "Thank you for your time today.",
  maxDurationSeconds: 1800,
};

// Interview types
export const INTERVIEW_TYPES = {
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral", 
  MIXED: "Mixed",
  SYSTEM_DESIGN: "System Design",
  CODING: "Coding"
} as const;

// Experience levels
export const EXPERIENCE_LEVELS = {
  JUNIOR: "Junior",
  MID: "Mid-level", 
  SENIOR: "Senior",
  LEAD: "Lead",
  PRINCIPAL: "Principal"
} as const;

// Common job roles
export const JOB_ROLES = {
  FRONTEND: "Frontend Developer",
  BACKEND: "Backend Developer",
  FULLSTACK: "Full Stack Developer",
  MOBILE: "Mobile Developer",
  DEVOPS: "DevOps Engineer",
  DATA_SCIENTIST: "Data Scientist",
  PRODUCT_MANAGER: "Product Manager",
  UI_UX: "UI/UX Designer"
} as const;

export type InterviewType = typeof INTERVIEW_TYPES[keyof typeof INTERVIEW_TYPES];
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[keyof typeof EXPERIENCE_LEVELS];
export type JobRole = typeof JOB_ROLES[keyof typeof JOB_ROLES];