# GardenBook Showcase Execution Spec

Date: 2026-04-18
Status: Build spec
Depends on: `docs/planning/GARDENBOOK_SHOWCASE_PLAN.md`

## Goal

Translate the GardenBook strategy into a concrete implementation plan for this React portfolio site.

This document is build-facing.

## Scope

In scope:

- dedicated GardenBook route/page in this site
- homepage GardenBook CTA block
- removal of live Fridai public entry points
- video-led interactive case-study page
- product story + analytics engineering story

Out of scope for first pass:

- editing or producing the actual launch video
- adding a CMS
- adding a new analytics stack
- replacing `gardenbook.app`
- rebuilding support/privacy pages

## Route Plan

Primary route:

- `/gardenbook`

Existing related routes remain:

- `/apps/gardenbook-support`
- `/apps/privacy-policy`

## Public Funnel Changes

### Remove / Deactivate

- remove `FridaiSpotlightCTA` from homepage
- remove `Fridai Core` from any service CTA proof links
- remove `Fridai Core` as a live technical showcase entry

Important:

- do not delete Fridai code or content
- only remove public linkage and live presentation

### Add

- new homepage GardenBook CTA section
- navigation path to `/gardenbook` if useful after implementation review

## Component Plan

### New page

- `src/pages/GardenBookPage.tsx`

### New components

- `src/components/gardenbook/GardenBookHero.tsx`
- `src/components/gardenbook/GardenBookIntroSpread.tsx`
- `src/components/gardenbook/GardenBookProductSpreads.tsx`
- `src/components/gardenbook/GardenBookBuilderStory.tsx`
- `src/components/gardenbook/GardenBookPipelineStory.tsx`
- `src/components/gardenbook/GardenBookLaunchStrategy.tsx`
- `src/components/gardenbook/GardenBookRoadmap.tsx`
- `src/components/gardenbook/GardenBookFinalCTA.tsx`
- `src/components/gardenbook/GardenBookHomepageCTA.tsx`

Optional utility components if needed:

- `src/components/gardenbook/BookSection.tsx`
- `src/components/gardenbook/ChapterTabs.tsx`
- `src/components/gardenbook/PageSpread.tsx`

## Page UX Sequence

### 1. Hero

Component:

- `GardenBookHero`

Purpose:

- create a high-confidence opening
- establish the visual world
- introduce GardenBook quickly

Contents:

- launch video
- product name
- one-line value proposition
- shipped/live signal
- CTA cluster

Planned CTAs:

- `Read the build story`
- `Open on the App Store`
- `Visit gardenbook.app`

Possible supporting link:

- `Support & privacy`

Interaction:

- video is dominant
- text column stays concise
- final video frame should align visually with the hero poster/fallback state

### 2. Open The Book

Component:

- `GardenBookIntroSpread`

Purpose:

- transition from launch-video energy into the interactive case-study flow

UX behavior:

- hero visually gives way to a first spread / first page
- motion suggests opening a cover or turning a page

Contents:

- concise explanation of what GardenBook is
- who it is for
- why it exists

### 3. Product Spreads

Component:

- `GardenBookProductSpreads`

Purpose:

- show the actual product before the technical reveal

Contents:

- 3-5 product moments
- screenshots or stills from the app
- short captions only

Candidate themes:

- planning your garden
- organizing plants and spaces
- privacy/local-first trust
- simple workflow on iPhone/iPad

Interaction:

- spread-by-spread reveal on scroll
- keep each spread focused on one takeaway

### 4. Builder Story

Component:

- `GardenBookBuilderStory`

Purpose:

- explain why you built it

Contents:

- product gap
- why simpler/local-first mattered
- why a focused tool was better than a bloated alternative

Tone:

- personal but concise
- no diary-style over-explaining

### 5. Hidden Engine

Component:

- first half of `GardenBookPipelineStory`

Purpose:

- reveal that GardenBook is supported by a deeper data system

Contents:

- explain the catalog problem
- explain why app content could not be ad hoc
- frame GardenBook as partly a data product

### 6. Catalog Pipeline Story

Component:

- second half of `GardenBookPipelineStory`

Purpose:

- present the analytics engineering story clearly

Core flow to visualize:

1. raw source observations
2. raw staging layer
3. normalized JSON source-of-truth
4. validation + reporting
5. promotion candidates / reviewed curation
6. generated app-facing exports

Interaction options:

- vertical chapter steps
- sticky explainer with active step state
- tabbed “chapters”

Recommendation:

- use a sticky chapter rail on desktop
- use stacked collapsible sections on mobile

Supporting proof points:

- app never consumes raw scrape data directly
- validation runs before generation
- reports expose gaps and price coverage
- generated artifacts define the app boundary

### 7. Launch Strategy

Component:

- `GardenBookLaunchStrategy`

Purpose:

- show product ownership beyond engineering

