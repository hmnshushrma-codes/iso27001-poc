# 🔐 ISO/IEC 27001:2022 — AI-Powered Certification Assistant

Interactive ISMS implementation tool with **all 93 Annex A controls**, real AI guidance (Claude / Gemini), gap analysis, and Statement of Applicability generation.

Built with **React 18 + Vite** — deploys to **Vercel** in one click.

---

## ✨ Features

- **Dashboard** — Real-time compliance scoring across 4 Annex A themes
- **Control Assessment** — Assess all 93 controls (Implemented / Partial / Not Implemented / N/A)
- **AI Consultant** — Real AI chat powered by **Claude** or **Gemini** (with offline fallback)
- **Statement of Applicability** — Auto-generated SoA table per Clause 6.1.3d
- **Gap Analysis** — Prioritized remediation view sorted by risk level
- **2022 Edition** — Highlights all 11 new controls

---

## 📂 Project Structure

```
src/
├── components/           # UI components
│   ├── Landing.jsx       # Welcome screen + org setup
│   ├── Header.jsx        # Top bar with compliance score
│   ├── Navigation.jsx    # Tab navigation + AI provider badge
│   ├── Dashboard.jsx     # Stats, theme cards, mandatory clauses
│   ├── AssessControls.jsx # Control assessment interface
│   ├── AIChat.jsx        # AI consultant chat (real API or mock)
│   ├── StatementOfApplicability.jsx
│   ├── GapAnalysis.jsx
│   └── index.js          # Barrel export
├── constants/            # Static data
│   ├── annexA.js         # All 93 Annex A controls
│   ├── clauses.js        # Mandatory clauses 4-10
│   ├── ui.js             # Nav tabs, colors, suggested questions
│   └── index.js
├── services/             # AI service layer
│   ├── aiConfig.js       # Provider selection from env vars
│   ├── aiService.js      # Unified interface (routes to provider)
│   ├── claudeAI.js       # Anthropic Claude API
│   ├── geminiAI.js       # Google Gemini API
│   ├── mockAI.js         # Offline fallback responses
│   └── index.js
├── hooks/                # Custom React hooks
│   ├── useAssessment.js  # Assessment state + computed metrics
│   └── index.js
├── styles/
│   └── global.css
├── App.jsx               # Root orchestrator
└── main.jsx              # Entry point
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/iso27001-poc.git
cd iso27001-poc
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🤖 AI Configuration

The app supports three AI modes, controlled by environment variables:

| Mode | Provider | API Key Required |
|------|----------|-----------------|
| `mock` (default) | Offline built-in responses | No |
| `claude` | Anthropic Claude Sonnet | Yes |
| `gemini` | Google Gemini Flash | Yes |

### Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_AI_PROVIDER=claude
VITE_CLAUDE_API_KEY=sk-ant-...
```

Or for Gemini:
```env
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=AIza...
```

> ⚠️ **PoC Note**: API keys are exposed client-side via `VITE_` prefix. For production, proxy through a backend (Vercel Serverless Functions, etc.)

### For Vercel Deployment with AI

Add environment variables in **Vercel Dashboard → Settings → Environment Variables**:
- `VITE_AI_PROVIDER` = `claude` or `gemini`
- `VITE_CLAUDE_API_KEY` or `VITE_GEMINI_API_KEY`

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo — Vercel auto-detects Vite
4. (Optional) Add AI env vars
5. Click **Deploy** — get your shareable link!

Every push to `main` auto-redeploys.

---

## 📜 License

MIT
