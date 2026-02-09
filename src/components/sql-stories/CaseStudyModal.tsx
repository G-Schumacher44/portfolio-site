import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { CaseStudyData } from '../../types';

interface CaseStudyModalProps {
  study: CaseStudyData | null;
  onClose: () => void;
  reduced: boolean;
}

export default function CaseStudyModal({ study, onClose, reduced }: CaseStudyModalProps) {
  if (!study) return null;

  return createPortal(
    <AnimatePresence>
      {study && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-line/40 bg-bg/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={`${study.title} case study`}
          >
            <div className="relative flex items-center justify-between border-b border-line/40 px-5 py-3 sm:px-8">
              <div>
                <h3 className="text-lg font-semibold text-brand sm:text-xl">{study.title}</h3>
                <p className="text-xs text-muted/60">{study.techStack}</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-text"
                aria-label="Close case study"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
                {/* Hero visual */}
                <div className="relative overflow-hidden rounded-2xl border border-line/30 bg-[#0a0f14]/90">
                  {study.heroMode === 'dashboard' ? (
                    <DashboardHeroViz reduced={reduced} />
                  ) : study.heroMode === 'inventory' ? (
                    <InventoryHeroViz reduced={reduced} />
                  ) : study.heroMode === 'retention' ? (
                    <RetentionHeroViz reduced={reduced} />
                  ) : (
                    <motion.img
                      src={study.image}
                      alt={study.imageAlt}
                      className="h-[280px] w-full object-contain sm:h-[360px]"
                      initial={reduced ? false : { opacity: 0.75 }}
                      animate={reduced ? undefined : { opacity: [0.75, 1, 0.85] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="text-3xl font-bold text-brand">{study.heroStat}</div>
                    <div className="text-xs uppercase tracking-wider text-muted/70">{study.heroLabel}</div>
                  </div>
                </div>

                {/* Narrative blocks */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Problem</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{study.problem}</p>
                  </div>
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Delivered</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{study.delivered}</p>
                  </div>
                  <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-brand/70">Impact</div>
                    <p className="mt-2 text-sm leading-relaxed text-text">{study.impact}</p>
                  </div>
                </div>

                {/* Action links */}
                {study.links && study.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {study.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-flex items-center gap-2 rounded-lg border border-line/40 bg-surface/60 px-4 py-2 text-xs font-semibold text-text transition-all hover:border-brand/30 hover:text-brand"
                      >
                        {link.label}
                        <ExternalLink size={12} className="opacity-50" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function DashboardHeroViz({ reduced }: { reduced: boolean }) {
  return (
    <div className="h-[280px] w-full p-4 sm:h-[360px]">
      <div className="grid h-full grid-cols-3 grid-rows-2 gap-3">
        <Panel title="Revenue Trend">
          <LinePanel reduced={reduced} />
        </Panel>
        <Panel title="Refund Rate">
          <BarPanel reduced={reduced} />
        </Panel>
        <Panel title="Channel Mix">
          <StackPanel reduced={reduced} />
        </Panel>
        <Panel title="Regional Heat">
          <HeatPanel reduced={reduced} />
        </Panel>
        <Panel title="Top SKUs">
          <RankPanel reduced={reduced} />
        </Panel>
        <Panel title="Executive KPIs">
          <KpiPanel reduced={reduced} />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-line/30 bg-[#0b1118]/90 p-3">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-muted/60">{title}</div>
      <div className="flex-1">{children}</div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/5 to-transparent" />
    </div>
  );
}

function LinePanel({ reduced }: { reduced: boolean }) {
  const points = [12, 18, 16, 22, 26, 21, 28, 32, 30, 35];
  const path = points
    .map((v, i) => {
      const x = 8 + i * 24;
      const y = 72 - v;
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 240 80" className="h-full w-full">
      <motion.path
        d={path}
        fill="none"
        stroke="rgba(56, 189, 248, 0.9)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={reduced ? undefined : { pathLength: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.circle
        cx="8"
        cy="60"
        r="3"
        fill="rgba(56, 189, 248, 0.9)"
        initial={reduced ? false : { cx: 8 }}
        animate={reduced ? undefined : { cx: [8, 224, 8] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <line x1="6" y1="72" x2="234" y2="72" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
    </svg>
  );
}

function BarPanel({ reduced }: { reduced: boolean }) {
  const values = [8, 12, 10, 16, 14, 9, 13, 18];
  const max = Math.max(...values);
  return (
    <svg viewBox="0 0 220 80" className="h-full w-full">
      {values.map((v, i) => {
        const h = (v / max) * 56;
        const x = 8 + i * 26;
        const y = 68 - h;
        return (
          <motion.rect
            key={i}
            x={x}
            y={reduced ? y : 68}
            width="16"
            height={reduced ? h : 0}
            rx="2"
            fill="rgba(34, 211, 238, 0.75)"
            initial={false}
            animate={reduced ? undefined : { y, height: h }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          />
        );
      })}
    </svg>
  );
}

function StackPanel({ reduced }: { reduced: boolean }) {
  const rows = [
    [30, 20, 15],
    [26, 18, 12],
    [32, 22, 14],
  ];
  const colors = ['rgba(56, 189, 248, 0.8)', 'rgba(34, 211, 238, 0.7)', 'rgba(20, 184, 166, 0.6)'];
  return (
    <svg viewBox="0 0 220 80" className="h-full w-full">
      {rows.map((row, r) => {
        let x = 8;
        return row.map((v, i) => {
          const w = v * 2;
          const rect = (
            <motion.rect
              key={`${r}-${i}`}
              x={x}
              y={12 + r * 20}
              width={reduced ? w : 0}
              height="12"
              rx="2"
              fill={colors[i]}
              initial={false}
              animate={reduced ? undefined : { width: w }}
              transition={{ duration: 0.7, delay: r * 0.1 + i * 0.05 }}
            />
          );
          x += w + 4;
          return rect;
        });
      })}
    </svg>
  );
}

function HeatPanel({ reduced }: { reduced: boolean }) {
  const cells = Array.from({ length: 20 }, (_, i) => 0.15 + ((i * 7) % 10) / 12);
  return (
    <svg viewBox="0 0 220 80" className="h-full w-full">
      {cells.map((v, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const x = 10 + col * 40;
        const y = 12 + row * 16;
        const opacity = 0.15 + v * 0.8;
        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width="28"
            height="10"
            rx="2"
            fill={`rgba(56, 189, 248, ${opacity})`}
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
          />
        );
      })}
      <motion.rect
        x="10"
        y="12"
        width="60"
        height="56"
        rx="4"
        fill="rgba(56, 189, 248, 0.08)"
        initial={reduced ? false : { x: 10 }}
        animate={reduced ? undefined : { x: [10, 140, 10] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </svg>
  );
}

function RankPanel({ reduced }: { reduced: boolean }) {
  const values = [70, 55, 48, 40, 35];
  return (
    <svg viewBox="0 0 220 80" className="h-full w-full">
      {values.map((v, i) => (
        <motion.rect
          key={i}
          x="10"
          y={10 + i * 14}
          width={reduced ? v * 2 : 0}
          height="8"
          rx="3"
          fill="rgba(56, 189, 248, 0.7)"
          initial={false}
          animate={reduced ? undefined : { width: v * 2 }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
        />
      ))}
    </svg>
  );
}

function KpiPanel({ reduced }: { reduced: boolean }) {
  const kpis = [
    { label: 'Refunds', value: '21%' },
    { label: 'Exposure', value: '$10.6M' },
    { label: 'Margin', value: '+4.2%' },
  ];
  return (
    <div className="grid h-full grid-cols-3 gap-2">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          className="flex flex-col items-center justify-center rounded-lg border border-line/30 bg-[#0a0f14]/80 p-2"
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <div className="text-sm font-semibold text-brand">{kpi.value}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted/60">{kpi.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function InventoryHeroViz({ reduced }: { reduced: boolean }) {
  return (
    <div className="h-[280px] w-full p-4 sm:h-[360px]">
      <div className="grid h-full grid-cols-2 gap-3">
        <div className="flex h-full flex-col gap-3">
          <Panel title="Inventory Heatmap">
            <HeatPanel reduced={reduced} />
          </Panel>
          <Panel title="SKU Risk Ranking">
            <RankPanel reduced={reduced} />
          </Panel>
        </div>
        <div className="flex h-full flex-col gap-3">
          <Panel title="Capital Locked">
            <BarPanel reduced={reduced} />
          </Panel>
          <Panel title="Actionable Tiers">
            <KpiPanel reduced={reduced} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function RetentionHeroViz({ reduced }: { reduced: boolean }) {
  return (
    <div className="h-[280px] w-full p-4 sm:h-[360px]">
      <div className="grid h-full grid-cols-2 gap-3">
        <div className="flex h-full flex-col gap-3">
          <Panel title="Cohort Retention">
            <LinePanel reduced={reduced} />
          </Panel>
          <Panel title="Loyalty Tier Mix">
            <StackPanel reduced={reduced} />
          </Panel>
        </div>
        <div className="flex h-full flex-col gap-3">
          <Panel title="Channel CLV">
            <BarPanel reduced={reduced} />
          </Panel>
          <Panel title="90-Day Drop">
            <KpiPanel reduced={reduced} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
