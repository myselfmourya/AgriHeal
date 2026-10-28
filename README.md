# AgriHeal 🌾

AgriHeal is a 100% software platform merging AI crop diagnostics with proactive rural health management, built for farmers and their communities.

## Features
- **Crop Diagnostics** — AI-powered analysis for crop health, pests, and disease detection.
- **Vani Voice AI** — A global, voice-first assistant for hands-free navigation and support in local languages.
- **Farm & Health Records** — Centralized tracking for farm activity, crop care, and personal/community health.
- **Community & Experts** — Connect with local vendors, agricultural experts, and the farming community.
- **Market & Schemes** — Fertiliser/tools store, government schemes center, and news updates relevant to farmers.
- **Offline-first PWA** — Installable, works with local storage (Dexie/localForage) for low-connectivity rural areas.

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, React Router
- **AI:** Google Gemini (`@google/generative-ai`), LiveKit (real-time voice)
- **Backend/Data:** Supabase, Dexie, localForage
- **i18n:** i18next (multi-language support)

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/myselfmourya/AgriHeal.git
   cd AgriHeal
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Add your Gemini API Key or other secrets to .env
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Development Scripts
- `npm run dev`: Starts the local Vite development server.
- `npm run build`: Compiles the application and generates PWA assets for production.
- `npm run lint`: Runs oxlint to verify code hygiene.
- `npm run preview`: Previews the production build locally.
- `npm run test`: Runs the test suite with Vitest.

## Coding Standards
- **Routing:** Use centralized `react-router-dom` in `App.jsx` with `lazy` loading for all pages.
- **State Management:** Use React Context (`src/contexts/`) for global state (Auth, Farmer, Vani, Notifications). Do not rely solely on prop drilling for deep components.
- **Styling:** Tailwind CSS is the standard. Use exact utility classes.
- **Linting:** Keep warnings to a minimum. Do not leave unused imports in the codebase.
- **Vani AI:** Use the global `VaniWidget` context. Do not create standalone assistant pages.

## License
This project is licensed under [CC BY-NC-ND 4.0](LICENSE) — viewable and shareable with attribution, but not for commercial use, modification, or redistribution without permission.
