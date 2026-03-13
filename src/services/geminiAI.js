/**
 * Google Gemini AI Service
 *
 * Calls the Gemini generateContent API directly.
 *
 * ⚠️  For PoC/demo only — API key is exposed in client-side code.
 *     In production, proxy through a backend.
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
- Reference specific clause numbers (e.g., Clause 6.1.2) and control IDs (e.g., A.5.1)
- Be concise but thorough
- Provide actionable next steps when relevant`;

export async function callGemini(userMessage, context = {}) {
  const { orgName, orgScope, assessed, score } = context;

  const contextPrefix = orgName
    ? `[Context: Organization="${orgName}", Scope="${orgScope || "ISMS"}", Controls assessed=${assessed}/93, Compliance score=${score}%]\n\n`
    : "";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.gemini.model}:generateContent?key=${AI_CONFIG.gemini.apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [{ text: contextPrefix + userMessage }],
        },
      ],
      generationConfig: {
        maxOutputTokens: AI_CONFIG.gemini.maxTokens,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.error?.message || `Gemini API error: ${response.status}`
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .join("\n");

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return text;
}
