import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { CaseStudyData } from '../../types';
import inventorySkuSample from '../../data/inventorySkuSample.json';
import retentionDashboard from '../../data/retentionDashboard.json';
import DocumentViewer from '../shared/DocumentViewer';

interface CaseStudyModalProps {
  study: CaseStudyData | null;
  onClose: () => void;
  reduced: boolean;
}

export default function CaseStudyModal({ study, onClose, reduced }: CaseStudyModalProps) {
  return createPortal(
    <AnimatePresence>
      {study && (
        <CaseStudyModalContent study={study} onClose={onClose} reduced={reduced} />
      )}
    </AnimatePresence>,
    document.body
  );
}

function CaseStudyModalContent({
  study,
  onClose,
  reduced,
}: {
  study: CaseStudyData;
  onClose: () => void;
  reduced: boolean;
}) {
  const [workbookOpen, setWorkbookOpen] = useState(false);
  const [execSummaryOpen, setExecSummaryOpen] = useState(false);
  const [retentionSummaryOpen, setRetentionSummaryOpen] = useState(false);
  const [vpSummaryOpen, setVpSummaryOpen] = useState(false);

  const anyDocOpen = workbookOpen || execSummaryOpen || retentionSummaryOpen || vpSummaryOpen;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (anyDocOpen) {
          setWorkbookOpen(false);
          setExecSummaryOpen(false);
          setRetentionSummaryOpen(false);
          setVpSummaryOpen(false);
        } else {
          onClose();
        }
      }
    },
    [onClose, anyDocOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
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
                <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-transparent to-transparent" />
                {study.heroMode !== 'retention' && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <div className="text-3xl font-bold text-brand">{study.heroStat}</div>
                    <div className="text-xs uppercase tracking-wider text-muted/70">{study.heroLabel}</div>
                  </div>
                )}
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

              {study.heroMode === 'dashboard' && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Executive Summary</div>
                    <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
                      <li>Sales peaked in Q4 2024 at $12.97M.</li>
                      <li>Refunds total $10.61M (21.14% of $50.18M gross sales).</li>
                      <li>Refund pressure is highest in Phone (24.10%) and NewEgg (22.67%).</li>
                      <li>Quality-related reasons account for $4.21M (39.68%) of refunds.</li>
                      <li>Key takeaway: growth is strong, but refunds must fall below 20% to protect margin.</li>
                    </ul>
                    <button
                      onClick={() => setVpSummaryOpen(true)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line/40 bg-surface/60 px-3 py-2 text-xs font-semibold text-text transition-all hover:border-brand/30 hover:text-brand"
                    >
                      Open Executive Summary
                      <ExternalLink size={12} className="opacity-50" />
                    </button>
                  </div>
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Recommendations</div>
                    <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
                      <li>Prioritize product QA flags on top return reasons (defective, damage, misdescription).</li>
                      <li>Recalibrate expedited shipping expectations to reduce mismatch returns.</li>
                      <li>De-risk high refund-rate channels with tighter policies and CX guardrails.</li>
                      <li>Focus regional interventions where refund rates exceed 21%.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 sm:col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-brand/70">Live Dashboard</div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm leading-relaxed text-text/80">
                        Explore the live Looker dashboard for channel, region, and refund driver insights.
                      </p>
                      <a
                        href="https://lookerstudio.google.com/reporting/e5f1454c-c8e4-481f-9ac8-375a3bdd289c"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/15 px-4 py-2 text-xs font-semibold text-brand transition-all hover:border-brand/60 hover:bg-brand/25"
                      >
                        Live Looker Dashboard
                        <ExternalLink size={12} className="opacity-60" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {study.heroMode === 'inventory' && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Executive Summary</div>
                    <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
                      <li>Utilization is low across the catalog; under‑performing SKUs are broadly distributed.</li>
                      <li>~$19.1M is tied up in under‑utilized inventory; a 20% reduction frees ~$3.8M.</li>
                      <li>Moderate attention tiers dominate; focus on forecasting, clearance, and promotions.</li>
                      <li>Tiering guide: &lt;0.20 Healthy · 0.20–0.50 Low · 0.50–0.80 Moderate · ≥0.80 High.</li>
                    </ul>
                    <button
                      onClick={() => setExecSummaryOpen(true)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line/40 bg-surface/60 px-3 py-2 text-xs font-semibold text-text transition-all hover:border-brand/30 hover:text-brand"
                    >
                      Open Executive Summary
                      <ExternalLink size={12} className="opacity-50" />
                    </button>
                  </div>
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Recommendations</div>
                    <ul className="mt-2 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted">
                      <li>Triage Tier 2 &amp; 3 SKUs; mitigating half the risk can prevent ~$500k annually.</li>
                      <li>Category‑level review to improve forecasting and supplier performance.</li>
                      <li>Address under‑utilized inventory (&lt;30%) with promos, bundles, and delisting.</li>
                      <li>Harden data validation to reduce anomalies and decision risk.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4 sm:col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Workbook Overview</div>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <button
                          onClick={() => setWorkbookOpen(true)}
                          className="inline-flex items-center gap-2 rounded-lg border border-line/40 bg-surface/60 px-3 py-2 text-xs font-semibold text-text transition-all hover:border-brand/30 hover:text-brand"
                        >
                          Open Workbook Overview
                          <ExternalLink size={12} className="opacity-50" />
                        </button>
                      </div>
                      <div className="text-xs leading-relaxed text-muted/70">
                        <p>
                          Key deliverable: an automated Google Sheet workbook that refreshes daily and
                          provides SKU-level drill-downs, tier filtering, and capital-loss estimates for
                          rapid action.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {study.heroMode === 'retention' && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Executive Summary</div>
                    <ul className="mt-2 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted">
                      <li>First→Second conversion averages ~34%; Nov/Dec '24 cohorts exceed 50%.</li>
                      <li>Month 1→3 retention drops ~11 points; weak cohorts (Jan/Apr '25) fall below 5% by Month 3.</li>
                      <li>Bronze tier shows 0% repeat; Platinum retains ~45–50%.</li>
                      <li>Phone drives 58% high‑CLV customers; Website/Email ~40%; Social Media lowest at 33%.</li>
                    </ul>
                    <button
                      onClick={() => setRetentionSummaryOpen(true)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line/40 bg-surface/60 px-3 py-2 text-xs font-semibold text-text transition-all hover:border-brand/30 hover:text-brand"
                    >
                      Open Executive Summary
                      <ExternalLink size={12} className="opacity-50" />
                    </button>
                  </div>
                  <div className="rounded-xl border border-line/30 bg-card/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60">Recommendations</div>
                    <ul className="mt-2 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted">
                      <li>Launch win‑back campaigns within 30 days for underperforming cohorts.</li>
                      <li>Replicate holiday campaign patterns across other seasonal peaks.</li>
                      <li>Redesign Bronze/Silver benefits to drive early repeat purchases.</li>
                      <li>Prioritize Email and Website acquisition; reposition Social for top‑of‑funnel.</li>
                    </ul>
                  </div>
                  {/* Retention CTA — mirrors the dashboard live link card */}
                  <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 sm:col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-brand/70">Want to see this for your business?</div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm leading-relaxed text-text/80">
                        I build retention dashboards, cohort analyses, and loyalty diagnostics for real businesses.
                      </p>
                      <a
                        href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/15 px-4 py-2 text-xs font-semibold text-brand transition-all hover:border-brand/60 hover:bg-brand/25"
                      >
                        Book a Discovery Call
                        <ExternalLink size={12} className="opacity-60" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

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

      {study.heroMode === 'inventory' && (
        <InventoryWorkbookViewer
          isOpen={workbookOpen}
          onClose={() => setWorkbookOpen(false)}
        />
      )}
      {study.heroMode === 'inventory' && (
        <DocumentViewer
          isOpen={execSummaryOpen}
          onClose={() => setExecSummaryOpen(false)}
          title="Inventory Audit — Executive Summary"
          src="/files/modals/case_inventory_audit_summary.html"
        />
      )}
      {study.heroMode === 'retention' && (
        <DocumentViewer
          isOpen={retentionSummaryOpen}
          onClose={() => setRetentionSummaryOpen(false)}
          title="Executive Summary — Retention Cohort Analysis"
          src="/files/retention_summary_modal.html"
        />
      )}
      {study.heroMode === 'dashboard' && (
        <DocumentViewer
          isOpen={vpSummaryOpen}
          onClose={() => setVpSummaryOpen(false)}
          title="Executive Summary — Retail Returns Diagnostic"
          src="/files/modals/case_vp_sales_summary.html"
        />
      )}
    </>
  );
}

// Inventory workbook viewer (image-based)
function InventoryWorkbookViewer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <DocumentViewer
      isOpen={isOpen}
      onClose={onClose}
      title="Inventory Audit Workbook Overview"
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-line/30 bg-[#0a0f14]/80">
          <img
            src="/img/case_study/story_01_dashboard.png"
            alt="Inventory audit workbook overview"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-muted/80">
          <p>
            The Inventory Audit Workbook is the primary interactive tool for exploring results. It
            provides SKU-level detail, pivot tables, and calculated fields to quantify locked capital,
            non-restockable losses, and utilization efficiency by product or category.
          </p>
          <div className="space-y-2 text-xs leading-relaxed text-muted/80">
            <p>
              Drill-Down Views: Filters for category, tier flag, and utilization ratio
            </p>
            <p>
              Capital &amp; Loss Estimates: Built-in formulas translate gaps and returns into financial
              exposure
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted/60">Flag Rules</p>
              <p>
                Return Rate: ≤ 0.12 = ✅ • 0.12–0.20 = ⚠️ • &gt; 0.20 = 🚨
              </p>
              <p>
                Utilization Ratio: ≤ 0.30 = ✅ • &gt; 0.30 = 🚨
              </p>
            </div>
          </div>
        </div>
      </div>
    </DocumentViewer>
  );
}

function DashboardHeroViz({ reduced }: { reduced: boolean }) {
  return (
    <div className="h-[360px] w-full p-5 sm:h-[460px]">
      <div className="grid h-full grid-cols-3 grid-rows-2 gap-4">
        <Panel title="Revenue Trend">
          <LinePanel reduced={reduced} />
        </Panel>
        <Panel title="Executive KPIs">
          <KpiPanel reduced={reduced} />
        </Panel>
        <Panel title="Refund Share by Shipping Speed">
          <DonutPanel
            reduced={reduced}
            segments={[
              { label: 'Standard', value: 6.84, color: '#60A5FA' },
              { label: 'Two‑day', value: 2.16, color: '#F59E0B' },
              { label: 'Overnight', value: 1.61, color: '#3B82F6' },
            ]}
            unit="M"
          />
        </Panel>
        <Panel title="Regional Refund Rate">
          <BarListPanel
            reduced={reduced}
            items={[
              { label: 'West', value: 22.21 },
              { label: 'Midwest', value: 21.29 },
              { label: 'South', value: 20.61 },
            ]}
            unit="%"
            barColorClassName="bg-sky-400/80"
            valueColorClassName="text-sky-200"
          />
        </Panel>
        <Panel title="Top Refund Reasons">
          <BarListPanel
            reduced={reduced}
            items={[
              { label: 'Changed mind', value: 1.77 },
              { label: 'Defective', value: 1.66 },
              { label: 'Better price', value: 1.5 },
            ]}
            unit="M"
            valuePrefix="$"
            labelSuffix="USD"
            barColorClassName="bg-rose-400/80"
            valueColorClassName="text-rose-200"
          />
        </Panel>
        <Panel title="Channel Refund Rate">
          <BarListPanel
            reduced={reduced}
            items={[
              { label: 'Phone', value: 24.1 },
              { label: 'NewEgg', value: 22.67 },
              { label: 'Web', value: 20.63 },
            ]}
            unit="%"
            barColorClassName="bg-amber-300/80"
            valueColorClassName="text-amber-200"
          />
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  titleClassName,
  showOverlay = true,
  bgClassName = 'bg-[#101a28]',
}: {
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
  showOverlay?: boolean;
  bgClassName?: string;
}) {
  return (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-xl border border-brand/20 p-3 shadow-[0_0_32px_rgba(102,153,204,0.18)] ${bgClassName}`}>
      <div className={`mb-2 text-[10px] uppercase tracking-wider text-brand/80 ${titleClassName ?? ''}`}>
        {title}
      </div>
      <div className="flex-1">{children}</div>
      {showOverlay ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
      ) : null}
    </div>
  );
}

function LinePanel({ reduced }: { reduced: boolean }) {
  const points = [18, 20, 22, 24, 26, 28, 30, 33, 31, 35];
  const path = points
    .map((v, i) => {
      const x = 8 + i * 24;
      const y = 72 - v;
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ');
  const peakIndex = points.indexOf(Math.max(...points));
  const startIndex = 0;
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
        fill="#F59E0B"
        initial={reduced ? false : { cx: 8 }}
        animate={reduced ? undefined : { cx: [8, 224, 8] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {/* Annotations */}
      <circle
        cx={8 + startIndex * 24}
        cy={72 - points[startIndex]}
        r="3"
        fill="rgba(34, 211, 238, 0.9)"
      />
      <circle
        cx={8 + peakIndex * 24}
        cy={72 - points[peakIndex]}
        r="3"
        fill="rgba(56, 189, 248, 1)"
      />
      <text x={8} y={14} fill="rgba(148,163,184,0.8)" fontSize="7">
        Q3 2024
      </text>
      <text x={150} y={14} fill="rgba(56,189,248,0.9)" fontSize="7">
        Peak Q4 2024
      </text>
      <text x={8} y={24} fill="rgba(148,163,184,0.7)" fontSize="7">
        $9.82M
      </text>
      <text x={150} y={24} fill="rgba(56,189,248,0.9)" fontSize="7">
        $12.97M
      </text>
      <line x1="6" y1="72" x2="234" y2="72" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
    </svg>
  );
}

function BarListPanel({
  reduced,
  items,
  unit,
  valuePrefix,
  labelSuffix,
  barColorClassName = 'bg-sky-300/70',
  valueColorClassName = 'text-brand',
}: {
  reduced: boolean;
  items: { label: string; value: number }[];
  unit: string;
  valuePrefix?: string;
  labelSuffix?: string;
  barColorClassName?: string;
  valueColorClassName?: string;
}) {
  const max = Math.max(...items.map((item) => item.value));
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {items.map((item, i) => {
        const width = (item.value / max) * 100;
        return (
          <div key={item.label} className="flex items-center gap-2 text-[10px] text-muted/70">
            <div className="w-16 uppercase tracking-wider">{item.label}</div>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-line/30">
              <motion.div
                className={`h-full rounded-full ${barColorClassName}`}
                initial={reduced ? false : { width: 0 }}
                animate={reduced ? undefined : { width: `${width}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            </div>
            <div className={`w-12 text-right ${valueColorClassName}`}>
              {valuePrefix}
              {item.value.toFixed(unit === 'M' ? 2 : 2)}
              {unit}
            </div>
            {labelSuffix && (
              <div className="w-10 text-[9px] uppercase tracking-wider text-muted/50">
                {labelSuffix}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DonutPanel({
  reduced,
  segments,
  unit,
}: {
  reduced: boolean;
  segments: { label: string; value: number; color: string }[];
  unit: string;
}) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const radius = 22;
  const cx = 40;
  const cy = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex h-full items-center gap-3">
      <svg viewBox="0 0 80 80" className="h-16 w-16">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="10"
          fill="none"
        />
        {segments.map((seg, i) => {
          const fraction = seg.value / total;
          const length = circumference * fraction;
          const dasharray = `${length} ${circumference - length}`;
          const dashoffset = -offset;
          offset += length;
          return (
            <motion.circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={radius}
              stroke={seg.color}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              initial={reduced ? false : { strokeDasharray: `0 ${circumference}` }}
              animate={reduced ? undefined : { strokeDasharray: dasharray }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            />
          );
        })}
      </svg>
      <div className="flex-1 space-y-1 text-[10px] text-muted/70">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
              <span className="uppercase tracking-wider">{seg.label}</span>
            </div>
            <span className="text-brand">
              ${seg.value.toFixed(2)}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiPanel({
  reduced,
  kpis,
}: {
  reduced: boolean;
  kpis?: { label: string; value: string }[];
}) {
  const items =
    kpis ??
    [
      { label: 'Refund Rate', value: '21.14%' },
      { label: 'Refunds', value: '$10.61M' },
      { label: 'Gross Sales', value: '$50.18M' },
    ];
  return (
    <div className="grid h-full grid-cols-3 gap-2">
      {items.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          className="flex flex-col items-center justify-center rounded-lg border border-line/30 bg-[#0a0f14]/80 p-2"
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <div
            className={
              kpi.label.toLowerCase().includes('refund')
                ? 'text-sm font-semibold text-rose-300'
                : 'text-sm font-semibold text-brand'
            }
          >
            {kpi.value}
          </div>
          <div className="text-[9px] uppercase tracking-wider text-muted/60">{kpi.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function InventoryHeroViz({ reduced }: { reduced: boolean }) {
  return (
    <div className="h-[280px] w-full p-4 sm:h-[360px]">
      <div className="grid h-full grid-cols-3 gap-3">
        <Panel title="Capital Locked">
          <DonutPanel
            reduced={reduced}
            segments={[
              { label: 'Locked', value: 19.1, color: '#F59E0B' },
              { label: 'Productive', value: 9.1, color: '#60A5FA' },
            ]}
            unit="M"
          />
        </Panel>
        <Panel title="Attention Tier Mix">
          <AttentionTierMix reduced={reduced} />
        </Panel>
        <Panel title="SKU Drill‑Down">
          <SkuDrilldown reduced={reduced} />
        </Panel>
      </div>
    </div>
  );
}

function SkuDrilldown({ reduced }: { reduced: boolean }) {
  const rows = inventorySkuSample.rows.map((row) => ({
    sku: row.sku,
    util: row.util_pct,
    returns: row.return_pct,
    tier: row.tier,
  }));
  const labelForTier = (tier: string) => {
    if (tier.toLowerCase().includes('high')) return 'High';
    if (tier.toLowerCase().includes('moderate')) return 'Moderate';
    if (tier.toLowerCase().includes('low')) return 'Low';
    return 'Healthy';
  };
  const tierForStyle = (tier: string) => labelForTier(tier);
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 grid grid-cols-4 text-[9px] uppercase tracking-wider text-muted/50">
        <span>SKU</span>
        <span className="text-right">Util</span>
        <span className="text-right">Return</span>
        <span className="text-right">Flag</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          className="space-y-2"
          initial={reduced ? false : { y: 0 }}
          animate={reduced ? undefined : { y: [0, -720, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        >
          {[...rows, ...rows].map((row, i) => (
            <div
              key={`${row.sku}-${i}`}
              className="grid grid-cols-4 items-center text-[10px] text-muted/70"
            >
              <span className="truncate pr-2">{row.sku}</span>
              <span className="text-right text-brand">{row.util}%</span>
              <span className="text-right text-brand/80">{row.returns}%</span>
              <span className="text-right">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                    tierForStyle(row.tier) === 'High'
                      ? 'bg-red-500/20 text-red-300'
                      : tierForStyle(row.tier) === 'Moderate'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : tierForStyle(row.tier) === 'Low'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {labelForTier(row.tier)}
                </span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function AttentionTierMix({ reduced }: { reduced: boolean }) {
  const tiers = inventorySkuSample.tier_counts || {};
  const items = [
    { label: 'High', value: tiers['Tier 3 – High Attention'] || 0, color: '#F97316' },
    { label: 'Moderate', value: tiers['Tier 2 – Moderate Attention'] || 0, color: '#FACC15' },
    { label: 'Low', value: tiers['Tier 1 – Low Attention'] || 0, color: '#38BDF8' },
    { label: 'Healthy', value: tiers['Tier 0 – Healthy'] || 0, color: '#34D399' },
  ];
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="flex h-full flex-col justify-center">
      {items.map((item, i) => {
        const width = (item.value / total) * 100;
        return (
          <div key={item.label} className="mb-2">
            <div className="mb-1 flex items-center justify-between text-[10px] text-muted/70">
              <span className="uppercase tracking-wider">{item.label}</span>
              <span className="text-brand">{item.value} SKUs</span>
            </div>
            <div className="h-2 w-full rounded-full bg-line/30">
              <motion.div
                className="h-full rounded-full"
                style={{ background: item.color }}
                initial={reduced ? false : { width: 0 }}
                animate={reduced ? undefined : { width: `${width}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            </div>
          </div>
        );
      })}
      <div className="mt-2 text-[10px] text-muted/70">
        Total SKUs: <span className="text-brand">{inventorySkuSample.total_skus}</span>
      </div>
    </div>
  );
}

function RetentionHeroViz({ reduced }: { reduced: boolean }) {
  return (
    <div className="w-full p-4">
      <div className="flex flex-col gap-3">
        <div className="min-h-[220px]">
          <Panel
            title="Cohort Retention (Months 0–6)"
            titleClassName="text-[16px] font-semibold tracking-[0.14em]"
            showOverlay={false}
          >
            <RetentionHeatmapPanel reduced={reduced} />
          </Panel>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Panel title="Avg Days to 2nd Purchase (Target 30d)" showOverlay={false} bgClassName="bg-[#05080f]">
            <SecondPurchasePanel reduced={reduced} />
          </Panel>
          <Panel title="CLV Mix by Channel" showOverlay={false} bgClassName="bg-[#05080f]">
            <ChannelClvPanel reduced={reduced} />
          </Panel>
          <Panel title="First→Second Conversion by Cohort" showOverlay={false} bgClassName="bg-[#05080f]">
            <ConversionPanel reduced={reduced} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function ConversionPanel({ reduced }: { reduced: boolean }) {
  const data = retentionDashboard.conversion;
  const values = data.map((d) => d.conversion_pct || 0).filter((v) => v > 0);
  const sorted = [...values].sort((a, b) => a - b);
  const p80 = sorted[Math.max(0, Math.floor(sorted.length * 0.8) - 1)] ?? 1;
  const max = Math.max(p80, 1);
  const daysMax = Math.max(...data.map((d) => d.avg_days || 0), 1);
  return (
    <svg viewBox="0 0 220 90" className="h-full w-full">
      {data.map((d, i) => {
        const rawH = (d.conversion_pct / max) * 60;
        const h = Math.max(rawH, 10);
        const x = 8 + i * 26;
        const y = 70 - h;
        return (
          <motion.rect
            key={d.cohort}
            x={x}
            width="16"
            rx="2"
            fill="rgba(96, 165, 250, 1)"
            initial={reduced ? { y, height: h } : { y: 70, height: 0 }}
            animate={{ y, height: h }}
            transition={{ duration: 0.6, delay: i * 0.04 }}
          />
        );
      })}
      {/* Avg days to 2nd purchase line */}
      <motion.path
        d={data
          .map((d, i) => {
            const x = 16 + i * 26;
            const y = 70 - (d.avg_days / daysMax) * 40;
            return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
          })
          .join(' ')}
        fill="none"
        stroke="rgba(245, 158, 11, 0.9)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={reduced ? undefined : { pathLength: 1 }}
        transition={{ duration: 1.1 }}
      />
      <text x="150" y="10" fill="rgba(245,158,11,0.9)" fontSize="7">Avg days →</text>
    </svg>
  );
}

function RetentionHeatmapPanel({ reduced }: { reduced: boolean }) {
  const rows = retentionDashboard.heatmap;
  const cols = 7;
  const values = rows.flatMap((r) => r.values.slice(1)); // skip month 0 = 100%
  const scaleMax = Math.max(...values.filter((v): v is number => v !== null && v > 0), 1);
  return (
    <svg viewBox="0 0 360 160" className="h-full w-full">
      {/* X-axis labels */}
      {Array.from({ length: cols }).map((_, i) => (
        <text key={i} x={64 + i * 36} y={150} fontSize="7" fill="rgba(148,163,184,0.7)">
          M{i}
        </text>
      ))}
      {rows.map((row, r) =>
        row.values.map((v: number | null, c: number) => {
          const x = 64 + c * 36;
          const y = 18 + r * 10;
          const norm = v ? Math.min((v / scaleMax), 1) : 0;
          const opacity = 0.2 + norm * 0.7;
          return (
            <motion.rect
              key={`${row.cohort}-${c}`}
              x={x}
              y={y}
              width="24"
              height="8"
              rx="2"
              fill={`rgba(56, 189, 248, ${opacity})`}
              stroke="rgba(15, 23, 42, 0.5)"
              strokeWidth="0.4"
              initial={reduced ? false : { opacity: 0 }}
              animate={reduced ? undefined : { opacity }}
              transition={{ duration: 0.4, delay: (r + c) * 0.01 }}
            />
          );
        })
      )}
      {/* Y-axis labels */}
      {rows.map((row, r) => (
        <text
          key={row.cohort}
          x={8}
          y={24 + r * 10}
          fontSize="7"
          fill="rgba(148,163,184,0.7)"
        >
          {row.cohort}
        </text>
      ))}
      <text x="8" y="156" fontSize="9" fill="rgba(226,232,240,0.9)">
        11pt 90-Day Retention Drop
      </text>
    </svg>
  );
}

function SecondPurchasePanel({ reduced }: { reduced: boolean }) {
  const data = retentionDashboard.conversion;
  const values = data.map((d) => d.avg_days || 0).filter((v) => v > 0);
  const sorted = [...values].sort((a, b) => a - b);
  const p80 = sorted[Math.max(0, Math.floor(sorted.length * 0.8) - 1)] ?? 1;
  const max = Math.max(p80, 1);
  const target = 30;
  const targetY = 70 - (target / max) * 60;
  return (
    <svg viewBox="0 0 220 90" className="h-full w-full">
      {/* Target line */}
      <line x1="6" x2="214" y1={targetY} y2={targetY} stroke="rgba(56,189,248,0.6)" strokeDasharray="3 2" />
      <text x="160" y={targetY - 2} fontSize="7" fill="rgba(56,189,248,0.8)">
        Target 30d
      </text>
      {data.map((d, i) => {
        const rawH = (d.avg_days / max) * 60;
        const h = Math.max(rawH, 10);
        const x = 8 + i * 26;
        const y = 70 - h;
        const slow = d.avg_days > target;
        return (
          <motion.rect
            key={d.cohort}
            x={x}
            width="16"
            rx="2"
            fill={slow ? 'rgba(251, 191, 36, 1)' : 'rgba(96, 165, 250, 1)'}
            initial={reduced ? { y, height: h } : { y: 70, height: 0 }}
            animate={{ y, height: h }}
            transition={{ duration: 0.6, delay: i * 0.04 }}
          />
        );
      })}
    </svg>
  );
}

function ChannelClvPanel({ reduced }: { reduced: boolean }) {
  const channels = retentionDashboard.clv_mix;
  return (
    <svg viewBox="0 0 240 90" className="h-full w-full">
      {channels.map((c, i) => {
        const y = 12 + i * 18;
        const lowW = (c.low_pct / 100) * 140;
        const medW = (c.med_pct / 100) * 140;
        const highW = (c.high_pct / 100) * 140;
        return (
          <g key={c.channel}>
            <text x="8" y={y - 2} fontSize="7" fill="rgba(148,163,184,0.7)">
              {c.channel}
            </text>
            <motion.rect
              x="8"
              y={y}
              height="8"
              rx="2"
              fill="rgba(147, 197, 253, 1)"
              initial={reduced ? { width: lowW } : { width: 0 }}
              animate={{ width: lowW }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            />
            <motion.rect
              x={8 + lowW}
              y={y}
              height="8"
              rx="2"
              fill="rgba(59, 130, 246, 1)"
              initial={reduced ? { width: medW } : { width: 0 }}
              animate={{ width: medW }}
              transition={{ duration: 0.6, delay: i * 0.05 + 0.1 }}
            />
            <motion.rect
              x={8 + lowW + medW}
              y={y}
              height="8"
              rx="2"
              fill="rgba(251, 191, 36, 1)"
              initial={reduced ? { width: highW } : { width: 0 }}
              animate={{ width: highW }}
              transition={{ duration: 0.6, delay: i * 0.05 + 0.2 }}
            />
            <text x={8 + lowW + medW + highW + 4} y={y + 7} fontSize="7" fill="rgba(251,191,36,1)">
              {c.high_pct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
