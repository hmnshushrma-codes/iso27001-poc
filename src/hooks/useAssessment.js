import { useState, useMemo } from "react";
import { ANNEX_A, TOTAL_CONTROLS } from "../constants";

/**
 * Custom hook for managing control assessment state + computed metrics.
 */
export function useAssessment() {
  const [assessments, setAssessments] = useState({});

  const metrics = useMemo(() => {
    const assessed = Object.keys(assessments).length;
    const implemented = Object.values(assessments).filter(
      (a) => a.status === "implemented"
    ).length;
    const partial = Object.values(assessments).filter(
      (a) => a.status === "partial"
    ).length;
    const notImpl = Object.values(assessments).filter(
      (a) => a.status === "not_implemented"
    ).length;
    const notApplicable = Object.values(assessments).filter(
      (a) => a.status === "not_applicable"
    ).length;
    const score =
      assessed > 0
        ? Math.round(
            ((implemented + partial * 0.5) /
              (assessed - notApplicable || 1)) *
              100
          )
        : 0;

    return {
      totalControls: TOTAL_CONTROLS,
      assessed,
      implemented,
      partial,
      notImpl,
      notApplicable,
      score,
    };
  }, [assessments]);

  const setControlStatus = (controlId, status) => {
    setAssessments((prev) => ({
      ...prev,
      [controlId]: { status, note: "" },
    }));
  };

  const getThemeMetrics = (theme) => {
    const themeAssessed = theme.controls.filter(
      (c) => assessments[c.id]
    ).length;
    const themeImpl = theme.controls.filter(
      (c) => assessments[c.id]?.status === "implemented"
    ).length;
    const themeScore =
      themeAssessed > 0
        ? Math.round((themeImpl / themeAssessed) * 100)
        : 0;

    return { themeAssessed, themeImpl, themeScore };
  };

  const getGaps = (statusFilter) => {
    return ANNEX_A.flatMap((t) =>
      t.controls
        .filter((c) => assessments[c.id]?.status === statusFilter)
        .map((c) => ({ ...c, theme: t }))
    ).sort((a, b) => {
      const p = { critical: 0, high: 1, medium: 2, low: 3 };
      return (p[a.priority] || 3) - (p[b.priority] || 3);
    });
  };

  const getImplemented = () => {
    return ANNEX_A.flatMap((t) =>
      t.controls.filter(
        (c) => assessments[c.id]?.status === "implemented"
      )
    );
  };

  return {
    assessments,
    metrics,
    setControlStatus,
    getThemeMetrics,
    getGaps,
    getImplemented,
  };
}
