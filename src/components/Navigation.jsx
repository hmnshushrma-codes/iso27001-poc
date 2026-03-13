import { NAV_TABS } from "../constants";
import { getProviderInfo } from "../services";

export default function Navigation({ activeView, onNavigate }) {
  const provider = getProviderInfo();

  return (
    <div style={{
      display: "flex", alignItems: "center",
      borderBottom: "1px solid #1a1a2e", padding: "0 24px", background: "#0a0a10",
    }}>
      <div style={{ display: "flex", flex: 1 }}>
        {NAV_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onNavigate(t.id)}
            style={{
              background: "transparent", border: "none",
              padding: "10px 16px", cursor: "pointer",
              fontSize: 12, fontWeight: 600,
              color: activeView === t.id ? "#818cf8" : "#4a4f65",
              borderBottom: activeView === t.id ? "2px solid #818cf8" : "2px solid transparent",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* AI Provider badge */}
      <div style={{
        fontSize: 10, color: "#5a5f75", display: "flex",
        alignItems: "center", gap: 4, padding: "4px 8px",
        background: "#12121a", borderRadius: 6,
        border: `1px solid ${provider.configured ? "#22c55e33" : "#ef444433"}`,
      }}>
        <span style={{ fontSize: 12 }}>{provider.icon}</span>
        <span>{provider.name}</span>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: provider.configured ? "#22c55e" : "#ef4444",
        }} />
      </div>
    </div>
  );
}
