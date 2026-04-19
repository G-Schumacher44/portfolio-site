import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronDown, ExternalLink, FileCheck, Leaf, PackageCheck, Scan, ShieldCheck, Sprout, X, Zap } from 'lucide-react';

import Navbar from '../components/layout/Navbar';
import { trackGardenBookOutbound } from '../utils/analytics';

// ─── Types ────────────────────────────────────────────────────────────────────

const TABS = ['The App', 'Launch', 'Knowledge Pipeline', 'Roadmap'] as const;
type TabId = (typeof TABS)[number];

// ─── Data ─────────────────────────────────────────────────────────────────────


const knowledgePipelineStages = [
  {
    id: 'sources',
    icon: Scan,
    label: 'Trusted Sources',
    tag: 'Real-world data',
    summary: 'Plant data sourced from Bonnie Plants, Burpee, Home Depot, and U.S. university extension programs.',
    detail: 'Source selection was deliberate: Bonnie Plants for U.S.-oriented planting guidance, Burpee for seed pricing and crop timing, MSU and Iowa State Extension where their evidence was stronger than commercial copy, Home Depot for current starter plant prices. No generic scraped web content. Every observation has a named source.',
  },
  {
    id: 'scrape',
    icon: Bot,
    label: 'AI-Assisted Collection',
    tag: 'Agent-driven sourcing',
    summary: 'AI agents used to collect, parse, and write raw observation batches from source pages.',
    detail: 'AI was used as the operator of the pipeline — not as a data enrichment layer inside it. Agents fetched source pages, extracted structured observations, and wrote raw batches into the staging directory. The price scraper runs against a JSON spec file and outputs a raw price observation batch. Agent output is always staged as untrusted raw evidence — never written directly into the catalog.',
  },
  {
    id: 'raw',
    icon: FileCheck,
    label: 'Raw Staging',
    tag: 'Untrusted evidence layer',
    summary: 'Raw observations split by type: plant facts, price observations, relationship observations.',
    detail: 'Raw batches land in data/raw/ and are never consumed by the app directly. Each batch preserves provenance — what source it came from, what was ambiguous, what needs human review. The pilot mapping note flagged specific entries for spot-check before promotion: price snippets with inconsistent markup, cultivar-to-species mapping assumptions, and relationship observations that were intentionally left sparse.',
  },
  {
    id: 'normalize',
    icon: Zap,
    label: 'Human Normalization',
    tag: 'Editorial promotion',
    summary: 'Reviewed records promoted by hand into normalized JSON — the canonical source of truth for the catalog.',
    detail: 'Normalization is not automatic. Raw evidence is reviewed, corrected, and promoted into data/normalized/ by hand. Ambiguous records stay flagged. The normalized layer owns the plant schema: names, taxonomy, growing windows, companion relationships, price ranges. Every change to the catalog happens here — never by editing generated outputs downstream.',
  },
  {
    id: 'validate',
    icon: ShieldCheck,
    label: 'Validate & Report',
    tag: 'Quality gate',
    summary: 'Automated validation checks completeness, gaps, and price coverage before generation can run.',
    detail: 'catalog:validate runs schema checks and completeness rules against the normalized data. catalog:report produces four artifacts: a summary with counts and validation status, a gaps report identifying missing fields per plant, a price summary with observed medians, and a promotion candidates report listing raw evidence not yet promoted into the curated catalog. Generation does not run until validation passes.',
  },
  {
    id: 'generate',
    icon: PackageCheck,
    label: 'Generate',
    tag: 'Deterministic artifact build',
    summary: 'Validated catalog compiled into typed TypeScript — the only thing the app ever imports.',
    detail: 'catalog:generate is deterministic: the same normalized JSON always produces the same output. Generated artifacts land in packages/catalog/src/generated/ and are committed to version control. They are statically typed and never hand-edited. The app imports only from @gardenfy/catalog — it has no visibility into the pipeline internals, raw staging, or normalized source files.',
  },
  {
    id: 'ship',
    icon: Sprout,
    label: 'Ship',
    tag: 'Bundled with the app',
    summary: 'Generated catalog bundled into the app binary. No server. No runtime API calls. No subscription.',
    detail: 'The catalog ships inside the app. Every user gets the same versioned, validated plant data — offline, permanently, without a network call. Catalog updates ship with new app versions. There is no catalog API, no cloud dependency, and no access tier. The knowledge is part of the product.',
  },
];