Contents:

- creator targeting by brand/audience fit
- focus on 10k-100k follower creators
- audience fit over vanity reach
- charity/event promo-code outreach
- simple spreadsheet-based operational tracking

Tone:

- realistic
- disciplined
- no fake “growth machine” language

### 8. Local-First AI Roadmap

Component:

- `GardenBookRoadmap`

Purpose:

- make the v1.0.0 -> v2.0.0 path explicit
- show that the current product architecture intentionally enables a private on-device assistant roadmap
- position this as a focus section, not a throwaway future-note

Core framing:

- v1.0.0 is already useful and complete on its own
- the internal SQLite layer, structured catalog, and local-first architecture are what make future on-device assistance possible
- the roadmap is about practical tools, not AI hype

Contents:

- internal SQLite database as a durable local knowledge layer
- expansion path toward a richer local knowledgebase
- local model direction with no outside API dependency
- user-controlled and privacy-preserving assistant model
- practical AI philosophy:
  - not “AI because AI”
  - not token-metered utility
  - not subscription-gated intelligence
  - AI as a practical everyday gardening tool

Tone:

- clear
- principled
- grounded
- future-looking without sounding vaporous

Interaction:

- this should feel like opening the next chapter, not switching into a separate AI product pitch
- consider a “Volume II” or “Next Chapter” treatment in the book metaphor

### 9. Final CTA

Component:

- `GardenBookFinalCTA`

Purpose:

- close cleanly and drive action

Contents:

- App Store CTA
- `gardenbook.app`
- support/privacy

## Homepage CTA Spec

Component:

- `GardenBookHomepageCTA`

Placement:

- on homepage in place of the Fridai CTA block

Purpose:

- pull visitors into the GardenBook story from the main site

Suggested CTA set:

- primary: `See the GardenBook story`
- secondary: `Open on the App Store`
- tertiary: `Visit gardenbook.app`

Tone:

- shipped product
- premium
- confident
- no dev-preview language

## Technical Showcase Handling

Decision for first pass:

- remove Fridai from the live technical showcase list
- do not add GardenBook into the comic-strip technical showcase

Reason:

- GardenBook should live in a product-case-study format, not a repo-showcase format

## Motion Spec

Use:

- Framer Motion

Primary motion patterns:

- hero fade / poster settle
- book-opening transition after hero
- page-spread reveal on scroll
- chapter-state highlighting in pipeline section
- soft layered parallax only where it supports the book feel

Motion rules:

- premium and tactile
- restrained
- visible enough to feel intentional
- mobile-safe

Avoid:

- excessive parallax
- arbitrary floating elements
- generic section fade-ins as the whole motion system

## Visual System Notes

Palette:

- inherit from app and `gardenbook.app`
- use the green book as the strongest accent object

Materials:

- hardcover green
- cream / paper surfaces
- subtle botanical drafting / linework
- tabs / ribbons / chapter markers

Technical sections must still feel like GardenBook.

Do not switch into a separate enterprise/engineering visual language.

## SEO / Routing Tasks

Update:

- `src/components/layout/App.tsx`
- `src/utils/seo.ts`

Add route metadata for:

- `/gardenbook`

Potential title direction:

- `GardenBook | Product Story & Build Case Study`

## Analytics / Event Tracking Tasks

Do not add a new analytics platform in this pass.

If existing site analytics are used, add event hooks for:

- GardenBook homepage CTA open
- GardenBook page visit
- outbound click to App Store
- outbound click to `gardenbook.app`
- outbound click to support/privacy

Likely utility file:

- `src/utils/analytics.ts`

## Asset List Needed

Needed before final polish:

- launch video file or embed strategy
- hero poster frame / fallback image
- app screenshots for product spreads
- any green-book brand imagery from the app/site
- App Store URL
- `gardenbook.app` final preferred CTA URL

Optional:

- botanical texture assets
- paper grain / hardcover texture references

## Copy Inputs Needed

- one-line product promise
- shipped/live wording
- preferred CTA labels
- short builder story paragraph
- final approved launch-strategy language

## Implementation Order

1. Create `/gardenbook` route and placeholder page shell.
2. Remove Fridai public homepage CTA.
3. Remove Fridai live showcase entry.
4. Add homepage GardenBook CTA.
5. Build hero and intro spread.
6. Build product spreads.
7. Build builder story and pipeline sections.
8. Add launch strategy and local-first AI roadmap section.
9. Add final CTA.
10. Wire SEO and event tracking.
11. Polish transitions and responsive behavior.

## Success Criteria

The page succeeds if:

- it feels like the GardenBook brand from the first frame
- the launch video and page feel continuous
- users understand GardenBook as a real shipped product quickly
- the analytics/data engineering story is clear without dominating the opening
- the page feels premium and intentional on desktop and mobile
- Fridai remains in the repo but no longer leads the public site
