import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface QuizQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options?: string[];
  category?: string;
  difficulty?: string;
  type?: string;
}

export interface QuizSubmission {
  userId: string;
  score: number;
  total: number;
  answers: any[];
}

export interface QuizConfig {
  amount: number;
  category?: string;
  difficulty?: string;
  quizType?: "general" | "technical" | "company";
  technicalSubject?: string;
  companyTag?: string;
}

export const quizApi = {
  fetchQuestions: async (config: QuizConfig) => {
    const params = new URLSearchParams({ amount: config.amount.toString() });
    if (config.category) params.append("category", config.category);
    if (config.difficulty) params.append("difficulty", config.difficulty);
    if (config.quizType) params.append("quizType", config.quizType);
    if (config.technicalSubject) params.append("technicalSubject", config.technicalSubject);
    if (config.companyTag) params.append("companyTag", config.companyTag);
    
    const response = await axios.get(`${API_BASE_URL}/api/quiz/fetch?${params}`);
    return response.data;
  },

  submitQuiz: async (submission: QuizSubmission) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/api/quiz/submit`,
      submission,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/quiz/leaderboard`);
    return response.data;
  },
};
