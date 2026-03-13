export default function Header({ orgName, orgScope, score, assessed, totalControls }) {
  const scoreColor = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{
      background: "#0c0c12", borderBottom: "1px solid #1a1a2e",
      padding: "10px 24px", display: "flex", alignItems: "center", gap: 14,
    }}>
      {/* Logo */}
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      }}>
        🔐
      </div>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>ISO 27001:2022 — {orgName}</div>
        <div style={{ fontSize: 11, color: "#5a5f75" }}>
          {orgScope || "Information Security Management System"}
        </div>
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor }}>{score}%</div>
          <div style={{ fontSize: 10, color: "#5a5f75" }}>Compliance</div>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: `conic-gradient(${scoreColor} ${score * 3.6}deg, #1a1a2e 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", background: "#0c0c12",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
          }}>
            {assessed}/{totalControls}
          </div>
        </div>
      </div>
    </div>
  );
}
