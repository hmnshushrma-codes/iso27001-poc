/**
 * Unified AI Service
 *
 * Routes to the configured AI provider (Claude / Gemini / Mock).
 * Provides a single interface for the rest of the app.
 */

import { AI_CONFIG, isAIConfigured } from "./aiConfig";
import { callClaude } from "./claudeAI";
import { callGemini } from "./geminiAI";
import { getMockResponse } from "./mockAI";

/**
 * Send a message to the AI and get a response.
 *
 * @param {string} message - User's question
 * @param {object} context - App context (orgName, orgScope, assessed, score)
 * @returns {Promise<{ text: string, provider: string }>}
 */
export async function sendMessage(message, context = {}) {
  const provider = AI_CONFIG.provider;

  // Always fall back to mock if not configured
  if (!isAIConfigured()) {
    console.warn(`AI provider "${provider}" not configured. Using mock.`);
    return {
      text: getMockResponse(message, context),
      provider: "mock",
    };
  }

  try {
    let text;

    switch (provider) {
      case "claude":
        text = await callClaude(message, context);
        break;

      case "gemini":
        text = await callGemini(message, context);
        break;

      case "mock":
      default:
        text = getMockResponse(message, context);
        break;
    }

    return { text, provider };
  } catch (error) {
    console.error(`AI (${provider}) error:`, error);

    // Fall back to mock on any API error
    return {
      text:
        getMockResponse(message, context) +
        `\n\n---\n⚠️ *AI service unavailable (${error.message}). Showing offline guidance.*`,
      provider: "mock-fallback",
    };
  }
}

/**
 * Get the current AI provider info for display.
 */
export function getProviderInfo() {
  const provider = AI_CONFIG.provider;
  const configured = isAIConfigured();

  const labels = {
    claude: { name: "Claude (Anthropic)", icon: "🤖" },
    gemini: { name: "Gemini (Google)", icon: "✨" },
    mock: { name: "Offline Mode", icon: "📚" },
  };

  return {
    ...labels[provider] || labels.mock,
    provider,
    configured,
  };
}
