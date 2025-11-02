# Scorekeep

Minimal, mobile‑first scorekeeper for in‑person games.

## Features
- Add, rename, delete players
- Increment/decrement and reset per player; reset all
- Hide totals mode with per‑player pending deltas and per‑player reveal
- Theme switcher
- State persisted in localStorage

## Run
```bash
npm i
npm run dev
# build & preview
npm run build && npm run preview
```

## Tech
- React 19 + Vite, TypeScript
- Tailwind CSS v4 with custom tokens
- Icons: lucide-react

## Adding a new theme

Themes are implemented with CSS design tokens (CSS variables) and a small runtime that applies a `data-theme` attribute on `<html>`. Components consume semantic utilities (e.g. `.card`, `.btn`, `.input`, `.text-app`) so new themes don’t require component edits.

1) Define tokens for your theme
- Edit `src/styles/themes.css` and add a new block:
```css
[data-theme="mytheme"] {
	--app-bg: ...;
	--app-surface: ...;
	--app-text: ...;
	--accent: ...;
	--muted: ...;
	--border-color: ...;
	--radius: ...;              /* corner radius */
	--shadow-card: ...;         /* card shadow */
	--font-ui: ...;             /* UI font */
}
```
- Optional: add theme‑specific flourishes (like retro scanlines) under the same selector.

2) Register the theme in TypeScript
- Update `src/theme.ts` to include it in the union type:
```ts
export type ThemeId = 'retro' | 'modern' | 'mytheme';
```
- Update the theme picker list in `src/components/ui/OptionsDialog.tsx`:
```ts
const THEMES: ThemeId[] = ['retro', 'modern', 'mytheme'];
```
- If you want it as the default when nothing is saved, change the default in `index.html` (early script) and `initTheme()` in `src/theme.ts`.

3) Use semantic utilities (for consistency)
- Global utilities live in `src/index.css`:
  - Layout/containers: `.bg-app`, `.bg-surface`, `.card`, `.border-app`, `.rounded-token`
  - Text: `.text-app`, `.text-muted`, `.text-accent`
  - Controls: `.btn`, `.input`, `.border-accent`
- When adding new UI, prefer these utilities over hardcoded Tailwind colors (e.g. avoid `bg-neutral-800`, `text-white`). This keeps all themes consistent and avoids per‑component edits.

4) Adding new semantics (advanced)
- If a new feature needs distinct states (success/danger/warn), introduce new tokens in all themes:
  - Example tokens: `--positive`, `--negative`, `--warning`
  - Add matching utilities (e.g. `.btn-positive`, `.text-negative`) in `src/index.css`
- Keep the token names consistent across themes; each theme defines their values.

5) Persist and preview
- Theme is saved under `localStorage['scorekeep:theme']`.
- To preview your new theme quickly, open Options (cog in header) and select it.

Gotchas and guidelines
- Ensure accessible contrast (aim for WCAG AA: 4.5:1 for body text).
- Check small controls on mobile: hit‑areas ≥ 40px tall are preferred.
- Keep spacing/radius coherent via tokens (`--radius` affects cards/buttons/inputs).
- Apply the theme early: the inline script in `index.html` sets `data-theme` before CSS loads to avoid flashes.
