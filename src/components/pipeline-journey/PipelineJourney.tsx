import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { pipelineStages } from '../../data/pipelineStages';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import PipelineStage from './PipelineStage';
import DataParticle from './DataParticle';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { PipelineStage as PipelineStageType } from '../../types';

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

          {!reduced && (
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
          )}
        </div>

        {/* Stages */}
        <div className="space-y-8">
          {pipelineStages.map((stage, index) => (
            <PipelineStageWithProgress
              key={stage.id}
              stage={stage}
              index={index}
              activeIndex={activeIndex}
              reduced={reduced}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 text-center">
        <p className="mb-4 text-sm text-muted">
          This pipeline powers all three case studies above.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://github.com/G-Schumacher44"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/80 px-5 py-2.5 text-sm font-medium text-text transition-all hover:border-brand/30"
          >
            Explore All Repos
          </a>
          <a
            href="#case-studies"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-bg transition-all hover:bg-brand/90"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            See the Case Studies
          </a>
        </div>
      </div>
    </Section>
  );
}

function PipelineStageWithProgress({
  stage,
  index,
  activeIndex,
  reduced,
}: {
  stage: PipelineStageType;
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

  return <PipelineStage stage={stage} isActive={active} />;
}
