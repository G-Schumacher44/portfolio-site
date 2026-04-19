# GardenBook Showcase Plan

Date: 2026-04-18
Status: Brainstorming / positioning

## Objective

Present GardenBook on the GS Analytics site as a shipped product and a strong analytics engineering story.

This should not read like a private-repo dev preview.

This should also not duplicate the full marketing role of `gardenbook.app`.

## Core Positioning

GardenBook is a live consumer app, but the portfolio value is not only "I built an app."

The stronger story is:

- conceived, built, launched, and actively sell a consumer product
- designed the data and catalog system behind it
- built a governed ingest -> normalize -> validate -> promote -> generate pipeline
- made the app consume trusted, deterministic catalog artifacts instead of raw scrape data

Working framing line:

> GardenBook is a shipped consumer app, but one of the hardest parts of building it was designing the catalog pipeline behind it: a structured ingestion and validation system that turns messy source observations into trusted, app-ready plant data.

## Site Architecture Decision

Current preferred direction:

- keep GardenBook out of the comic-style Technical Showcase
- remove live Fridai Core entry points from the homepage and public funnel
- add a large GardenBook homepage CTA
- build one dedicated GS Analytics GardenBook showcase page
- let that page link outward to:
  - `gardenbook.app`
  - App Store
  - support/privacy

Rationale:

- GardenBook is a shipped product, not a repo-first engineering demo
- the comic technical showcase is better suited to internal systems and engineering artifacts
- a dedicated page gives more control over narrative, hierarchy, and credibility
- avoids maintaining two separate GardenBook stories on the same site

## Homepage CTA Plan

Homepage should feature a strong GardenBook block.

Desired CTA set:

- primary: view the GardenBook story / case study
- secondary: open on the App Store
- tertiary: visit `gardenbook.app` or support/privacy

Open question:

- whether `gardenbook.app` or the App Store should be the stronger external CTA

## GardenBook Showcase Page

The page should feel like a product case study, not a readme.

High-level section order:

1. Hero
- product name
- one-line value proposition
- shipped / live signal
- screenshot or product visual
- CTA to App Store and/or `gardenbook.app`

2. Why I Built It
- user problem
- why existing tools were not good enough
- why a focused, local-first product made sense

3. What I Shipped
- 3-5 actual product capabilities
- iPhone / iPad support
- privacy-first behavior
- lightweight workflow for home gardeners

4. Hidden Engine: Catalog Pipeline
- this is where the analytics engineering story becomes central
- explain that GardenBook required a curated data product behind the UX

5. Engineering Decisions
- local-first architecture
- reviewed catalog artifacts only
- no raw scrape data directly in the app
- deterministic generated outputs
- scale without screen-level code rewrites

6. Final CTA
- App Store
- `gardenbook.app`
- support/privacy

## What To Show

- the product outcome
- that it shipped and is live
- solo-builder ownership across product/design/build/launch
- privacy-first / local-first design choices
- screenshots and polished product surfaces
- the catalog pipeline and why it exists
- the data engineering decisions that make the product trustworthy

## What To Hide Or De-Emphasize

- private repo internals
- "dev preview" style language
- unfinished roadmap clutter
- repo docs, CLI docs, or architecture dumps unless they directly serve the story
- dense implementation detail that weakens the product narrative

## Data Engineer / Analytics Engineer Story

This is the most important angle to preserve.

GardenBook should not be framed as just a CRUD-style mobile app.

Key points:

- the app depends on curated catalog data, not hand-entered scattered content
- raw evidence is collected as observations
- evidence is normalized into canonical JSON
- validation checks both the curated catalog and raw observation batches
- reporting identifies gaps, coverage, and promotion candidates
- reviewed data is compiled into stable app-facing TypeScript artifacts
- the app reads only trusted generated outputs

Short explanation:

> To make the product viable, I built a catalog pipeline that separates raw source observations from reviewed app data. Scraped plant facts, price observations, and relationship evidence are normalized, validated, reported on, and only then promoted into generated catalog artifacts consumed by the app.

## Catalog Pipeline Summary

Based on `gardenfy/docs/catalog-pipeline-architecture.md` and the current pipeline code:

