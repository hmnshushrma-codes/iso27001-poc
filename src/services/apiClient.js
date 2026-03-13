/**
 * API Client
 *
 * Calls our /api/chat Vercel serverless function.
 * The function proxies to Gemini with rate limiting + retry.
 * API key never reaches the browser.
 */

export async function callAPI(message, context = {}) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context }),
  });

  // Rate limited by our own server
  if (response.status === 429) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Rate limit exceeded. Please wait a moment.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Server error: ${response.status}`);
  }

  return response.json();
}
