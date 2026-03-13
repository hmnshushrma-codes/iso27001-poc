/**
 * Unified AI Service
 *
 * Routes to serverless API proxy or offline mock.
 * Single interface for the rest of the app.
 */

import { AI_CONFIG } from "./aiConfig";
import { callAPI } from "./apiClient";
import { getMockResponse } from "./mockAI";

/**
 * Send a message to the AI and get a response.
 *
 * @param {string} message - User's question
 * @param {object} context - App context (orgName, orgScope, assessed, score)
 * @returns {Promise<{ text: string, provider: string }>}
 */
export async function sendMessage(message, context = {}) {
  const { provider } = AI_CONFIG;

  // Mock mode — no API call
  if (provider === "mock") {
    // Simulate slight delay for realism
    await new Promise((r) => setTimeout(r, 400));
    return {
      text: getMockResponse(message, context),
      provider: "mock",
    };
  }

  // API mode — call serverless function
  try {
    const result = await callAPI(message, context);
    return {
      text: result.text,
      provider: result.provider || "gemini",
    };
  } catch (error) {
    console.error("AI API error:", error);

    // Fall back to mock on any error
    return {
      text:
        getMockResponse(message, context) +
        "\n\n---\n⚠️ *AI service temporarily unavailable. Showing offline guidance.*",
      provider: "mock-fallback",
    };
  }
}

/**
 * Get the current AI provider info for display.
 */
export function getProviderInfo() {
  const { provider } = AI_CONFIG;

  if (provider === "mock") {
    return { name: "Offline Mode", icon: "📚", provider: "mock", configured: true };
  }

  return { name: "Gemini AI", icon: "✨", provider: "api", configured: true };
}
