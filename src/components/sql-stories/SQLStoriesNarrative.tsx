import { motion } from 'framer-motion';
import CaseStudyVizCard from './CaseStudyVizCard';
import type { CaseStudyData } from '../../types';

interface SQLStoriesNarrativeProps {
  studies: CaseStudyData[];
  onSelectStudy: (study: CaseStudyData) => void;
  reduced: boolean;
}

const timeline = [
  {
    label: 'Q1',
    title: 'Returns Spike',
    metric: '$10.6M exposure flagged',
  },
  {
    label: 'Q2',
    title: 'Inventory Freeze',
    metric: '562 SKUs under-utilized',
  },
  {
    label: 'Q3',
    title: 'Retention Drop',
    metric: '11pt decline in 90 days',
  },
];

export default function SQLStoriesNarrative({
  studies,
  onSelectStudy,
  reduced,
}: SQLStoriesNarrativeProps) {
  return (
    <div className="space-y-10">
      {/* Year in Signals */}
      <div className="rounded-2xl border border-line/30 bg-card/40 p-6 shadow-[0_0_40px_rgba(102,153,204,0.08)]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-brand">Year in Signals</h3>
            <p className="mt-1 text-xs text-muted/70">
              QuickKart’s first year, captured in three pivotal moments.
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted/50">Q1–Q3</span>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
          <motion.div
            className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent"
            initial={reduced ? false : { opacity: 0.2 }}
            animate={reduced ? undefined : { opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="grid grid-cols-3 gap-4 text-center">
            {timeline.map((item, i) => (
              <div key={item.label} className="space-y-2">
                <motion.div
                  className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-brand/40 bg-brand/15 text-xs font-semibold text-brand shadow-[0_0_16px_rgba(56,189,248,0.2)]"
                  initial={reduced ? false : { scale: 0.9, opacity: 0.6 }}
                  animate={reduced ? undefined : { scale: [0.9, 1.05, 0.95], opacity: [0.6, 1, 0.8] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3 }}
                >
                  {item.label}
                </motion.div>
                <div className="text-xs font-semibold text-text">{item.title}</div>
                <div className="text-[10px] text-muted/60">{item.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three decisions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-brand">The Three Decisions</h3>
          <span className="text-[10px] uppercase tracking-wider text-muted/50">
            explore the cases
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {studies.map((study, index) => (
            <CaseStudyVizCard
              key={study.title}
              title={study.title}
              heroStat={study.heroStat}
              heroLabel={study.heroLabel}
              terminalLine={study.terminalLine}
              onClick={() => onSelectStudy(study)}
              vizType={index === 0 ? 'returns' : index === 1 ? 'inventory' : 'retention'}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
