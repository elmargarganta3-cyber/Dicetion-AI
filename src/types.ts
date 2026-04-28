export interface Factor {
  name: string;
  weight: number; // 1-5
  rating: number; // 1-10
}

export interface ProCon {
  text: string;
  category: 'Financial' | 'Emotional' | 'Time/Effort' | 'Risk' | 'Other';
}

export interface ProbabilityData {
  successPercent: number;
  explanation: string;
  risks: string[];
}

export interface DecisionOption {
  id: string;
  name: string;
  pros: ProCon[];
  cons: ProCon[];
  probability: ProbabilityData;
  factors: Factor[];
  totalScore: number;
}

export interface RecommendationData {
  bestOption: string;
  reasoning: string;
}

export interface DecisionAnalysis {
  decisionClarified: {
    question: string;
    goal: string;
  };
  options: DecisionOption[];
  recommendation: RecommendationData;
  reasoningSummary: string;
  followUpQuestions: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  analysis: DecisionAnalysis;
}