- raw evidence lands in:
  - `packages/catalog-pipeline/data/raw/plant-facts`
  - `packages/catalog-pipeline/data/raw/price-observations`
  - `packages/catalog-pipeline/data/raw/relationship-observations`
- reviewed source-of-truth lives in:
  - `packages/catalog-pipeline/data/normalized/plant-profiles.json`
  - `packages/catalog-pipeline/data/normalized/plant-relationships.json`
- pipeline commands:
  - `npm run catalog:validate`
  - `npm run catalog:generate`
  - `npm run catalog:report`
  - `npm run catalog:scrape-price`
- generated app-facing outputs land in:
  - `packages/catalog/src/generated/plants.ts`
  - `packages/catalog/src/generated/relationships.ts`

Pipeline mechanics:

1. capture raw observations
2. validate raw and curated layers
3. aggregate evidence and compute report artifacts
4. surface promotion candidates for reviewed adoption
5. generate deterministic app-facing catalog exports

## Messaging Direction

Tone should be:

- product-led
- grounded
- confident
- technical when useful, but not showy

Avoid:

- "look at my private repo"
- "flagship dev preview"
- "experimental"
- "repo showcase"

Prefer:

- shipped
- launched
- actively sold
- privacy-first
- built on a curated catalog engine

## Visual Direction

The GardenBook page should feel like a continuation of the product world, not a generic portfolio case study.

Working visual thesis:

> Make it feel like a beautiful garden field journal that gradually reveals a serious data system underneath.

Core visual requirements:

- use the same palette family as the app and `gardenbook.app`
- make the green book the dominant visual anchor
- keep the book motif present across the entire page
- preserve a polished, product-first tone
- avoid switching into a disconnected "tech dashboard" aesthetic halfway through

Design language:

- green cloth / hardcover / field-journal feel
- layered paper and page-edge motifs
- bookmark tabs / chapter markers
- botanical linework or subtle garden drafting details
- margin annotations for technical callouts
- warm, tactile surfaces rather than cold enterprise UI chrome

What to avoid:

- comic-strip styling
- neon / cyber / hacker visual language
- generic SaaS card grids
- abrupt transitions into unrelated technical aesthetics
- overly dark or purple-biased visuals that fight the app identity

## Launch Video Direction

The launch video should remain a marketing artifact, not a technical explainer.

Its role:

- establish product identity
- create launch energy
- show GardenBook as a real, polished shipped product
- set the visual tone for the page

The page itself should carry the deeper interactive narrative.

Video requirements:

- same palette family as the app and site
- green book highly visible throughout
- product-first framing
- no dense technical explanation
- no generic ad-style montage disconnected from the page below it

Suggested video content:

- GardenBook branding
- app screens and product moments
- tactile book / garden / planning motifs
- launch-level polish and confidence
- final frame built intentionally to transition into the page hero

## Video -> Page Transition

The page should feel like it opens out of the final frame of the launch video.

Desired experience:

1. video plays at the top of the page
2. final frame settles on a strong GardenBook composition
3. the website hero visually matches that ending frame
4. scroll reveals the page like opening a book

This should feel like one continuous experience, not:

- video ends
- page abruptly starts

Transition concept:

- final frame ends on the green book / cover / GardenBook hero composition
- hero section below inherits the exact same color environment
- first interactive movement acts like opening the cover or turning the first page
- the user is "inside" the GardenBook world immediately after the video ends

Motion concepts:

- book-cover lift
- page-turn reveal
- layered paper pull-away
- chapter-tab activation on scroll
- spread-style horizontal or staggered reveals for product sections

## Interactive Page Structure

The page should not be a long static essay.

It should read like an interactive product case study.

### 1. Video Hero

Purpose:

- hook attention
- establish product tone
- introduce GardenBook as a real shipped product

Contents:

- full-bleed or dominant launch video
- minimal headline and subhead
- shipped/live signal
- CTA cluster

Possible CTAs:

- View the build story
- Open on the App Store
- Visit `gardenbook.app`

### 2. Open The Book

Purpose:

- transition from marketing energy into the case-study experience

Interaction:

- the page begins to open like a book or journal
- this section should feel like the first spread

Contents:

- concise statement of what GardenBook is
- who it is for
- what makes it different

### 3. Inside GardenBook

Purpose:

- show the user-facing product clearly

Contents:

