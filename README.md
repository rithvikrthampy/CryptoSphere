# CryptoWatch — Crypto Prices SPA

A responsive, minimal, and sleek single‑page app for live cryptocurrency data powered by CoinGecko. It highlights a featured coin (defaults to VANRY/USDT), provides a rich markets table with sorting-friendly fields, search and filters, a detailed coin page with interactive charts, and dark/light mode with tasteful animations.

## Highlights
- Featured coin card (default VANRY/USDT) with mini chart and market stats
- Markets table with required columns: Price, 1h, 24h, 7d, 24h Volume, Market Cap, Last 7 Days (Graph)
- Fast search and quick filters (Top gainers/losers, 24h/7d window) with pagination
- Coin detail page with chart ranges: 24H, 7D, 1M (30D), 3M (90D), 1Y, Max
- Market overview sidebar: Global stats, Trending (3), Top Gainers (3), Top Losers (3)
- Dark/light theme with persistence and smooth animations (Framer Motion)

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS + custom utility classes + Framer Motion
- React Router (SPA routing)
- TanStack Query (fetching, caching, retries)
- Chart.js via react-chartjs-2 (charts)
- Vercel Serverless proxy for CoinGecko (keeps API key private)

## Live Data & Limits
- Data source: CoinGecko (free/demo or Pro key)
- Dev and prod proxies select the correct base automatically; Pro header only when `COINGECKO_USE_PRO=true`.
- Client caching + serverless Cache-Control reduce upstream calls.
- Markets fetch is capped to 1,000 coins (4 pages × 250) to balance breadth and rate limits.

## Local Development
1. Prerequisite: Node 18+
2. Create `.env` in the project root (no quotes, no spaces):
   - `COINGECKO_API_KEY=your_key_here`
   - Optional: `COINGECKO_USE_PRO=true` (only if you have a Pro plan)
3. Install dependencies:
   - `npm install`
4. Start the dev server:
   - `npm run dev`
   - Verify proxy:
     - `http://localhost:5173/api/coingecko/ping` should return `gecko_says`
     - If you see error_code 10011, remove `COINGECKO_USE_PRO` or set it to `false`
   - Alternative: `vercel dev --port 5173` to run serverless functions locally

## Deployment (Vercel)
- Push to a repository and import in Vercel.
- Project Environment Variables:
  - `COINGECKO_API_KEY`
  - (Optional) `COINGECKO_USE_PRO=true` if you have Pro
- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` routes `/api/*` to serverless functions and all other paths to `index.html`.

## Features In Depth
- Featured Coin (VANRY/USDT)
  - Attempts USDT quote first; falls back to USD when necessary.
  - Selector allows changing the featured coin; choice persists locally.
- Markets Table
  - Columns: Price, 1h, 24h, 7d, 24h Volume, Market Cap, Last 7 Days (sparkline)
  - Client-side search (name/symbol), quick filters (gainers/losers, 24h/7d), pagination and per-page controls
- Coin Detail
  - Interactive chart ranges: 24H, 7D, 1M, 3M, 1Y, Max
  - Market stats (price, market cap, volume, supply where available)
- Market Overview
  - Global market snapshot, trending coins, top gainers/losers (3 items each)
- UX & Theming
  - Dark/light toggle saved to localStorage; respects system preference
  - Smooth page transitions and micro-interactions; skeleton loaders for perceived performance

## Scripts
- `npm run dev` — Vite dev server (API proxy included)
- `npm run build` — production build
- `npm run preview` — local static preview of the built app

## Project Structure
- `src/` — application source
  - `routes/` — views (`Home`, `CoinDetail`)
  - `components/` — UI (featured card, tables, charts, filters, pagination)
  - `lib/` — API client, types, format helpers
- `api/` — serverless proxy (`/api/coingecko/*`)
- `vite.config.ts` — dev proxy and module alias

## Key Files
- `src/routes/Home.tsx:1` — homepage with featured card, filters, markets table, pagination
- `src/components/EnhancedFeaturedCoin.tsx:1` — featured card with mini chart and stats
- `src/components/CoinList.tsx:1` — markets table (required columns)
- `src/components/CoinRow.tsx:1` — row renderer + 7‑day sparkline
- `src/routes/CoinDetail.tsx:1` — detail page with chart ranges and stats
- `api/coingecko/[...path].ts:1` — Vercel serverless CoinGecko proxy with caching and Pro fallback
- `vite.config.ts:1` — Vite dev proxy; Pro header only when `COINGECKO_USE_PRO=true`

## Troubleshooting
- Too Many Requests (429):
  - Avoid frequent reloads; data refetches on intervals
  - Keep `COINGECKO_USE_PRO` unset for free/demo keys
  - Consider increasing intervals if you still see 429s
- Demo key on Pro base (error_code 10011):
  - Remove `COINGECKO_USE_PRO` or set it to `false` to use the free API base
- Env not applied:
  - Ensure `.env` uses `KEY=value` with no quotes or spaces
- Featured not showing VANRY/USDT:
  - USDT may be temporarily unavailable; falls back to USD. Use the selector to pick a different coin if desired.

## Notes
- `.gitignore` excludes `.env`, `node_modules`, `dist`, and Vercel metadata.
- Set `COINGECKO_API_KEY` in your Vercel project before production deploys.

