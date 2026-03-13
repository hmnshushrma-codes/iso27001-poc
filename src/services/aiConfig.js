/**
 * AI Provider Configuration
 *
 * Reads from environment variables to determine which AI backend to use.
 * Supported: "claude" | "gemini" | "mock"
 *
 * In Vite, env vars prefixed with VITE_ are exposed to the client.
 * NEVER put secrets in VITE_ vars for production — use a backend proxy instead.
 * This is acceptable for a PoC / demo deployment.
 */

export const AI_CONFIG = {
  provider: import.meta.env.VITE_AI_PROVIDER || "mock",
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY || "",
    model: "claude-sonnet-4-20250514",
    maxTokens: 1024,
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
    model: "gemini-2.0-flash",
    maxTokens: 1024,
  },
};

export const isAIConfigured = () => {
  const { provider, claude, gemini } = AI_CONFIG;
  if (provider === "mock") return true;
  if (provider === "claude") return !!claude.apiKey;
  if (provider === "gemini") return !!gemini.apiKey;
  return false;
};