- screenshots framed like pages or spreads
- 3-5 concrete product capabilities
- privacy-first / local-first trust signals
- iPhone / iPad support

Important:

- this should stay product-led, not technical-first

### 4. Why I Built It

Purpose:

- provide founder / builder motivation

Contents:

- why existing tools were not good enough
- what problem GardenBook solves
- why focused simplicity mattered

### 5. The Hidden Engine

Purpose:

- pivot into the analytics engineering story

This is where the page reveals that GardenBook is not just a polished interface.

Contents:

- explain that a curated plant catalog and recommendation layer had to be built behind the app
- frame the product as a data product as much as an app

### 6. Catalog Pipeline Story

Purpose:

- show the data engineer / analytics engineer depth

Interaction ideas:

- chapter-step sequence
- expandable spreads
- annotated pipeline flow
- reveal raw -> normalized -> validated -> generated progression

Core pipeline steps to show:

1. source observations collected
2. raw evidence staged
3. normalized JSON source-of-truth
4. validation and reporting
5. promotion candidates
6. deterministic app-facing exports

### 7. Engineering Decisions

Purpose:

- explain the quality bar and why the system is trustworthy

Contents:

- app never consumes raw scrape data directly
- curated reviewed layer before promotion
- generated artifacts as app boundary
- catalog growth without screen rewrites
- provenance / quality / repeatability as first-class concerns

### 8. Local-First AI Roadmap

Purpose:

- show that v1.0.0 foundations intentionally support a privacy-preserving v2.0.0 direction

This should be a focus section on the site.

Core framing:

- v1.0.0 is already a real, useful shipped product
- the same local-first foundations in v1.0.0 are what make GardenBook 2.0 possible
- the roadmap should feel like a natural extension of the current architecture, not a pivot into AI hype

Key story points:

- the internal SQLite database creates a durable local knowledge layer
- the curated catalog pipeline creates structured, reviewable plant data
- local-first architecture makes private on-device assistance feasible
- future assistance should use local models and avoid outside API dependency
- the product philosophy is user-controlled, privacy-preserving, democratic, and practical

Product philosophy:

- not "AI because AI"
- not AI solving a fake problem invented to justify AI
- no token-metered user experience
- no subscription-shaped dependency for core usefulness
- AI should act as a practical garden tool inside daily life

Working framing line:

> GardenBook 1.0.0 lays the local-first foundations for a private garden assistant in 2.0.0. The internal database, structured catalog, and review pipeline are what make useful on-device help possible without sending garden data to outside APIs.

Important nuance:

- do not position current AI capabilities as already shipped if they are not
- do position the architecture as intentionally preparing for that roadmap
- do position privacy and user control as the reason this roadmap matters

### 9. Final Spread

Purpose:

- close the story cleanly and convert

Contents:

- App Store CTA
- `gardenbook.app`
- support/privacy

## Interaction Thesis

The page should use motion to reinforce the book metaphor and the feeling of discovery.

Primary interaction ideas:

- hero-to-page transition built around a book-opening motion
- chapter or tab activation as the user scrolls
- spread-style screenshot reveals
- gradual reveal of the hidden data system under the product
- a distinct roadmap chapter that feels like turning to the next volume rather than entering a separate AI microsite

Motion should feel:

- tactile
- intentional
- premium
- soft but confident

It should not feel:

- flashy for its own sake
- ad-tech
- generic parallax filler

## Build Notes

When implementation starts:

- keep the top of the page visually simple and cinematic
- reserve denser explanation for lower sections
- maintain one visual system across the whole page
- do not treat technical sections as a separate microsite
- use the launch video ending frame as the design anchor for the hero state

## Open Inputs Needed

- App Store URL
- preferred GardenBook headline / one-line promise
- preferred external CTA priority:
  - App Store first
  - `gardenbook.app` first
- available screenshots or product visuals to use on the page
- whether support/privacy should live as tertiary CTAs only

## Implementation Plan

1. Remove Fridai Core from public homepage/showcase entry points without deleting repo content.
2. Add a dedicated GardenBook page route on GS Analytics.
3. Add a homepage GardenBook CTA block pointing to that page.
4. Add outbound links to App Store and `gardenbook.app`.
5. Build the page around product story first, catalog/data story second.
6. Use the catalog pipeline as the proof of analytics engineering depth.
