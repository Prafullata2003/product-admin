# Product Admin Dashboard
Next.js (App Router) · React · Tailwind CSS · Axios · DummyJSON

## Setup
```bash
npm install
npm run dev     # http://localhost:3000
```
Login: `emilys` / `emilyspass`. Deploy: push to GitHub, import the repo in Vercel (no env vars needed).

## Done
Login/logout + route protection (middleware) · product list (table desktop / cards mobile) · server pagination
(limit/skip, page numbers, Prev/Next, 10/20/50, "Showing x–y of z") · debounced search · category filter · sort ·
details page + not-found · add/edit/delete with validation + confirm popup · loading/empty/error + Retry ·
state in URL · shared Axios file · no React Query / SWR / table libs.

## Decisions
- **Search + category:** the API can't do both. Search wins; picking a category clears the search and typing a search
  clears the category. Filtering search results on the client would make `total`, page count and "Showing x–y of z" wrong.
- **Add/edit/delete not saved by API:** we still call the API (to show real request flow and errors), then store the change
  in `localStorage` (`lib/localChanges.js`) and merge it into every list/detail result. Added products show on page 1 of the unfiltered list.
- **Race conditions:** `useProducts` aborts the previous request in the effect cleanup (AbortController). Test with `/products?q=phone&delay=2000`.
- **Bad URL values:** `parseParams` sanitises everything (`page=abc` → 1, bad limit/sort ignored). `page=999` is replaced with the last page.
- **Double clicks:** a `useRef` flag blocks a second submit immediately (state updates are async) and the button is disabled.
- **Token:** stored in a cookie so middleware can protect pages and Axios can attach it.

## Note to fill in (your own words)
- Choices: …
- A problem I faced and how I fixed it: e.g. stale search results overwriting new ones → AbortController.
- Where AI helped: …
