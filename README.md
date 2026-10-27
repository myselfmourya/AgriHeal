# AgriHeal 🌾
100% software platform merging crop diagnostics with proactive rural health management using Vani Voice AI.

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
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

## Coding Standards
- **Routing:** Use centralized `react-router-dom` in `App.jsx` with `lazy` loading for all pages.
- **State Management:** Use React Context (`src/contexts/`) for global state (Auth, Farmer, Vani, Notifications). Do not rely solely on prop drilling for deep components.
- **Styling:** Tailwind CSS is the standard. Use exact utility classes.
- **Linting:** Keep warnings to a minimum. Do not leave unused imports in the codebase.
- **Vani AI:** Use the global `VaniWidget` context. Do not create standalone assistant pages.