const roadmapStages = [
  {
    id: 'v1',
    version: 'v1.0.0',
    status: 'Shipped' as const,
    title: 'The foundation',
    tag: 'Live on the App Store — no assistant',
    summary: 'A complete, useful product. Local SQLite, validated plant catalog, full planning and budget tools. No AI assistant. No cloud. No subscription.',
    detail: 'v1.0.0 is not a preview of what comes next — it is a finished tool. Garden layout, crop planning, season timelines, budget tracking, and a curated plant catalog built by a real pipeline. Everything runs on device. No account required. The absence of an assistant is not a gap. It is the correct starting point: build the data layer first, ship something useful, then earn the right to add intelligence.',
    items: ['Local SQLite — all user data on device', 'Validated plant catalog — pipeline-generated', 'Layout, planning, budget, and season tools', 'No assistant. No cloud. No subscription.'],
  },
  {
    id: 'v2',
    version: 'v2.0.0',
    status: 'Planned' as const,
    title: 'The assistant',
    tag: 'On-device, bounded, hard-capped',
    summary: 'A private on-device assistant that operates only within the plant knowledgebase and the user\'s own local garden data. No API calls. No data leaves the device.',
    detail: 'The assistant in v2.0.0 is not a general-purpose chatbot bolted onto a garden app. It is a domain-specific tool, bounded by the same catalog the app already ships with and the user\'s own local SQLite data. Hard guardrails. No external model calls. No user data sent anywhere. It knows about plants, it knows about your garden, and it operates entirely within those two surfaces — nothing else.',
    items: ['Operates within knowledgebase + local garden data only', 'Hard-capped: no external calls, no data leaves device', 'No subscription to unlock — part of the app you own', 'Pre-trained domain knowledge with defined guardrails'],
  },
  {
    id: 'tune',
    version: 'v2.x+',
    status: 'Direction' as const,
    title: 'Progressive tuning',
    tag: 'Improves with your garden, not your data',
    summary: 'As your local data grows richer across seasons, the model can be tuned toward your garden specifically — privately, progressively, entirely on device.',
    detail: 'Each season adds more signal: what you planted, where, what worked, what didn\'t. Over time that local data layer becomes a detailed picture of one specific garden. The model can be tuned against it — not to train a shared system, but to make the assistant more useful for you specifically. This is the opposite of how cloud AI typically works. The value compounds on your device, for you, without ever leaving.',
    items: ['Tuned to your garden across seasons', 'Private — no shared training, no external data', 'Value compounds the longer you use the app', 'No new infrastructure, no new cost basis'],
  },
  {
    id: 'pattern',
    version: 'Beyond gardening',
    status: 'Thesis' as const,
    title: 'A replicable pattern',
    tag: 'AI that works for the user — not the platform',
    summary: 'This architecture — domain knowledgebase, local user data, bounded on-device model — is not specific to gardening. It is a template for any app that wants to add real AI value without becoming a data extraction business.',
    detail: 'Controllable. Safe. Data private. Practical. Democratic. Locally owned. These are not idealistic claims — they are the direct result of architectural choices made at v1.0.0. The knowledgebase is validated and versioned. The user data never leaves. The model operates within a defined boundary. Any domain-specific app can follow this pattern. GardenBook is where it gets built, tested, and proven in production.',
    items: ['Controllable — defined boundary, auditable behavior', 'Safe — no external calls, no misuse surface', 'Democratic — same capability for every user who owns the app', 'Locally owned — runs on your hardware, yours to keep'],
  },
];

