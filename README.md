# Docket

A small task tracker built with **plain HTML, CSS and TypeScript** — no frameworks, no bundlers.

- `model.ts` — typed model: `Task`, `TaskStatus`, `addTask`, `advanceTask`, `removeTask`, `filterByStatus`, `countByStatus`
- `app.ts` — connects the model to the page (typed DOM access, no `any`)
- `index.html` + `styles.css` — the interface
- `model.js` / `app.js` — compiled output, **committed on purpose** so a static host can serve them

## Run locally

```bash
npm install        # installs TypeScript
npx tsc            # compiles model.ts + app.ts -> model.js + app.js (zero errors)
npx serve .        # or: python3 -m http.server 8000
```

Module scripts don't load from `file://`, so use a local server rather than double-clicking `index.html`.

## Deploy (free static hosting)

**GitHub Pages:** repo Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
Live at `https://<username>.github.io/<repo>/`.

**Netlify:** Add new site → Import from GitHub → pick the repo. Leave build command empty, publish directory `.` → Deploy.

**Vercel:** Add New → Project → import the repo. Framework preset "Other", leave build/output settings empty → Deploy.

## Pull request checklist

- Branch: `part-2-ui-ship`, PR into `main`
- PR description includes the **Repo URL** and the **Live URL**
