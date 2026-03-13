/**
 * Mock AI Service
 *
 * Provides pre-built ISO 27001 guidance responses for offline/demo use.
 * Pattern-matches user queries and returns contextual answers.
 */

export function getMockResponse(query, context = {}) {
  const q = query.toLowerCase();
  const { orgName = "", orgScope = "", assessed = 0, score = 0 } = context;

  if (q.includes("scope") || q.includes("isms")) {
    return `**Defining your ISMS scope (Clause 4.3)** is the first critical step.

You need to determine:
• Internal and external issues relevant to your purpose (Clause 4.1)
• Requirements of interested parties — clients, regulators, partners (Clause 4.2)
• Boundaries and applicability of the ISMS

${orgName ? `For ${orgName}, the scope would likely cover: "Information security management for ${orgScope || "organizational operations"} including digital platforms, client data, and supporting IT infrastructure."` : "Define your organization name first to get a tailored scope recommendation."}

This scope determines which Annex A controls are applicable to you.`;
  }

  if (q.includes("risk") || q.includes("assessment")) {
    return `**Risk Assessment (Clause 6.1.2)** is the heart of ISO 27001.

The process:
1. **Identify risks** to confidentiality, integrity, and availability of information
2. **Analyse** the likelihood and impact of each risk
3. **Evaluate** risks against your acceptance criteria
4. **Treat** risks by selecting Annex A controls

For a maritime organization, key risks include:
🔴 Unauthorized access to vessel classification data
🔴 Loss of survey report integrity
🔴 Disruption of e-certificate systems
🔴 Third-party supplier data breaches
🔴 Cyber attacks on connected vessel systems

Each risk maps to specific Annex A controls in your Statement of Applicability.`;
  }

  if (q.includes("soa") || q.includes("statement of applicability")) {
    return `**Statement of Applicability (SoA)** is a mandatory document (Clause 6.1.3d).

It must list:
✅ All 93 Annex A controls
✅ Whether each control is applicable or not
✅ Justification for inclusion or exclusion
✅ Implementation status

You can generate your SoA from the Assessment tab — once you've assessed all controls, the SoA table auto-populates.

Current progress: **${assessed}/93 controls assessed**.`;
  }

  if (q.includes("audit") || q.includes("certif")) {
    return `**The certification journey has two stages:**

**Stage 1 Audit (Documentation Review):**
• Auditor reviews your ISMS documentation
• Checks: scope, risk assessment, SoA, policies
• Identifies any major gaps before Stage 2
• Typically 1-2 days

**Stage 2 Audit (Implementation Audit):**
• On-site assessment of control implementation
• Interviews with staff
• Evidence review — logs, records, processes
• Typically 3-5 days depending on scope

Your current readiness score is **${score}%**. ${score >= 70 ? "You're on track for certification!" : "I recommend addressing the gaps before scheduling an audit."}`;
  }

  if (q.includes("new") || q.includes("2022") || q.includes("change")) {
    return `**ISO 27001:2022 introduced 11 new controls:**

🆕 5.7 — Threat intelligence
🆕 5.23 — Cloud services security
🆕 5.30 — ICT readiness for business continuity
🆕 7.4 — Physical security monitoring
🆕 8.9 — Configuration management
🆕 8.10 — Information deletion
🆕 8.11 — Data masking
🆕 8.12 — Data leakage prevention
🆕 8.16 — Monitoring activities
🆕 8.23 — Web filtering
🆕 8.28 — Secure coding

The total went from 114 controls (14 categories) to **93 controls (4 themes)**. Many were merged, not removed.

Focus on the new controls — auditors will specifically look for these.`;
  }

  if (q.includes("policy") || q.includes("5.1")) {
    return `**A.5.1 — Policies for Information Security** is foundational.

You need:
📄 **Top-level Information Security Policy** — approved by management, sets direction
📄 **Topic-specific policies** — access control, cryptography, physical security, etc.

Each policy should include:
• Purpose and scope
• Roles and responsibilities
• Policy statements
• Compliance requirements
• Review frequency (at least annually)

Recommended separate policies for:
• Classification data handling
• Survey report integrity
• Client portal security
• Third-party/supplier security
• Remote working access`;
  }

  // Default fallback
  return `Based on your question, here's my guidance aligned with ISO 27001:2022:

The key principle is **risk-based thinking** — every control you implement should trace back to an identified risk. The standard doesn't mandate implementing all 93 controls; it mandates that you **assess** each one and justify your decisions in the Statement of Applicability.

Your current assessment progress: **${assessed}/93 controls** assessed, with a compliance score of **${score}%**.

I can help with specific controls, policy templates, risk assessment methodology, or audit preparation. What area would you like to focus on?`;
}
