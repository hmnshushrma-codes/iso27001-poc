import { ANNEX_A, CLAUSES } from "../constants";

export default function Dashboard({ metrics, getThemeMetrics, onThemeClick }) {
  const { totalControls, assessed, implemented, partial, notImpl } = metrics;

  const statCards = [
    { label: "Total Controls", val: totalControls, color: "#818cf8" },
    { label: "Assessed", val: assessed, color: "#60a5fa" },
    { label: "Implemented", val: implemented, color: "#22c55e" },
    { label: "Partial", val: partial, color: "#f59e0b" },
    { label: "Not Implemented", val: notImpl, color: "#ef4444" },
  ];

  return (
    <>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            background: "#12121a", border: "1px solid #1e1e30",
            borderRadius: 10, padding: 16, textAlign: "center",
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#5a5f75", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Annex A Themes */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Annex A Themes</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {ANNEX_A.map((theme) => {
          const { themeAssessed, themeScore } = getThemeMetrics(theme);
          return (
            <div
              key={theme.id}
              onClick={() => onThemeClick(theme.id)}
              style={{
                background: "#12121a", border: `1px solid ${theme.color}33`,
                borderRadius: 10, padding: 16, cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.color + "88")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.color + "33")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{theme.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: theme.color }}>{theme.theme}</div>
                  <div style={{ fontSize: 11, color: "#5a5f75" }}>{theme.count} controls</div>
                </div>
              </div>
              <div style={{ width: "100%", height: 6, background: "#1a1a2e", borderRadius: 3, marginBottom: 6 }}>
                <div style={{
                  width: `${(themeAssessed / theme.count) * 100}%`,
                  height: "100%", background: theme.color, borderRadius: 3,
                  transition: "width 0.5s",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#5a5f75" }}>
                {themeAssessed}/{theme.count} assessed · {themeScore}% compliant
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Clauses */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Mandatory Clauses (4-10)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {CLAUSES.map((cl) => (
          <div key={cl.id} style={{
            background: "#12121a", border: "1px solid #1e1e30",
            borderRadius: 8, padding: "12px 14px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#818cf8", marginBottom: 6 }}>
              Clause {cl.id}: {cl.name}
            </div>
            {cl.items.map((item, i) => (
              <div key={i} style={{ fontSize: 11, color: "#5a5f75", padding: "2px 0", display: "flex", gap: 6 }}>
                <span style={{ color: "#3a3f55" }}>•</span> {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
