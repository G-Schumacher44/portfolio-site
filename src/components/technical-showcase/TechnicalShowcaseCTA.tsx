import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../layout/Section';
import FeatureCardShell from '../shared/FeatureCardShell';
import { trackTechnicalShowcaseOpen } from '../../utils/analytics';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const strips = [
  {
    src: '/img/tech_showcase/comic_strips/analyst_toolkit/analyst_toolkit_origins.png',
    alt: 'Analyst Toolkit Origins',
  },
  {
    src: '/img/tech_showcase/comic_strips/model_eval/model_eval_strip.png',
    alt: 'Model Evaluation Story',
  },
  {
    src: '/img/tech_showcase/comic_strips/datalakes/pipelines_main.png',
    alt: 'Datalakes Pipeline Story',
  },
  {
    src: '/img/tech_showcase/comic_strips/dirty_birds/dirty_birds_strip.png',
    alt: 'Dirty Birds Story',
  },
];

interface TechnicalShowcaseCTAProps {
  embedded?: boolean;
}

export default function TechnicalShowcaseCTA({
  embedded = false,
}: TechnicalShowcaseCTAProps) {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const interval = window.setInterval(() => {
      setBackgroundIndex((current) => (current + 1) % strips.length);
    }, 3600);
    return () => window.clearInterval(interval);
  }, [reduced]);

  const content = (
      <FeatureCardShell
        ambientClassName="bg-[radial-gradient(circle_at_top_left,rgba(255,215,127,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(83,64,24,0.08),transparent_32%)]"
        innerClassName="border border-[#2b2a27]/60 bg-[#f3e6cf]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden lg:block [perspective:1500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={strips[backgroundIndex].src}
                className="absolute inset-y-0 right-0 w-full origin-left overflow-hidden"
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, rotateY: -18, x: 24, scale: 0.98, filter: 'blur(1px)' }
                }
                animate={
                  reduced
                    ? { opacity: 0.22 }
                    : { opacity: 0.27, rotateY: 0, x: 0, scale: 1.03, filter: 'blur(0px)' }
                }
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, rotateY: 16, x: -20, scale: 0.985, filter: 'blur(1px)' }
                }
                transition={{ duration: reduced ? 0.2 : 0.78, ease: 'easeInOut' }}
              >
                <img
                  src={strips[backgroundIndex].src}
                  alt=""
                  className="absolute -right-6 top-0 h-full w-full object-cover object-left mix-blend-multiply"
                  loading="lazy"
                />
                <div className="absolute inset-y-0 left-0 w-10 bg-[linear-gradient(90deg,rgba(43,42,39,0.1),rgba(43,42,39,0.02),transparent)]" />
                <div className="absolute inset-y-0 left-0 w-px bg-[#2b2a27]/20" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(243,230,207,0.945)_0%,rgba(243,230,207,0.78)_44%,rgba(243,230,207,0.2)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_24%)]" />
        </div>
        <div className="grid min-h-[calc(26rem-1.5rem)] gap-6 px-6 py-8 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-full border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2b2a27]">
                Sunday Funnies Edition
              </div>
              <div className="inline-flex rounded-full border-2 border-[#2b2a27] bg-[#fff0c2] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#2b2a27]">
                Featured: Analyst Toolkit MCP
              </div>
            </div>
            <h2
              className="mt-4 text-4xl font-black tracking-tight text-[#2b2a27] md:text-5xl"
              style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.12)' }}
            >
              Technical Showcase (Comic Strip Cut)
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#2b2a27]/82 md:text-lg">
              Engineer-to-engineer breakdowns with a little cartoon energy. Open the showcase for
              the systems work: data quality engines, model-eval tooling, and lakehouse builds.
            </p>
            <div className="mt-4 max-w-md rounded-2xl border-2 border-[#2b2a27] bg-[#fff7e6]/92 px-4 py-3 text-sm leading-6 text-[#2b2a27]/80">
              The current lead story is <span className="font-semibold">Analyst Toolkit</span> as
              an MCP server: session-based tool chaining, audit dashboards, and a cleaner operator
              surface for data QA workflows.
            </div>
            <Link
              to="/technical-showcase"
              onClick={() => trackTechnicalShowcaseOpen('technical_showcase_cta')}
              className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-[#2b2a27] bg-[#2b2a27] px-4 py-2 text-sm font-semibold text-[#fff7e6] transition-opacity hover:opacity-85"
            >
              Open the Sunday Funnies &rarr;
            </Link>
            <Link
              to="/technical-showcase#analyst-toolkit"
              onClick={() => trackTechnicalShowcaseOpen('technical_showcase_cta_analyst_release')}
              className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-[#2b2a27] bg-[#fff7e6] px-4 py-2 text-sm font-semibold text-[#2b2a27] transition-colors hover:bg-[#fff0c2]"
            >
              View Analyst Toolkit details &rarr;
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_62%)]" />
      </FeatureCardShell>
  );

  if (embedded) return content;

  return (
    <Section id="technical-showcase-cta" glow glowVariant="accent">
      {content}
    </Section>
  );
}
