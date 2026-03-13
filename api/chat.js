/**
 * /api/chat — Vercel Serverless Function
 *
 * Proxies AI requests to Gemini API server-side.
 * - API key never reaches the browser
 * - Built-in rate limiting (per-IP, in-memory)
 * - Retry with exponential backoff on 429s
 * - Falls back to mock responses if all retries fail
 */

const SYSTEM_PROMPT = `You are an expert ISO 27001:2022 consultant specializing in Information Security Management Systems (ISMS). You provide practical, actionable guidance for organizations seeking ISO 27001 certification.

Your expertise covers:
- All 93 Annex A controls across 4 themes (Organizational, People, Physical, Technological)
- The 11 new controls introduced in the 2022 revision
- Mandatory clauses 4-10
- Risk assessment methodology
- Statement of Applicability (SoA) preparation
- Gap analysis and remediation planning
- Certification audit preparation (Stage 1 & Stage 2)
- Maritime industry context (ship classification, survey, certification services, IACS standards, IMO regulations)

Guidelines:
- Use markdown formatting with **bold** for emphasis
- Use bullet points (•) for lists
- Reference specific clause numbers (e.g., Clause 6.1.2) and control IDs (e.g., A.5.1)
- Be concise but thorough
- Provide actionable next steps when relevant`;

// ── In-memory rate limiter ──
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// ── Retry with backoff ──
async function callGeminiWithRetry(message, context, maxRetries = 3) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured on server");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const { orgName, orgScope, assessed, score } = context;
  const contextPrefix = orgName
    ? `[Context: Organization="${orgName}", Scope="${orgScope || "ISMS"}", Controls assessed=${assessed}/93, Compliance score=${score}%]\n\n`
    : "";

  const body = JSON.stringify({
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        parts: [{ text: contextPrefix + message }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  });

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      // Rate limited by Google — wait and retry
      if (response.status === 429) {
        if (attempt < maxRetries) {
          const waitMs = Math.min(1000 * Math.pow(2, attempt), 8000); // 1s, 2s, 4s, 8s
          console.log(`Gemini 429 — retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }
        throw new Error("Gemini rate limit exceeded after retries");
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n");

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      return { text, provider: "gemini" };
    } catch (err) {
      if (attempt === maxRetries) throw err;
      // Network errors — retry
      const waitMs = 1000 * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

// ── Handler ──
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit check
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const rateCheck = checkRateLimit(ip);

  res.setHeader("X-RateLimit-Remaining", rateCheck.remaining);

  if (!rateCheck.allowed) {
    res.setHeader("Retry-After", rateCheck.retryAfter);
    return res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: rateCheck.retryAfter,
      message: `Too many requests. Please wait ${rateCheck.retryAfter} seconds.`,
    });
  }

  // Parse body
  const { message, context } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'message' field" });
  }

  try {
    const result = await callGeminiWithRetry(message, context || {});
    return res.status(200).json(result);
  } catch (err) {
    console.error("AI error:", err.message);
    return res.status(502).json({
      error: "AI service unavailable",
      message: err.message,
      provider: "error",
    });
  }
}
