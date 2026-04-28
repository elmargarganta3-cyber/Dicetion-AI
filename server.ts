import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Secure API endpoint for Decision Analysis
app.post("/api/analyze", async (req, res) => {
  const { question, userPriorities } = req.body;

  try {
    // Priority order: Environment variable (Secrets), then fallback to hardcoded key
    let apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "undefined" || apiKey === "MY_GEMINI_API_KEY") {
      apiKey = "AIzaSyDJK1IHunWyxoiwAmlEhPjcwYgo05DTPeE";
    }

    if (!apiKey) {
      return res.status(401).json({ 
        error: "GEMINI_API_KEY is missing. Please add it to your Secrets in AI Studio." 
      });
    }

    const genAI = new GoogleGenAI({ apiKey });
    
    const prioritiesContext = userPriorities 
      ? `The user has specified these priorities (weights 1-5): ${JSON.stringify(userPriorities)}.`
      : "Use balanced weights (3/5) for standard factors.";

    const prompt = `Analyze the following decision: "${question}". 
          ${prioritiesContext}
          
          SMART OPTION GENERATOR:
          1. Include obvious choices.
          2. Suggest creative "middle-ground" or "transition" alternatives.
          
          WEIGHTED SCORING:
          Evaluate factors (Financial, Emotional, Time/Effort, Risk).
          Assign each a WEIGHT (1-5) and a RATING (1-10).
          
          CATEGORIZED PROS/CONS:
          Strictly categorize into: 'Financial', 'Emotional', 'Time/Effort', 'Risk', or 'Other'.`;

    const model = genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are an elite strategic decision-making engine. Provide analytical choice architecture in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decisionClarified: {
              type: Type.OBJECT,
              properties: { question: { type: Type.STRING }, goal: { type: Type.STRING } },
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
                      properties: { text: { type: Type.STRING }, category: { type: Type.STRING } },
                      required: ["text", "category"]
                    } 
                  },
                  cons: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT, 
                      properties: { text: { type: Type.STRING }, category: { type: Type.STRING } },
                      required: ["text", "category"]
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
                      properties: { name: { type: Type.STRING }, weight: { type: Type.NUMBER }, rating: { type: Type.NUMBER } },
                      required: ["name", "weight", "rating"]
                    }
                  },
                  totalScore: { type: Type.NUMBER }
                },
                required: ["id", "name", "pros", "cons", "probability", "factors", "totalScore"]
              }
            },
            recommendation: {
              type: Type.OBJECT,
              properties: { bestOption: { type: Type.STRING }, reasoning: { type: Type.STRING } },
              required: ["bestOption", "reasoning"]
            },
            reasoningSummary: { type: Type.STRING },
            followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["decisionClarified", "options", "recommendation", "reasoningSummary", "followUpQuestions"]
        }
      }
    });

    const result = await model;
    res.json(JSON.parse(result.text));
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze decision" });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
