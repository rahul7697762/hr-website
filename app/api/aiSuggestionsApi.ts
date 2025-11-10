import { API_ENDPOINTS } from '../config/api';
import { ResumeData } from '../contexts/ResumeContext';

export interface Suggestion {
  id: string;
  section: 'summary' | 'experience' | 'education' | 'skills' | 'contact';
  type: 'keyword' | 'formatting' | 'content' | 'structure';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentText: string;
  suggestedText: string;
  reasoning: string;
}

export interface KeywordRecommendation {
  keyword: string;
  section: string;
  importance: 'high' | 'medium' | 'low';
  context: string;
}

export interface FormattingTip {
  tip: string;
  section: string;
  impact: string;
}

export interface AISuggestionsResponse {
  success: boolean;
  suggestions: {
    overallScore: number;
    suggestions: Suggestion[];
    keywordRecommendations: KeywordRecommendation[];
    formattingTips: FormattingTip[];
  };
  timestamp: string;
}

export const generateAISuggestions = async (
  resumeData: ResumeData,
  targetJob?: string,
  targetIndustry?: string
): Promise<AISuggestionsResponse> => {
  const response = await fetch(API_ENDPOINTS.AI_SUGGESTIONS.GENERATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...resumeData,
      targetJob,
      targetIndustry,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const checkAIServiceHealth = async (): Promise<{ status: string; message: string }> => {
  const response = await fetch(API_ENDPOINTS.AI_SUGGESTIONS.HEALTH);
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
};