function RoadmapTab() {
  const [open, setOpen] = useState<string | null>('v1');

  return (
    <div className="space-y-6">

      {/* Lead */}
      <div>
        <div className="text-[11px] uppercase tracking-[0.32em] text-[#557759]">The direction</div>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-[#173021]">AI that works for the user — not the platform.</h2>
        <p className="mt-3 max-w-2xl text-base leading-8 text-[#324633]">
          v1.0.0 shipped a complete, useful app with no AI assistant. That was intentional.
          The foundation comes first. The assistant is next — bounded, private, on-device, and
          hard-capped to what the app already knows.
        </p>
      </div>

      {/* Interactive version flowchart */}
      <div className="grid gap-0 lg:grid-cols-[1fr_2px_1fr]">

        {/* Left column — odd stages */}
        <div className="flex flex-col gap-3">
          {roadmapStages.map((stage, i) => {
            if (i % 2 !== 0) return <div key={stage.id} />;
            const isOpen = open === stage.id;
            const statusColors: Record<typeof stage.status, string> = {
              Shipped: 'bg-[#2d6e3e] text-[#c8e6cc]',
              Planned: 'bg-[#3a5a6e] text-[#c0d8e8]',
              Direction: 'bg-[#5a4a2e] text-[#e8d8b0]',
              Thesis: 'bg-[#4a3a5a] text-[#d8c8e8]',
            };
            return (
              <div key={stage.id} className={`overflow-hidden rounded-[1.4rem] border transition-all duration-200 ${isOpen ? 'border-[#1c3d27] bg-[#1c3d27]' : 'border-[#315438]/14 bg-[#faf8f0] hover:bg-[#f0ede2]'}`}>
                <button onClick={() => setOpen(isOpen ? null : stage.id)} className="flex w-full items-start gap-4 px-5 py-4 text-left">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${statusColors[stage.status]}`}>
                        {stage.status}
                      </span>
                      <span className={`font-mono text-xs ${isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'}`}>{stage.version}</span>
                    </div>
                    <div className={`mt-1.5 font-serif text-lg leading-tight ${isOpen ? 'text-[#edf3d7]' : 'text-[#183021]'}`}>{stage.title}</div>
                    <div className={`mt-0.5 text-xs ${isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'}`}>{stage.tag}</div>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }} className="mt-1 shrink-0">
                    <ChevronDown size={16} className={isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'} />
                  </motion.div>
                </button>
                <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="border-t border-[#edf3d7]/10 px-5 pb-5 pt-3 space-y-3">
                    <p className="text-sm leading-7 text-[#a8d4b0]">{stage.detail}</p>
                    <ul className="space-y-1.5">
                      {stage.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-[#edf3d7]/80">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#6ea87a]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Center line */}
        <div className="hidden lg:flex flex-col items-center py-2">
          <div className="w-[2px] flex-1 bg-[linear-gradient(180deg,transparent,#3d7a4a_8%,#3d7a4a_92%,transparent)]" />
        </div>

        {/* Right column — even stages */}
        <div className="flex flex-col gap-3 lg:mt-16">
          {roadmapStages.map((stage, i) => {
            if (i % 2 !== 1) return <div key={stage.id} />;
            const isOpen = open === stage.id;
            const statusColors: Record<typeof stage.status, string> = {
              Shipped: 'bg-[#2d6e3e] text-[#c8e6cc]',
              Planned: 'bg-[#3a5a6e] text-[#c0d8e8]',
              Direction: 'bg-[#5a4a2e] text-[#e8d8b0]',
              Thesis: 'bg-[#4a3a5a] text-[#d8c8e8]',
            };
            return (
              <div key={stage.id} className={`overflow-hidden rounded-[1.4rem] border transition-all duration-200 ${isOpen ? 'border-[#1c3d27] bg-[#1c3d27]' : 'border-[#315438]/14 bg-[#faf8f0] hover:bg-[#f0ede2]'}`}>
                <button onClick={() => setOpen(isOpen ? null : stage.id)} className="flex w-full items-start gap-4 px-5 py-4 text-left">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${statusColors[stage.status]}`}>
                        {stage.status}
                      </span>
                      <span className={`font-mono text-xs ${isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'}`}>{stage.version}</span>
                    </div>
                    <div className={`mt-1.5 font-serif text-lg leading-tight ${isOpen ? 'text-[#edf3d7]' : 'text-[#183021]'}`}>{stage.title}</div>
                    <div className={`mt-0.5 text-xs ${isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'}`}>{stage.tag}</div>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }} className="mt-1 shrink-0">
                    <ChevronDown size={16} className={isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'} />
                  </motion.div>
                </button>
                <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="border-t border-[#edf3d7]/10 px-5 pb-5 pt-3 space-y-3">
                    <p className="text-sm leading-7 text-[#a8d4b0]">{stage.detail}</p>
                    <ul className="space-y-1.5">
                      {stage.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-[#edf3d7]/80">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#6ea87a]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

const appChapters = [
  {
    id: 'design',
    title: 'Design & Layout',
    caption: 'Drag-and-drop layout canvas. Map your beds, borders, and containers exactly as they are.',
    detail: 'Place plants, arrange spaces, and see your whole season take shape — on the device in your pocket.',
    ipad: '/gardenbook/gardenbook_screens/resized/gardenbook-ipad-1-design.png',
    iphone: '/gardenbook/gardenbook_screens/resized/gardenbook-iphone-1-design.png',
  },
  {
    id: 'budget',
    title: 'Budget Tracking',
    caption: 'Track every nursery visit and tie spending to specific beds and seasons.',
    detail: 'Suggested prices come from the curated catalog — real observed nursery prices, not estimates.',
    ipad: '/gardenbook/gardenbook_screens/resized/gardenbook-ipad-2-budget.png',
    iphone: '/gardenbook/gardenbook_screens/resized/gardenbook-iphone-2-budget.png',
  },
  {
    id: 'overview',
    title: 'Season Overview',
    caption: "Everything in season at a glance.",
    detail: "What's growing, what's coming up, and what still needs filling — one clear view of your whole garden.",
    ipad: '/gardenbook/gardenbook_screens/resized/gardenbook-ipad-3-overview.png',
    iphone: '/gardenbook/gardenbook_screens/resized/gardenbook-iphone-3-overview.png',
  },
  {
    id: 'plan',
    title: 'Season Planning',
    caption: 'Sow dates, transplant windows, harvest ranges — all in one timeline.',
    detail: 'No spreadsheet. No guessing. Every plant in your garden mapped to its season, automatically.',
    ipad: '/gardenbook/gardenbook_screens/resized/gardenbook-ipad-4-plan.png',
    iphone: '/gardenbook/gardenbook_screens/resized/gardenbook-iphone-4-plan.png',
  },
  {
    id: 'home',
    title: 'Daily Focus',
    caption: 'What needs attention today.',
    detail: 'Calm, focused, no feed. Your garden — distilled to what actually matters right now.',
    ipad: '/gardenbook/gardenbook_screens/resized/gardenbook-ipad-5-gardens.png',
    iphone: '/gardenbook/gardenbook_screens/resized/gardenbook-iphone-5-home.png',
  },
];

type DevicePick = 'ipad' | 'iphone';

// All screens flat — used for hero rotation
const allHeroScreens = appChapters.map((c) => c.ipad);

function AppTab() {
  const [active, setActive] = useState(0);
  const [device, setDevice] = useState<DevicePick>('ipad');
  const [lightbox, setLightbox] = useState(false);
  const chapter = appChapters[active];
  const src = chapter[device];

  return (
    <>
      {/* Header + why */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="text-[11px] uppercase tracking-[0.32em] text-[#557759]">The App</div>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#173021]">
            Plan your garden. Own your data.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#324633]">
            GardenBook helps home gardeners map their spaces, track plants, plan their season,
            and manage a budget — all on device, with no account and no subscription.
          </p>
          <p className="mt-3 text-base leading-8 text-[#324633]">
            It works on iPhone and iPad. Your gardens, notes, and spending stay exactly where
            they belong: on your device, private, yours.
          </p>
        </div>
        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-[0.32em] text-[#557759]">Why a garden app</div>
          <div className="rounded-[1.8rem] border border-[#315438]/12 bg-[#faf8f0] p-5">
            <p className="text-sm leading-7 text-[#324633]">
              The existing market was subscription-heavy, often cartoonish in its UX, and didn't
              feel like it was serving real home gardeners. Most apps either overwhelmed with
              features or underdelivered on the basics.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-[#315438]/12 bg-[#faf8f0] p-5">
            <p className="text-sm leading-7 text-[#324633]">
              The niche felt open: a one-time purchase, no subscription, no cloud account required,
              genuine data privacy, and a UI that felt calm and considered rather than gamified.
              That combination didn't exist. We built it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:items-start">

        {/* Left — chapter list with inline drop-down blurb */}
        <div className="flex flex-col gap-2">
          {appChapters.map((c, i) => {
            const isActive = i === active;
            return (
              <div
                key={c.id}
                className={`overflow-hidden rounded-[1.4rem] border transition-all duration-200 ${
                  isActive
                    ? 'border-[#1c3d27] bg-[#1c3d27] shadow-[0_4px_20px_rgba(12,30,18,0.18)]'
                    : 'border-[#315438]/12 bg-[#faf8f0] hover:bg-[#f0ede2]'
                }`}
              >
                <button
                  onClick={() => setActive(i)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    isActive ? 'bg-[#edf3d7]/20 text-[#edf3d7]' : 'bg-[#315438]/10 text-[#557759]'
                  }`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-serif text-lg leading-tight ${isActive ? 'text-[#edf3d7]' : 'text-[#183021]'}`}>
                      {c.title}
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.22 }}>
                    <ChevronDown size={16} className={isActive ? 'text-[#a8d4b0]' : 'text-[#66805f]'} />
                  </motion.div>
                </button>

                {/* Blurb + device toggle drops down */}
                <motion.div
                  initial={false}
                  animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="border-t border-[#edf3d7]/10 px-5 pb-5 pt-3 space-y-3">
                    <p className="font-serif text-base text-[#edf3d7]">{c.caption}</p>
                    <p className="text-sm leading-6 text-[#a8d4b0]">{c.detail}</p>
                    {/* Device toggle */}
                    <div className="flex gap-1.5 pt-1">
                      {(['ipad', 'iphone'] as DevicePick[]).map((d) => (
                        <button
                          key={d}
                          onClick={(e) => { e.stopPropagation(); setDevice(d); }}
                          className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] transition-all ${
                            device === d
                              ? 'bg-[#edf3d7] text-[#1c3d27]'
                              : 'bg-[#edf3d7]/12 text-[#a8d4b0] hover:bg-[#edf3d7]/20'
                          }`}
                        >
                          {d === 'ipad' ? 'iPad' : 'iPhone'}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Right — screen, crossfades on chapter or device change */}
        <div className="sticky top-20">
          <motion.button
            onClick={() => setLightbox(true)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="group relative w-full overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#1e3d28_0%,#142a1c_100%)] p-4 shadow-[0_12px_40px_rgba(12,24,16,0.22)] transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <div
              className="relative mx-auto overflow-hidden rounded-[1.5rem] shadow-[0_8px_30px_rgba(6,14,10,0.35)]"
              style={{ width: device === 'iphone' ? '52%' : '100%' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={src}
                  src={src}
                  alt={chapter.title}
                  className="block w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                />
              </AnimatePresence>
            </div>
            <div className="absolute inset-0 flex items-end justify-end rounded-[2rem] p-5 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-full border border-[#dce5c6]/30 bg-[#0f2018]/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#eef4df] backdrop-blur-sm">
                expand
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1a0e]/92 p-6 backdrop-blur-md"
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setLightbox(false)} className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#1a3522]/80 text-[#eef4df]/70 backdrop-blur-sm hover:text-[#eef4df]">
                <X size={16} />
              </button>
              <img src={src} alt={chapter.title} className="max-h-[92vh] w-auto rounded-[1.5rem] object-contain shadow-[0_32px_80px_rgba(5,12,8,0.6)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PipelineTab() {
  const [openStage, setOpenStage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] uppercase tracking-[0.32em] text-[#557759]">Knowledge Pipeline</div>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-[#173021]">How the catalog gets built.</h2>
        <p className="mt-3 max-w-2xl text-base leading-8 text-[#324633]">
          The plant catalog inside GardenBook is not scraped and shipped raw. It runs through a
          7-stage pipeline — from trusted source collection and raw staging through human
          normalization, validation, reporting, and deterministic generation — before it ever
          touches the app.
        </p>
      </div>

      {/* Flowchart */}
      <div className="grid gap-0 lg:grid-cols-[1fr_2px_1fr]">

        {/* Left column — odd stages */}
        <div className="flex flex-col gap-0">
          {knowledgePipelineStages.map((stage, i) => {
            if (i % 2 !== 0) return <div key={stage.id} className="flex-1" />;
            const isOpen = openStage === stage.id;
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="relative flex flex-col">
                <button
                  onClick={() => setOpenStage(isOpen ? null : stage.id)}
                  className={`group flex items-center gap-3 rounded-[1.4rem] border px-5 py-4 text-left transition-all duration-200 ${
                    isOpen
                      ? 'border-[#1c3d27] bg-[#1c3d27] text-[#edf3d7]'
                      : 'border-[#315438]/14 bg-[#faf8f0] hover:bg-[#f0ede2] text-[#183021]'
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen ? 'bg-[#edf3d7]/15' : 'bg-[#315438]/10'
                  }`}>
                    <Icon size={16} className={isOpen ? 'text-[#a8d4b0]' : 'text-[#557759]'} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[10px] uppercase tracking-[0.28em] ${isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'}`}>{stage.tag}</div>
                    <div className={`mt-0.5 font-serif text-lg leading-tight ${isOpen ? 'text-[#edf3d7]' : 'text-[#183021]'}`}>{stage.label}</div>
                  </div>
                  <span className={`text-xs ${isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="rounded-b-[1.4rem] border border-t-0 border-[#1c3d27]/30 bg-[#f4f1e6] px-5 py-4">
                    <p className="text-sm leading-7 text-[#2a3d2a]">{stage.detail}</p>
                  </div>
                </motion.div>
                {/* Spacer to align with right column */}
                <div className="flex-1" />
              </div>
            );
          })}
        </div>

        {/* Center — connector line */}
        <div className="hidden lg:flex flex-col items-center py-2">
          <div className="w-[2px] flex-1 bg-[linear-gradient(180deg,transparent,#3d7a4a_8%,#3d7a4a_92%,transparent)]" />
        </div>

        {/* Right column — even stages */}
        <div className="flex flex-col gap-0 mt-0 lg:mt-[calc((100%/7)*0.5)]">
          {knowledgePipelineStages.map((stage, i) => {
            if (i % 2 !== 1) return <div key={stage.id} className="flex-1" />;
            const isOpen = openStage === stage.id;
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="relative flex flex-col">
                <button
                  onClick={() => setOpenStage(isOpen ? null : stage.id)}
                  className={`group flex items-center gap-3 rounded-[1.4rem] border px-5 py-4 text-left transition-all duration-200 ${
                    isOpen
                      ? 'border-[#1c3d27] bg-[#1c3d27] text-[#edf3d7]'
                      : 'border-[#315438]/14 bg-[#faf8f0] hover:bg-[#f0ede2] text-[#183021]'
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen ? 'bg-[#edf3d7]/15' : 'bg-[#315438]/10'
                  }`}>
                    <Icon size={16} className={isOpen ? 'text-[#a8d4b0]' : 'text-[#557759]'} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[10px] uppercase tracking-[0.28em] ${isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'}`}>{stage.tag}</div>
                    <div className={`mt-0.5 font-serif text-lg leading-tight ${isOpen ? 'text-[#edf3d7]' : 'text-[#183021]'}`}>{stage.label}</div>
                  </div>
                  <span className={`text-xs ${isOpen ? 'text-[#a8d4b0]' : 'text-[#66805f]'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="rounded-b-[1.4rem] border border-t-0 border-[#1c3d27]/30 bg-[#f4f1e6] px-5 py-4">
                    <p className="text-sm leading-7 text-[#2a3d2a]">{stage.detail}</p>
                  </div>
                </motion.div>
                <div className="flex-1" />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function LaunchTab() {
  return (
    <div className="space-y-8">

      {/* Lead */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="text-[11px] uppercase tracking-[0.32em] text-[#557759]">Marketing launch</div>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#173021]">
            Find the right people. Not just more people.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#324633]">
            We wanted people to use it. And we wanted to find our people — gardeners who plan
            their season, care about what goes in the ground, and would actually open the app
            in February.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { label: 'The audience', value: 'Home gardeners — raised bed growers, kitchen gardeners, people who plan their season with intention and care what goes in the ground.' },
            { label: 'The message', value: 'One-time purchase. No subscription. No cloud. Your data stays on device. A tool that works for you — not a platform extracting value from you.' },
            { label: 'The tone', value: 'Same as the app: calm, honest, practical. No hype. No "gardening just got smarter." Just a good tool, presented plainly.' },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.6rem] border border-[#315438]/12 bg-[#faf8f0] px-5 py-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#557759]">{item.label}</div>
              <p className="mt-1.5 text-sm leading-6 text-[#334733]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div>
        <div className="mb-5 text-[11px] uppercase tracking-[0.32em] text-[#557759]">How we went to market</div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: '01',
              title: 'Creator outreach — fit first',
              body: 'Targeted creators in the gardening, homestead, and slow-living space whose tone matched the product. Criteria was audience fit, not follower count. A seed-starting channel with 15k engaged gardeners is more useful than a generic lifestyle account with 200k scrollers.',
            },
            {
              n: '02',
              title: 'Mid-tier focus: 10k–100k',
              body: 'Creators in this range tend to have tighter community trust and better direct engagement than mega-accounts. They are more likely to genuinely try a product, be honest about it, and reach an audience that acts on recommendations.',
            },
            {
              n: '03',
              title: 'Promo codes to local gardening communities',
              body: 'Batches of promo codes sent to local community gardens, horticultural societies, and charity growing events. Real users, real use — not manufactured install numbers.',
            },
          ].map((item) => (
            <div key={item.n} className="rounded-[1.8rem] border border-[#315438]/12 bg-[#faf8f0] p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#66805f]">{item.n}</div>
              <h3 className="mt-3 font-serif text-xl text-[#183021]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#354936]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closer */}
      <div className="rounded-[2rem] border border-[#315438]/14 bg-[linear-gradient(135deg,#153322_0%,#274831_100%)] p-8 text-[#eef4df]">
        <div className="mb-3 text-[11px] uppercase tracking-[0.32em] text-[#dce5c6]/50">The principle</div>
        <h3 className="max-w-2xl font-serif text-2xl font-semibold leading-snug">
          Get the tool into the hands of the people who will actually benefit from it.
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#eef4df]/78">
          Someone who plans their raised beds every February, tracks what worked last season, and
          cares about what goes in the ground — that person gets real value from GardenBook.
          The launch strategy exists to find them. Not to find everyone.
        </p>
      </div>

    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div className="sticky top-0 z-30 border-b border-[#315438]/12 bg-[#f1f0e5]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-3 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              active === tab
                ? 'bg-[#1c3d27] text-[#eef4df]'
                : 'text-[#3d5c40] hover:bg-[#315438]/10 hover:text-[#1c3d27]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GardenBookPage() {
  const [activeTab, setActiveTab] = useState<TabId>('The App');
  const [heroScreenIdx, setHeroScreenIdx] = useState(0);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setHeroScreenIdx((i) => {
      let next = i;
      while (next === i) next = Math.floor(Math.random() * allHeroScreens.length);
      return next;
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f1f0e5] text-[#1b2d1d]">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#315438]/12 bg-[linear-gradient(175deg,#112717_0%,#173321_55%,#c8d5b0_100%)] text-[#f4f7ec]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(229,239,206,0.12),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(44,80,55,0.28),transparent_40%)]" />
          <div className="relative mx-auto grid max-w-6xl items-end gap-12 px-4 pb-0 pt-16 lg:grid-cols-2 lg:pt-20">
            <div className="pb-16 lg:pb-20">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe8c9]/18 bg-[#eef4dc]/8 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#e8f0d7]">
                <Leaf size={13} />
                Live on the App Store
              </div>
              <h1 className="mt-5 font-serif text-5xl font-semibold tracking-tight md:text-6xl">GardenBook</h1>
              <p className="mt-4 max-w-md text-lg leading-8 text-[#edf3de]/80">
                A local-first garden planning app. Your data and a trusted catalog — both staying exactly where they belong: on your device.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://apps.apple.com/us/app/gardenbook/id6762165125"
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => trackGardenBookOutbound('hero_app_store')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#edf3d7] px-5 py-3 text-sm font-semibold text-[#163221] transition-transform hover:-translate-y-0.5"
                >
                  Open on the App Store <ExternalLink size={15} />
                </a>
              </div>
              <div className="mt-4 flex gap-4 text-sm text-[#e7efda]/55">
                <a href="https://gardenbook.app/support" target="_blank" rel="noopener noreferrer" onClick={() => trackGardenBookOutbound('hero_support')} className="hover:opacity-80">Support</a>
                <a href="https://gardenbook.app/privacy" target="_blank" rel="noopener noreferrer" onClick={() => trackGardenBookOutbound('hero_privacy')} className="hover:opacity-80">Privacy</a>
              </div>
            </div>
            <div className="relative flex items-end justify-center self-end">
              <div className="absolute inset-x-[15%] top-8 h-40 rounded-[3rem] bg-[#0c1f10]/50 blur-3xl" />
              {/* Fixed-ratio container — all screens crossfade inside, no layout shift */}
              <div
                className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-t-[2rem] border border-[#31523b]/40 border-b-0 shadow-[0_-10px_50px_rgba(10,20,12,0.28)]"
                style={{ aspectRatio: '3 / 4' }}
              >
                <AnimatePresence>
                  <motion.img
                    key={heroScreenIdx}
                    src={allHeroScreens[heroScreenIdx]}
                    alt="GardenBook screen"
                    className="absolute inset-0 h-full w-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Tab bar */}
        <TabBar active={activeTab} onChange={handleTabChange} />

        {/* Tab content */}
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {activeTab === 'The App'            && <AppTab />}
              {activeTab === 'Launch'             && <LaunchTab />}
              {activeTab === 'Knowledge Pipeline' && <PipelineTab />}
              {activeTab === 'Roadmap'            && <RoadmapTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-[#315438]/12 bg-[linear-gradient(140deg,#183321_0%,#274a31_55%,#dde5c5_100%)]">
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
            <div className="flex flex-wrap items-center gap-5">
              {/* Icon */}
              <img
                src="/gardenbook/current/gardenbook-icon-cream-transparent.png"
                alt=""
                className="h-10 w-10 shrink-0 object-contain opacity-90"
              />
              {/* Official Apple badge */}
              <a
                href="https://apps.apple.com/us/app/gardenbook/id6762165125"
                target="_blank" rel="noopener noreferrer"
                onClick={() => trackGardenBookOutbound('footer_app_store')}
                className="transition-opacity hover:opacity-80"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-10 w-auto"
                />
              </a>
              {/* Divider */}
              <div className="h-5 w-px bg-[#eef4df]/20" />
              {/* Text links */}
              <a href="https://gardenbook.app" target="_blank" rel="noopener noreferrer" onClick={() => trackGardenBookOutbound('footer_site')} className="text-sm text-[#eef4df]/70 transition-opacity hover:opacity-90">gardenbook.app</a>
              <a href="https://gardenbook.app/support" target="_blank" rel="noopener noreferrer" onClick={() => trackGardenBookOutbound('footer_support')} className="text-sm text-[#eef4df]/70 transition-opacity hover:opacity-90">Support</a>
              <a href="https://gardenbook.app/privacy" target="_blank" rel="noopener noreferrer" onClick={() => trackGardenBookOutbound('footer_privacy')} className="text-sm text-[#eef4df]/70 transition-opacity hover:opacity-90">Privacy</a>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
