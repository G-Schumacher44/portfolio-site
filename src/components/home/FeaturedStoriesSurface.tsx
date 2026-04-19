import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChartColumn, Newspaper } from 'lucide-react';
import Section from '../layout/Section';
import GardenBookHomepageCTA from '../gardenbook/GardenBookHomepageCTA';
import SQLStoriesCTA from '../sql-stories/SQLStoriesCTA';
import TechnicalShowcaseCTA from '../technical-showcase/TechnicalShowcaseCTA';

type StoryKey = 'gardenbook' | 'sql' | 'showcase';

const stories = [
  {
    key: 'gardenbook' as const,
    label: 'GardenBook',
    eyebrow: 'Live on the App Store',
    icon: BookOpen,
    summary: 'Product story, structured catalog pipeline, and the local-first roadmap.',
  },
  {
    key: 'sql' as const,
    label: 'My SQL Stories',
    eyebrow: 'Analytics Lab',
    icon: ChartColumn,
    summary: 'Three case studies in analytics, diagnostics, and operational decisioning.',
  },
  {
    key: 'showcase' as const,
    label: 'Technical Showcase',
    eyebrow: 'Sunday funnies cut',
    icon: Newspaper,
    summary: 'Analyst Toolkit MCP, data quality systems, and engineering builds in comic form.',
  },
];

const storyMap: Record<StoryKey, ReactNode> = {
  gardenbook: <GardenBookHomepageCTA embedded />,
  sql: <SQLStoriesCTA embedded />,
  showcase: <TechnicalShowcaseCTA embedded />,
};

const hashToStory: Record<string, StoryKey> = {
  '#gardenbook-cta': 'gardenbook',
  '#sql-stories': 'sql',
  '#technical-showcase-cta': 'showcase',
};

export default function FeaturedStoriesSurface() {
  const [activeStory, setActiveStory] = useState<StoryKey>('sql');

  useEffect(() => {
    const applyHash = () => {
      const next = hashToStory[window.location.hash];
      if (next) setActiveStory(next);
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const activeMeta = useMemo(
    () => stories.find((story) => story.key === activeStory) ?? stories[0],
    [activeStory],
  );

  return (
    <Section id="sql-stories" className="py-12 md:py-18" glow glowVariant="accent">
      <div className="relative">
        <div id="gardenbook-cta" className="pointer-events-none absolute -top-24" />
        <div id="technical-showcase-cta" className="pointer-events-none absolute -top-24" />

        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand/72">
              Featured Work
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text md:text-4xl">
              An eclectic mix of products, pipelines, and oddly useful things.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted md:text-base">
              A live App Store product, a data analysis lab, and a comic-strip archive of technical
              builds.
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-surface/72 p-2 shadow-[0_18px_48px_rgba(8,12,18,0.18)] backdrop-blur-xl">
            <div className="flex flex-wrap gap-2">
              {stories.map((story) => {
                const Icon = story.icon;
                const isActive = story.key === activeStory;

                return (
                  <button
                    key={story.key}
                    onClick={() => setActiveStory(story.key)}
                    className={`
                      inline-flex items-center gap-2 rounded-[1rem] px-3 py-2 text-left transition-all
                      ${isActive
                        ? 'bg-white/12 text-text shadow-[0_10px_24px_rgba(6,10,16,0.22)]'
                        : 'text-muted hover:bg-white/6 hover:text-text'}
                    `}
                    aria-pressed={isActive}
                  >
                    <span
                      className={`
                        flex h-8 w-8 items-center justify-center rounded-full border
                        ${isActive ? 'border-brand/30 bg-brand/15 text-brand' : 'border-white/10 bg-white/6'}
                      `}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">
                        {story.eyebrow}
                      </span>
                      <span className="block text-sm font-medium">{story.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-[1.4rem] border border-white/8 bg-surface/50 px-4 py-3 backdrop-blur-lg md:px-5">
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted">
            {activeMeta.eyebrow}
          </div>
          <p className="mt-1 text-sm text-text/88 md:text-[15px]">{activeMeta.summary}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStory}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {storyMap[activeStory]}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
