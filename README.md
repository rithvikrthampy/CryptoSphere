# CryptoWatch — Crypto Prices SPA

A responsive single-page app that displays cryptocurrency prices using CoinGecko. Features a featured VANRY coin, searchable/filterable top 100 list, detailed coin page with chart ranges (24h, 7d, 30d, 90d) and a resolution toggle (Auto/Daily), minimal sleek UI with Tailwind and tasteful animations, plus dark/light mode.

## Stack
- React + Vite + TypeScript
- Tailwind CSS + Framer Motion
- React Router, TanStack Query
- Chart.js via react-chartjs-2
- Vercel Serverless API proxy for CoinGecko

## Local Development
1. Requirements: Node 18+.
2. Create `.env` in project root:
   - `COINGECKO_API_KEY=your_key_here`
   - Optional: `COINGECKO_USE_PRO=true` (only if you have a Pro plan key). Leave unset/false for Demo/Free keys.
3. Install dependencies:
   - `npm install`
4. Start dev server:
   - `npm run dev` (Vite will proxy `/api/coingecko/*` to the correct CoinGecko base and attach your key from `.env`)
   - Test:
     - `http://localhost:5173/api/coingecko/ping` — should return `gecko_says` JSON.
     - If you see error_code 10011, set `COINGECKO_USE_PRO=false` or remove it.
   - Alternatively, you can use Vercel CLI: `vercel dev --port 5173` (also works with the serverless proxy).

## Deployment (Vercel)
- Push to a repo and import in Vercel.
- Set Project Environment Variable:
  - `COINGECKO_API_KEY` = your key (kept server-side only)
- Build command: `npm run build`
- Output directory: `dist`
- The included `vercel.json` rewrites `/api/*` to serverless functions and routes all other paths to `index.html`.

## Notes
- VANRY is featured first (via symbol/name match) and the homepage shows top 100 by market cap.
- Resolution toggle: for 24h, Daily is disabled (falls back to Auto) since CoinGecko daily interval is too coarse for 24h.
- API rate limits are handled with React Query caching and gentle refetch intervals.

## Scripts
- `npm run dev` — Vite dev server (if not using Vercel CLI, API routes won’t run)
- `npm run build` — build for production
- `npm run preview` — local static preview

## Folder Structure
- `src/` — app source
  - `routes/` — pages (`Home`, `CoinDetail`)
  - `components/` — UI components
  - `lib/` — API client, types, formatters
- `api/` — Vercel serverless functions (CoinGecko proxy)

## Accessibility & Responsiveness
- Dark/light mode with persistence and system preference support
- Keyboard focus styles and ARIA labels for inputs
- Responsive layouts for mobile through desktop
