# TeamForge AI 🚀
> **Turn Ideas Into Team-Ready Projects.**

TeamForge AI is a developer SaaS product that converts a software problem statement or product idea into a complete architectural blueprint, screen hierarchy, and balanced team workload plan powered by the **Google Gemini API**.

---

## ⚡ What TeamForge AI Does

1. **Problem Statement Analysis:** Analyzes your software requirements, identifies domain scope, target user personas, and core functional features.
2. **Intelligent Screen Architecture:**
   - **User Planned Screens:** If you provide planned screens, Gemini strictly uses them as the primary source, assigns each to one developer with zero duplicate ownership, and places missing essential screens into a designated **"AI Suggested Screens"** section.
   - **AI Screen Generation:** If you don't provide screens, Gemini deduces the required screen architecture from scratch.
3. **Equitable Workload Balancer:** Divides screen responsibilities equitably across developers according to their roles (Frontend, Backend, UI/UX, Full Stack).
4. **End-to-End User Flow:** Generates a visual step-by-step user journey across screens.
5. **Shared Architectural Modules:** Maps out cross-cutting modules (Auth, API Client, UI Design System, State Store, Config, Types).
6. **Framework-Specific Project Skeletons:** Generates downloadable project blueprints (`.zip`) tailored to React, Next.js, React Native, Flutter, Vite, or Node.js with **empty screen placeholders only** containing metadata, responsibilities, and TODO checklists.
7. **GitHub Collaboration Plan:** Recommends branch naming conventions and a beginner-friendly 7-step Git workflow (Pull, Branch, Develop, Commit, Push, Pull Request, Merge) with 1-click command copying.
8. **Export & History:** Download blueprints as Markdown/JSON, copy team matrices, and manage past projects locally.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + Lucide React
- **AI Intelligence:** Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) with structured JSON schema enforcement
- **Fallback Engine:** Deterministic Senior Architect Engine for instant offline evaluation
- **Packaging:** JSZip for in-browser client-side zip generation

---

## 🚀 Getting Started

### 1. Installation
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local` and add your Google Gemini API key:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local`:
\`\`\`env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
\`\`\`
*(Note: You can also enter or test your Gemini API Key directly inside the app via the "Gemini Config" button in the navigation bar!)*

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if 3000 is occupied).

### 4. Build for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 🔒 Security Best Practices

- `GEMINI_API_KEY` is **never exposed** in client-side bundles.
- All Gemini API communications occur through the secure server-side route `/api/analyze`.
- Client custom API keys entered in settings are stored in local browser memory and transmitted strictly via headers to the proxy route.
- Real keys and `.env` files are ignored in `.gitignore`.
