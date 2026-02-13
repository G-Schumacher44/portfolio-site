<p align="center">
  <img src="public/img/logos/dark_logo_banner.png" width="1000" alt="GS Analytics — Portfolio Banner" />
  <br>
  <em>Analytics & Engineering Portfolio</em>
</p>

<p align="center">
  <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" />
  <img alt="Status: Active" src="https://img.shields.io/badge/status-active-brightgreen" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61dafb?logo=react" />
  <img alt="Vite 6" src="https://img.shields.io/badge/Vite-6-646cff?logo=vite" />
</p>

# GS Analytics — Portfolio Site

**🔗 [garrettschumacher.com](https://garrettschumacher.com)**

Personal portfolio for Garrett Schumacher — data analyst and analytics engineer. Showcases end-to-end data work through case studies, interactive demos, and technical write-ups.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/postcss`) |
| Animation | Framer Motion |
| Routing | React Router v6 (BrowserRouter) |
| Deploy | GitHub Actions → `gh-pages` branch |

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Main portfolio — hero, services, SQL Stories, projects, contact |
| `/technical-showcase` | Comic-format technical project gallery |
| `/quick-view` | Fast-scan resume/portfolio summary |

---

## Project Structure

```
src/
  components/
    hero/                # Hero section, bio card, terminal animation
    layout/              # App shell, Navbar, Footer, MicroBanner, Section
    projects/            # Featured projects grid
    contact/             # Contact section
    sql-stories/         # SQL Stories modal system (CaseStudyModal, ArchitectureFlowChart, TerminalStage)
    technical-showcase/  # TechnicalShowcasePage, TechnicalProjectModal, TechnicalShowcaseCTA
    shared/              # GlassPanel, GradientBorder, Button, DocumentViewer, Modal
  data/                  # Content data files (projects, services, navigation, etc.)
  pages/                 # Route-level page components (lazy-loaded)
  hooks/                 # useScrollDirection, useScrollSpy
public/
  files/                 # Static HTML modals, reports, demos (served at /files/...)
  img/                   # Logos, backgrounds, comic strips, project screenshots
  robots.txt
  sitemap.xml
```

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Live site (vanilla HTML — legacy) |
| `freelance-preview` | Vanilla HTML redesign (completed) |
| `react-rebuild` | React migration — **active development** |

---

## Local Dev

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

> First `npm run dev` load is slow (~30–60s) while Framer Motion transforms. Subsequent loads are fast.

---

## Design Tokens

```
--color-bg:      #0c0d10
--color-card:    #14161a
--color-surface: #161a20
--color-text:    #e9edf1
--color-muted:   #a7b0bb
--color-brand:   #6699cc   ← blue, not green
--color-line:    #22262c
```

---

## Key Notes

- **Tailwind scanning**: Uses `source(none)` + explicit `@source` in `globals.css` to avoid scanning `public/` (causes hang)
- **Modal HTML files**: Live in `public/files/modals/` and `public/files/` — served via iframe in `DocumentViewer`
- **Comic page palette**: `#f3e6cf` bg / `#2b2a27` ink / `#fff7e6` paper — uses inline `style` props to avoid Tailwind variable bleed
- **Favicon**: `public/img/logos/gs_analytics_thumb_2.png`
- **OG image**: `public/img/logos/gs_analytics_thumb_2.png`
