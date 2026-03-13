import { useState } from "react";
import { ANNEX_A, ASSESSMENT_OPTIONS, PRIORITY_COLORS } from "../constants";

export default function AssessControls({ assessments, onSetStatus, initialTheme }) {
  const [selectedTheme, setSelectedTheme] = useState(initialTheme || null);

  return (
    <>
      {/* Theme filter buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          onClick={() => setSelectedTheme(null)}
          style={{
            background: !selectedTheme ? "#818cf822" : "#12121a",
            border: `1px solid ${!selectedTheme ? "#818cf8" : "#1e1e30"}`,
            borderRadius: 8, padding: "8px 16px", cursor: "pointer",
            color: !selectedTheme ? "#818cf8" : "#5a5f75",
            fontSize: 12, fontWeight: 600,
          }}
        >
          All (93)
        </button>
        {ANNEX_A.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTheme(t.id)}
            style={{
              background: selectedTheme === t.id ? t.color + "22" : "#12121a",
              border: `1px solid ${selectedTheme === t.id ? t.color : "#1e1e30"}`,
              borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              color: selectedTheme === t.id ? t.color : "#5a5f75",
              fontSize: 12, fontWeight: 600,
            }}
          >
            {t.icon} {t.theme} ({t.count})
          </button>
        ))}
      </div>

      {/* Controls list */}
      {ANNEX_A.filter((t) => !selectedTheme || t.id === selectedTheme).map((theme) => (
        <div key={theme.id} style={{ marginBottom: 20 }}>
          {theme.controls.map((ctrl) => {
            const a = assessments[ctrl.id];
            const borderColor = a
              ? a.status === "implemented" ? "#22c55e33"
              : a.status === "partial" ? "#f59e0b33"
              : a.status === "not_applicable" ? "#5a5f7533"
              : "#ef444433"
              : "#1e1e30";
            const pColor = PRIORITY_COLORS[ctrl.priority] || PRIORITY_COLORS.low;

            return (
              <div
                key={ctrl.id}
                style={{
                  background: "#12121a", border: `1px solid ${borderColor}`,
                  borderRadius: 8, padding: "12px 16px", marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  {/* Control ID */}
                  <div style={{ minWidth: 48 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 800, color: theme.color, fontFamily: "monospace",
                    }}>
                      A.{ctrl.id}
                    </span>
                    {ctrl.isNew && (
                      <div style={{
                        fontSize: 8, background: "#7c3aed33", color: "#a78bfa",
                        padding: "1px 5px", borderRadius: 3, fontWeight: 700,
                        marginTop: 2, textAlign: "center",
                      }}>
                        NEW
                      </div>
                    )}
                  </div>

                  {/* Control info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", marginBottom: 3 }}>
                      {ctrl.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#5a5f75", lineHeight: 1.5 }}>
                      {ctrl.desc}
                    </div>
                    <div style={{ marginTop: 2 }}>
                      <span style={{
                        fontSize: 9, padding: "2px 6px", borderRadius: 3,
                        background: pColor.bg, color: pColor.text,
                        fontWeight: 700, textTransform: "uppercase",
                      }}>
                        {ctrl.priority}
                      </span>
                    </div>
                  </div>

                  {/* Assessment buttons */}
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    {ASSESSMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.val}
                        title={opt.tip}
                        onClick={() => onSetStatus(ctrl.id, opt.val)}
                        style={{
                          width: 32, height: 32, borderRadius: 6,
                          border: `1px solid ${a?.status === opt.val ? "#818cf8" : "#2a2a3a"}`,
                          background: a?.status === opt.val ? "#818cf822" : "#0a0a10",
                          cursor: "pointer", fontSize: 14,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
