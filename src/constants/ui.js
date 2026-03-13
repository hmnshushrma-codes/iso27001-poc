/**
 * Navigation tabs and UI config
 */

export const NAV_TABS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "assess", label: "Assess Controls", icon: "📋" },
  { id: "chat", label: "AI Consultant", icon: "🤖" },
  { id: "soa", label: "Statement of Applicability", icon: "📄" },
  { id: "gap", label: "Gap Analysis", icon: "🎯" },
];

export const ASSESSMENT_OPTIONS = [
  { val: "implemented", label: "✅", tip: "Implemented" },
  { val: "partial", label: "🟡", tip: "Partial" },
  { val: "not_implemented", label: "❌", tip: "Not Implemented" },
  { val: "not_applicable", label: "⬜", tip: "N/A" },
];

export const PRIORITY_COLORS = {
  critical: { bg: "#ef444422", text: "#ef4444" },
  high: { bg: "#f59e0b22", text: "#f59e0b" },
  medium: { bg: "#60a5fa22", text: "#60a5fa" },
  low: { bg: "#5a5f7522", text: "#5a5f75" },
};

export const STATUS_COLORS = {
  implemented: "#22c55e",
  partial: "#f59e0b",
  not_implemented: "#ef4444",
  not_applicable: "#5a5f75",
  default: "#3a3f55",
};

export const SUGGESTED_QUESTIONS = [
  "How do I define my ISMS scope?",
  "Explain the risk assessment process",
  "What's new in ISO 27001:2022?",
  "How does the certification audit work?",
  "Help me with the Statement of Applicability",
  "What policies do I need?",
];
