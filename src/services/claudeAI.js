/**
 * Claude (Anthropic) AI Service
 *
 * Calls the Anthropic Messages API directly.
 *
 * ⚠️  For PoC/demo only — API key is exposed in client-side code.
 *     In production, proxy through a backend (Vercel Serverless Function, etc.)
 */

import { AI_CONFIG } from "./aiConfig";

const SYSTEM_PROMPT = `You are an expert ISO 27001:2022 consultant specializing in Information Security Management Systems (ISMS). You provide practical, actionable guidance for organizations seeking ISO 27001 certification.

Your expertise covers:
- All 93 Annex A controls across 4 themes (Organizational, People, Physical, Technological)
- The 11 new controls introduced in the 2022 revision
- Mandatory clauses 4-10
- Risk assessment methodology
- Statement of Applicability (SoA) preparation
- Gap analysis and remediation planning
- Certification audit preparation (Stage 1 & Stage 2)
- Maritime industry context (ship classification, survey, certification services)

Guidelines:
- Use markdown formatting with **bold** for emphasis
- Use bullet points (•) for lists
- Reference specific clause numbers (e.g., Clause 6.1.2)
- Reference specific control IDs (e.g., A.5.1, A.8.24)
- Be concise but thorough
- Provide actionable next steps when relevant
- When discussing maritime context, reference IACS standards, IMO regulations, and classification society operations`;

export async function callClaude(userMessage, context = {}) {
  const { orgName, orgScope, assessed, score } = context;

  const contextPrefix = orgName
    ? `[Context: Organization="${orgName}", Scope="${orgScope || "ISMS"}", Controls assessed=${assessed}/93, Compliance score=${score}%]\n\n`
    : "";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": AI_CONFIG.claude.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: AI_CONFIG.claude.model,
      max_tokens: AI_CONFIG.claude.maxTokens,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: contextPrefix + userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.error?.message || `Claude API error: ${response.status}`
    );
  }

  const data = await response.json();
  const text = data.content
    ?.filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  if (!text) {
    throw new Error("Empty response from Claude");
  }

  return text;
}
