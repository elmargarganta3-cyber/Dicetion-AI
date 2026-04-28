import { GoogleGenAI, Type } from "@google/genai";
import { DecisionAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeDecision(question: string, userPriorities?: Record<string, number>): Promise<DecisionAnalysis> {
  const prioritiesContext = userPriorities 
    ? `The user has specified these priorities (weights 1-5): ${JSON.stringify(userPriorities)}.`
    : "Use balanced weights (3/5) for standard factors like Financial, Emotional, Time, and Risk unless the context suggests otherwise.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ 
      parts: [{ 
        text: `Analyze the following decision: "${question}". 
        ${prioritiesContext}
        
        SMART OPTION GENERATOR:
        1. Include obvious choices.
        2. Suggest creative "middle-ground" or "transition" alternatives the user may have missed.
        
        WEIGHTED SCORING:
        For each option, evaluate factors (Financial, Emotional, Time/Effort, Risk).
        Assign each a WEIGHT (1-5) and a RATING (1-10).
        Calculate TotalScore = sum(weight * rating).
        
        CATEGORIZED PROS/CONS:
        Strictly categorize every pro and con into: 'Financial', 'Emotional', 'Time/Effort', 'Risk', or 'Other'.` 
      }] 
    }],
    config: {
      systemInstruction: `You are an elite strategic decision-making engine. 
      Your role is to provide cold, analytical, yet comprehensive choice architecture.
      
      You must always return a JSON object adhering to the schema.
      Be realistic, identify 'Update-Gaps' in the user's thinking, and suggest superior alternatives.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decisionClarified: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              goal: { type: Type.STRING }
            },
            required: ["question", "goal"]
          },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                pros: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      category: { type: Type.STRING, enum: ['Financial', 'Emotional', 'Time/Effort', 'Risk', 'Other'] }
                    }
                  } 
                },
                cons: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      category: { type: Type.STRING, enum: ['Financial', 'Emotional', 'Time/Effort', 'Risk', 'Other'] }
                    }
                  } 
                },
                probability: {
                  type: Type.OBJECT,
                  properties: {
                    successPercent: { type: Type.NUMBER },
                    explanation: { type: Type.STRING },
                    risks: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["successPercent", "explanation", "risks"]
                },
                factors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      weight: { type: Type.NUMBER },
                      rating: { type: Type.NUMBER }
                    }
                  }
                },
                totalScore: { type: Type.NUMBER }
              },
              required: ["id", "name", "pros", "cons", "probability", "factors", "totalScore"]
            }
          },
          recommendation: {
            type: Type.OBJECT,
            properties: {
              bestOption: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["bestOption", "reasoning"]
          },
          reasoningSummary: { type: Type.STRING },
          followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["decisionClarified", "options", "recommendation", "reasoningSummary", "followUpQuestions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
}
