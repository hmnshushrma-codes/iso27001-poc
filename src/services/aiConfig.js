/**
 * AI Provider Configuration
 *
 * "api"  → Calls /api/chat serverless function (Gemini proxied server-side, key hidden)
 * "mock" → Offline built-in responses (no API needed)
 *
 * Default is "api" — the serverless function handles the Gemini key.
 * Set VITE_AI_PROVIDER=mock to force offline mode.
 */

export const AI_CONFIG = {
  provider: import.meta.env.VITE_AI_PROVIDER || "api",
};
