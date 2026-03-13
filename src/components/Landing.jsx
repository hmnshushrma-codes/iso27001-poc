import { useState } from "react";

export default function Landing({ onStart }) {
  const [orgName, setOrgName] = useState("");
  const [orgScope, setOrgScope] = useState("");

  const handleStart = () => {
    if (orgName.trim()) {
      onStart({ orgName: orgName.trim(), orgScope: orgScope.trim() });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleStart();
  };

  return (
    <div style={{ background: "#08080a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 650, padding: "0 24px" }}>
        {/* Logo */}
        <div style={{
          width: 72, height: 72, borderRadius: 16,
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 36,
        }}>
          🔐
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f0", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
          ISO/IEC 27001:2022
        </h1>
        <p style={{ fontSize: 17, color: "#7c8aed", margin: "0 0 6px", fontWeight: 500 }}>
          AI-Powered Certification Assistant
        </p>
        <p style={{ fontSize: 14, color: "#5a5f75", margin: "0 0 32px", lineHeight: 1.7 }}>
          Complete ISMS implementation guide with all 93 Annex A controls.<br />
          Gap analysis, Statement of Applicability, and audit readiness — powered by AI.
        </p>

        {/* Inputs */}
        <div style={{ display: "flex", gap: 12, maxWidth: 420, margin: "0 auto 20px" }}>
          <input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Organization name"
            style={{
              flex: 1, background: "#14141a", border: "1px solid #2a2a3a",
              borderRadius: 8, padding: "12px 14px", fontSize: 14,
              color: "#e0e0e0", outline: "none",
            }}
          />
        </div>
        <input
          value={orgScope}
          onChange={(e) => setOrgScope(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ISMS scope (e.g., Ship classification & certification services)"
          style={{
            width: "100%", maxWidth: 420, background: "#14141a",
            border: "1px solid #2a2a3a", borderRadius: 8, padding: "12px 14px",
            fontSize: 14, color: "#e0e0e0", outline: "none",
            marginBottom: 24, boxSizing: "border-box",
          }}
        />

        {/* CTA */}
        <div>
          <button
            onClick={handleStart}
            style={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              border: "none", padding: "14px 40px", borderRadius: 10,
              fontSize: 15, fontWeight: 700, color: "#fff",
              cursor: orgName.trim() ? "pointer" : "not-allowed",
              opacity: orgName.trim() ? 1 : 0.5,
              boxShadow: "0 4px 24px rgba(37,99,235,0.3)",
            }}
          >
            Begin ISMS Journey →
          </button>
        </div>

        {/* Features */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 40, fontSize: 12, color: "#3a3f55" }}>
          <span>📋 93 Annex A Controls</span>
          <span>🏛️ 7 Mandatory Clauses</span>
          <span>🤖 AI Guidance</span>
          <span>📄 SoA Generator</span>
        </div>
      </div>
    </div>
  );
}
