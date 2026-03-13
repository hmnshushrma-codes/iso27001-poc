import { PRIORITY_COLORS } from "../constants";

export default function GapAnalysis({ assessed, getGaps, getImplemented }) {
  const notImplemented = getGaps("not_implemented");
  const partiallyImpl = getGaps("partial");
  const implemented = getImplemented();

  if (assessed === 0) {
    return (
      <>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>Gap Analysis & Remediation</h2>
        <p style={{ fontSize: 12, color: "#5a5f75", marginBottom: 20 }}>
          Controls requiring attention, prioritized by risk level
        </p>
        <div style={{ textAlign: "center", padding: "60px 0", color: "#3a3f55" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p style={{ fontSize: 14, color: "#5a5f75" }}>
            No controls assessed yet. Go to "Assess Controls" to begin.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>Gap Analysis & Remediation</h2>
      <p style={{ fontSize: 12, color: "#5a5f75", marginBottom: 20 }}>
        Controls requiring attention, prioritized by risk level
      </p>

      {/* Not Implemented */}
      {notImplemented.length > 0 && (
        <GapSection
          title="❌ Not Implemented"
          count={notImplemented.length}
          color="#ef4444"
          borderColor="#ef444433"
          items={notImplemented}
        />
      )}

      {/* Partially Implemented */}
      {partiallyImpl.length > 0 && (
        <GapSection
          title="🟡 Partially Implemented"
          count={partiallyImpl.length}
          color="#f59e0b"
          borderColor="#f59e0b33"
          items={partiallyImpl}
        />
      )}

      {/* Implemented */}
      {implemented.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", marginBottom: 10 }}>
            ✅ Implemented ({implemented.length} controls)
          </h3>
          <p style={{ fontSize: 12, color: "#5a5f75" }}>
            {implemented.length} controls fully implemented and operational.
            Ensure these are maintained and reviewed periodically.
          </p>
        </div>
      )}
    </>
  );
}

function GapSection({ title, count, color, borderColor, items }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 10 }}>
        {title} ({count} controls)
      </h3>
      {items.map((ctrl) => {
        const pColor = PRIORITY_COLORS[ctrl.priority] || PRIORITY_COLORS.low;
        return (
          <div
            key={ctrl.id}
            style={{
              background: "#12121a", border: `1px solid ${borderColor}`,
              borderRadius: 8, padding: "10px 14px", marginBottom: 6,
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <span style={{
              fontSize: 11, fontFamily: "monospace",
              color: ctrl.theme.color, fontWeight: 700, minWidth: 44,
            }}>
              A.{ctrl.id}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#c0c0d0" }}>{ctrl.name}</div>
              <div style={{ fontSize: 11, color: "#5a5f75" }}>{ctrl.desc}</div>
            </div>
            <span style={{
              fontSize: 9, padding: "3px 8px", borderRadius: 4,
              fontWeight: 700, textTransform: "uppercase",
              background: pColor.bg, color: pColor.text,
            }}>
              {ctrl.priority}
            </span>
          </div>
        );
      })}
    </div>
  );
}
