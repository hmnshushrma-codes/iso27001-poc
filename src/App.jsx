import { useState } from "react";
import {
  Landing,
  Header,
  Navigation,
  Dashboard,
  AssessControls,
  AIChat,
  StatementOfApplicability,
  GapAnalysis,
} from "./components";
import { useAssessment } from "./hooks";

export default function App() {
  // App-level state
  const [view, setView] = useState("landing");
  const [orgName, setOrgName] = useState("");
  const [orgScope, setOrgScope] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Assessment state via custom hook
  const {
    assessments,
    metrics,
    setControlStatus,
    getThemeMetrics,
    getGaps,
    getImplemented,
  } = useAssessment();

  // Landing → Dashboard transition
  const handleStart = ({ orgName: name, orgScope: scope }) => {
    setOrgName(name);
    setOrgScope(scope);
    setView("dashboard");
  };

  // Theme click from dashboard → navigate to assess with filter
  const handleThemeClick = (themeId) => {
    setSelectedTheme(themeId);
    setView("assess");
  };

  // ── Landing screen ──
  if (view === "landing") {
    return <Landing onStart={handleStart} />;
  }

  // ── Main app layout ──
  return (
    <div style={{ background: "#08080a", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e0e0e0" }}>
      <Header
        orgName={orgName}
        orgScope={orgScope}
        score={metrics.score}
        assessed={metrics.assessed}
        totalControls={metrics.totalControls}
      />

      <Navigation activeView={view} onNavigate={setView} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        {view === "dashboard" && (
          <Dashboard
            metrics={metrics}
            getThemeMetrics={getThemeMetrics}
            onThemeClick={handleThemeClick}
          />
        )}

        {view === "assess" && (
          <AssessControls
            assessments={assessments}
            onSetStatus={setControlStatus}
            initialTheme={selectedTheme}
          />
        )}

        {view === "chat" && (
          <AIChat
            orgName={orgName}
            orgScope={orgScope}
            metrics={metrics}
          />
        )}

        {view === "soa" && (
          <StatementOfApplicability
            assessments={assessments}
            orgName={orgName}
            assessed={metrics.assessed}
          />
        )}

        {view === "gap" && (
          <GapAnalysis
            assessed={metrics.assessed}
            getGaps={getGaps}
            getImplemented={getImplemented}
          />
        )}
      </div>
    </div>
  );
}
