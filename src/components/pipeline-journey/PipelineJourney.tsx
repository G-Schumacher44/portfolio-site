import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ExternalLink } from 'lucide-react';
import { pipelineStages } from '../../data/pipelineStages';
import { caseStudies } from '../../data/caseStudies';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import TerminalStage from './TerminalStage';
import DataParticle from './DataParticle';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function PipelineJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const trackHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  const activeIndex = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.4, 0.55, 0.7, 0.85],
    [0, 1, 2, 3, 4, 4]
  );

  return (
    <Section id="pipeline-journey" glow glowVariant="accent">
      <SectionTitle>Follow the Data</SectionTitle>
      <p className="mb-8 max-w-2xl text-muted">
        From raw transaction to executive insight — trace a sale through the entire
        SQL Stories data pipeline.
      </p>

      <div ref={containerRef} className="relative">
        {/* Progress track */}
        <div className="absolute bottom-0 left-[19px] top-0 w-px bg-line/30">
          <motion.div
            className="w-full bg-gradient-to-b from-brand to-brand/30"
            style={{ height: reduced ? '100%' : trackHeight }}
          />

          {/* Glow pulse at active position */}
          {!reduced && (
            <>
              <motion.div
                className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-brand/40 blur-md"
                style={{
                  top: trackHeight,
                }}
              />
              <div className="absolute inset-0 overflow-hidden">
                {[0, 1, 2, 3, 4].map((i) => (
                  <DataParticle
                    key={i}
                    delay={i * 1.5}
                    duration={6}
                    startY={0}
                    endY={800}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Stages */}
        <div className="space-y-6">
          {pipelineStages.map((stage, index) => (
            <StageWithProgress
              key={stage.id}
              stage={stage}
              index={index}
              activeIndex={activeIndex}
              reduced={reduced}
            />
          ))}
        </div>
      </div>

      {/* Pipeline → Case Studies bridge */}
      <div className="mt-12 space-y-6">
        {/* Narrative connector */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-px bg-gradient-to-b from-brand/40 to-brand/10" />
          <div className="rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand">
            Pipeline complete — here's what it uncovered
          </div>
          <ArrowDown size={16} className="animate-bounce text-brand/40" />
        </div>

        {/* Case study preview cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          {caseStudies.map((study) => (
            <button
              key={study.title}
              onClick={() =>
                document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="group rounded-xl border border-line/30 bg-card/40 p-4 text-left transition-all hover:border-brand/20 hover:bg-card/60"
            >
              <div className="mb-2 overflow-hidden rounded-lg">
                <img
                  src={study.image}
                  alt={study.imageAlt}
                  className="h-24 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h4 className="text-sm font-semibold text-brand">{study.title}</h4>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted/70">
                {study.problem}
              </p>
            </button>
          ))}
        </div>

        {/* Final CTAs */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="#case-studies"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-medium text-bg transition-all hover:bg-brand/90"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Dive Into the Case Studies
          </a>
          <a
            href="https://github.com/G-Schumacher44"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/80 px-5 py-2.5 text-sm font-medium text-text transition-all hover:border-brand/30"
          >
            Explore All Repos
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </Section>
  );
}

function StageWithProgress({
  stage,
  index,
  activeIndex,
  reduced,
}: {
  stage: (typeof pipelineStages)[number];
  index: number;
  activeIndex: MotionValue<number>;
  reduced: boolean;
}) {
  const [active, setActive] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setActive(true);
      return;
    }
    const unsubscribe = activeIndex.on('change', (v) => {
      setActive(Math.round(v) >= index);
    });
    return unsubscribe;
  }, [activeIndex, index, reduced]);

  return <TerminalStage stage={stage} isActive={active} reduced={reduced} />;
}
