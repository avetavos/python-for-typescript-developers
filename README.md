# Python for TypeScript Developers

A bilingual, interactive course that teaches Python to TypeScript developers using a comparison-first approach. Every concept is introduced from the TypeScript perspective first, then mapped to the Python equivalent. All runnable examples execute entirely in the browser — no backend or local Python installation required for reading the course.

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Site framework | [Astro 6](https://astro.build) + [Starlight 0.40](https://starlight.astro.build) |
| UI islands | [Preact](https://preactjs.com) (via `@astrojs/preact`) |
| In-browser Python runner | [Pyodide](https://pyodide.org) (CPython compiled to WebAssembly), loaded from the jsDelivr CDN |
| Unit tests | [Vitest](https://vitest.dev) + `@testing-library/preact` |
| Styling | Starlight default + custom CSS (`src/styles/custom.css`) |
| i18n | Starlight built-in, `defaultLocale: 'en'`, locales: `en` + `th` |

## Commands

Run all commands from the project root.

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Build production site to ./dist/
npm run preview    # Preview the production build locally
npm test           # Run Vitest unit tests
```

> There is **no build step for the runtime** — Python runs via Pyodide loaded from
> the CDN at runtime, so there is nothing to compile or commit (unlike a self-hosted
> WASM toolchain).

## Content Structure

Lessons live at:

```
src/content/docs/
  en/              # English content — served at /en/...
    intro/
    python-101/
    py-only/
    concurrency/
    api-fastapi/
    advanced/
    tooling/
    index.mdx      # EN landing page (splash template)
  th/              # Thai content — served at /th/...
    (same module directories)
    index.mdx      # TH landing page (splash template)
```

### The 7 Modules

| Directory | Module | Topics |
| --------- | ------ | ------ |
| `intro` | Introduction & Setup | Why Python for TS devs, mental-model shifts, toolchain setup |
| `python-101` | Python 101 — Fundamentals | Variables, functions, control flow, collections, classes, errors |
| `py-only` | Python You Won't Find in TypeScript | Decorators, comprehensions, generators, dunder methods, context managers |
| `concurrency` | Async & Concurrency | asyncio, tasks & gather, threading, the GIL, multiprocessing |
| `api-fastapi` | Building an API with FastAPI | Routing, Pydantic models, validation, DI, middleware, testing (Express/Nest ↔ FastAPI) |
| `advanced` | Advanced Python | Protocols vs structural typing, dataclasses, pattern matching, pytest, profiling |
| `tooling` | Tooling, Testing & Deployment | ruff/black, mypy, pytest, venv/uv/poetry, Docker, CI |

### Lesson File IDs

Content IDs follow the `<module>/<slug>` convention, e.g. `python-101/variables`. The Starlight sidebar uses `autogenerate: { directory }` per locale root, so new `.mdx` files are picked up automatically.

### 7-Section Lesson Template

Each lesson MDX file follows this structure:

1. **Intro** — one-paragraph framing of the concept, anchored in TypeScript
2. **Concept** — prose explanation
3. **TsGo** — `<TsGo ts={...} go={...} />` side-by-side comparison (left = TypeScript, right = Python; the `go` prop carries the Python code)
4. **Playground** — `<Playground code={...} />` runnable Python snippet (omitted where it can't run in-browser, with a note)
5. **PyOnly** — `<PyOnly>` callout for Python-only concepts with no TS equivalent
6. **Quiz** — `<Quiz questions={...} />` comprehension check
7. **ProgressTracker** — `<ProgressTracker id="module/slug" />` (always last)

Code snippets are hoisted into `export const` template literals and passed to the
components by reference (e.g. `export const fooCode = \`...\`` then `<Playground code={fooCode} />`).

> **⚠️ Authoring gotchas inside backtick template literals:**
> - **Escape sequences must be double-backslashed** — write `\\n`, `\\t`. A single
>   `\n` is consumed by JS template-literal parsing and becomes a real newline before
>   the code reaches the renderer, breaking Python string literals.
> - **Python f-strings use `{x}`, not `${x}`.** Do not write JS-style `${...}`
>   interpolation in Python code — it renders a literal `$`. (TypeScript code in the
>   `ts` prop legitimately uses `\${...}` inside its template literals.)

## How Runnable Code Works

The Python runner is [Pyodide](https://pyodide.org) — CPython compiled to WebAssembly. When a reader first clicks "Run" in a `<Playground>`:

1. The browser lazy-loads Pyodide from the jsDelivr CDN (a pinned version; ~10 MB, cached after first load).
2. The snippet is executed with `runPythonAsync` (so top-level `await` and `asyncio` work); `stdout`/`stderr` are captured and shown inline, including Python tracebacks.

**Coverage:** the full Python standard library, basic generics, `asyncio` with top-level `await`. Code needing OS threads/processes (`threading`, `multiprocessing`, `concurrent.futures`), a running server (FastAPI), or third-party packages (Pydantic, SQLAlchemy) does **not** run in the browser — those lessons use code blocks with a "run locally" note and an "Open in an online REPL" fallback link.

The pinned Pyodide version lives in `src/components/py-runner.ts` (`PYODIDE_VERSION`).

## Deployment

The site is fully static (`output: 'static'` in `astro.config.mjs`). Build output lands in `dist/`. Because Pyodide is loaded from a CDN, there is **no large committed asset** — deploy to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages all work).

### GitHub Pages (configured)

This repo deploys to GitHub Pages via `.github/workflows/deploy.yml` (build with
`withastro/action` on Node 22, publish with `actions/deploy-pages`).

One-time setup:

1. Create a GitHub repo and push (`main` branch).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Confirm the base path in `astro.config.mjs` matches your setup:
   - **Project site** (`https://USER.github.io/REPO/`): `site: 'https://USER.github.io'`, `base: '/REPO'` (currently `avetavos` / `python-for-typescript-developers`).
   - **User/org site** (`USER.github.io` repo) or **custom domain**: set `site` and **remove `base`** (served at root).

If you change `base`, update the base-prefixed links in
`src/content/docs/{en,th}/index.mdx` (hero actions + cards) to match.

### Other static hosts (served at root — no `base` needed)

If deploying to Netlify, Vercel static, Cloudflare Pages, or a custom domain,
**remove the `base` option** from `astro.config.mjs` (and revert the landing-page
links to `/en/...`):

- **Netlify** — build command `npm run build`, publish dir `dist`
- **Vercel** — static preset, no serverless functions needed
- **Cloudflare Pages** — build command `npm run build`, output `dist` (works here because there is no large WASM file to upload)
