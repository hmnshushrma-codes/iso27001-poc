import { ANNEX_A, STATUS_COLORS } from "../constants";

export default function StatementOfApplicability({ assessments, orgName, assessed }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Statement of Applicability</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#5a5f75" }}>
            ISO 27001:2022 Clause 6.1.3d — {orgName} — {assessed}/93 controls assessed
          </p>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#14141e" }}>
              {["Control", "Name", "Applicable", "Status", "Justification"].map((h) => (
                <th key={h} style={{
                  padding: "10px 12px", textAlign: "left", color: "#818cf8",
                  fontWeight: 700, borderBottom: "1px solid #1e1e30", fontSize: 11,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ANNEX_A.flatMap((theme) =>
              theme.controls.map((ctrl) => {
                const a = assessments[ctrl.id];
                const status = a?.status || "—";
                const statusColor = STATUS_COLORS[status] || STATUS_COLORS.default;

                const justification =
                  status === "not_applicable" ? "Not applicable to current scope"
                  : status === "implemented" ? "Control implemented and operational"
                  : status === "partial" ? "Partially implemented — remediation planned"
                  : status === "not_implemented" ? "Gap identified — action required"
                  : "Pending assessment";

                return (
                  <tr key={ctrl.id} style={{ borderBottom: "1px solid #1a1a2e" }}>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", color: theme.color, fontWeight: 700 }}>
                      A.{ctrl.id}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#c0c0d0" }}>
                      {ctrl.name}{" "}
                      {ctrl.isNew && (
                        <span style={{
                          fontSize: 9, color: "#a78bfa", background: "#7c3aed22",
                          padding: "1px 4px", borderRadius: 3, fontWeight: 700,
                        }}>
                          NEW
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "8px 12px", color: status === "not_applicable" ? "#5a5f75" : "#22c55e" }}>
                      {status === "not_applicable" ? "No" : a ? "Yes" : "—"}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{ color: statusColor, fontWeight: 600, textTransform: "capitalize" }}>
                        {status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "8px 12px", color: "#5a5f75", fontSize: 11 }}>
                      {justification}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
