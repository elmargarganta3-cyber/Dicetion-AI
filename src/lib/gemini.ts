import { DecisionAnalysis } from "../types";

/**
 * Sends a decision analysis request to the backend API.
 * This approach is more secure (API keys stay on the server) 
 * and avoids permission issues in the browser.
 */
export async function analyzeDecision(question: string, userPriorities?: Record<string, number>): Promise<DecisionAnalysis> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, userPriorities }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Internal Server Error" }));
    
    // Provide user-friendly messaging for common error scenarios
    if (response.status === 403 || errorData.error?.includes("permission")) {
      throw new Error("Gemini API permission denied. Please verify your API Key has access to the 'gemini-1.5-flash' model.");
    }
    
    if (response.status === 401 || errorData.error?.includes("missing")) {
      throw new Error("Gemini API Key is missing. Please ensure 'GEMINI_API_KEY' is added to your Secrets in AI Studio.");
    }
    
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  return response.json();
}
