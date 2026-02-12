import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Database,
  Shield,
  BarChart3,
  Workflow,
  FileText,
  Activity,
  Eye,
  Gauge,
  ZoomIn,
} from 'lucide-react';
import DocumentViewer from '../shared/DocumentViewer';

interface ArchitectureFlowChartProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */

/* ── High-level flow nodes (for the React flow chart) ──────── */

interface FlowNode {
  id: string;
  label: string;
  sub: string;
  color: string;
  icon: typeof Database;
  children?: string[]; // sub-items inside the node
}

const flowNodes: FlowNode[] = [
  {
    id: 'bronze',
    label: 'Bronze Layer',
    sub: 'GCS',
    color: 'amber',
    icon: Database,
    children: ['Partitioned Parquet', '_MANIFEST.json'],
  },
  {
    id: 'validation',
    label: 'Three-Layer Validation',
    sub: '',
    color: 'rose',
    icon: Shield,
    children: ['Bronze Quality', 'Silver Quality', 'Enriched Quality'],
  },
  {
    id: 'silver',
    label: 'Silver Layer',
    sub: 'Local/GCS',
    color: 'sky',
    icon: Database,
    children: ['Base Silver (dbt-duckdb)', 'Dimension Snapshots', 'Enriched Silver (Polars)'],
  },
  {
    id: 'gold',
    label: 'Gold Layer',
    sub: 'BigQuery',
    color: 'brand',
    icon: BarChart3,
    children: ['Fact Tables', 'Dimension Tables'],
  },
];

/* ── Detailed pipeline nodes ───────────────────────────────── */

interface DetailedNode {
  id: string;
  label: string;
  items: string[];
  color: string;
}

const detailedPipeline: DetailedNode[] = [
  { id: 'input', label: 'Bronze Input', items: ['Raw Parquet (partitioned by ingest_dt)', 'Lineage Metadata (_MANIFEST.json)'], color: 'amber' },
  { id: 'dims', label: 'Dimension Snapshots', items: ['Dims Fresh?', 'Snapshot Customers', 'Snapshot Products', '_latest.json pointer'], color: 'violet' },
  { id: 'base-silver', label: 'Base Silver (dbt-duckdb)', items: ['Type Casting & Cleaning', 'Deduplication', 'PK/FK Validation', 'Quarantine Rejects'], color: 'sky' },
  { id: 'enriched-silver', label: 'Enriched Silver (Polars)', items: ['Cart Attribution', 'Customer LTV', 'Product Performance', 'Daily Metrics', '10 transforms total'], color: 'violet' },
  { id: 'gcs', label: 'GCS Publish', items: ['Staging Prefix (_staging/run_id/)', 'Atomic Publish', 'Manifest + Pointer'], color: 'brand' },
  { id: 'bq', label: 'BigQuery Load', items: ['Parquet Import (WRITE_TRUNCATE)', 'Partition-level Idempotency'], color: 'brand' },
  { id: 'gold-marts', label: 'Gold Marts (dbt-bigquery)', items: ['Fact: Orders', 'Fact: Customers', '8 fact tables'], color: 'brand' },
];

/* ── Color map ─────────────────────────────────────────────── */

const colorMap: Record<string, { ring: string; bg: string; text: string; glow: string }> = {
  amber:  { ring: 'border-amber-400/30',  bg: 'bg-amber-400/8',  text: 'text-amber-300',  glow: 'shadow-[0_0_16px_rgba(251,191,36,0.1)]' },
  rose:   { ring: 'border-rose-400/30',   bg: 'bg-rose-400/8',   text: 'text-rose-300',   glow: 'shadow-[0_0_16px_rgba(251,113,133,0.1)]' },
  sky:    { ring: 'border-sky-400/30',    bg: 'bg-sky-400/8',    text: 'text-sky-300',    glow: 'shadow-[0_0_16px_rgba(56,189,248,0.1)]' },
  violet: { ring: 'border-violet-400/30', bg: 'bg-violet-400/8', text: 'text-violet-300', glow: 'shadow-[0_0_16px_rgba(167,139,250,0.1)]' },
  brand:  { ring: 'border-brand/30',      bg: 'bg-brand/8',      text: 'text-brand',      glow: 'shadow-[0_0_16px_rgba(102,153,204,0.12)]' },
};

/* ── Section nav ───────────────────────────────────────────── */

const sections = [
  { id: 'high-level', label: 'High-Level Flow' },
  { id: 'pipeline', label: 'Pipeline Detail' },
  { id: 'validation', label: 'Validation' },
  { id: 'airflow', label: 'Airflow DAGs' },
  { id: 'specs', label: 'Spec-Driven' },
  { id: 'observability', label: 'Observability' },
  { id: 'performance', label: 'Performance' },
];

/* ── Linked docs ───────────────────────────────────────────── */

const linkedDocs = [
  { label: 'dbt Observability', src: '/files/pipeline_project/dbt_observability.html' },
  { label: 'Metrics Snapshot', src: '/files/pipeline_project/metrics_snapshot.html' },
  { label: 'Data Contract', src: '/files/pipeline_project/data_contract.html' },
  { label: 'Data Dictionary', src: '/files/pipeline_project/data_dictionary.html' },
];

/* ════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════ */

export default function ArchitectureFlowChart({ isOpen, onClose }: ArchitectureFlowChartProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [docViewer, setDocViewer] = useState<{ label: string; src: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((id: string) => {
    const el = scrollRef.current?.querySelector(`[data-section="${id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-line/50 bg-bg/95 shadow-2xl backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label="Architecture Blueprint"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line/50 px-5 py-3 sm:px-8">
                <div>
                  <h2 className="text-lg font-bold text-brand sm:text-xl">Under the Hood</h2>
                  <p className="text-xs text-muted/60">
                    Medallion lakehouse — Bronze ingestion through Gold marts, with layered validation and atomic publishing.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-text"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable body */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">

                  {/* Layer pills */}
                  <div className="mb-4 flex flex-wrap justify-center gap-2">
                    {[
                      { label: 'Bronze', desc: 'immutable source', color: 'amber' },
                      { label: 'Silver', desc: 'contracts + quarantine', color: 'sky' },
                      { label: 'Gold', desc: 'BI marts', color: 'brand' },
                      { label: 'Validation', desc: '3-layer gates', color: 'rose' },
                    ].map((pill) => (
                      <span
                        key={pill.label}
                        className={`rounded-full border px-3 py-1 text-xs ${colorMap[pill.color].ring} ${colorMap[pill.color].bg}`}
                      >
                        <span className={`font-semibold ${colorMap[pill.color].text}`}>{pill.label}</span>
                        <span className="ml-1.5 text-muted/50">{pill.desc}</span>
                      </span>
                    ))}
                  </div>

                  {/* Section nav */}
                  <div className="mb-8 flex flex-wrap justify-center gap-2">
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className="rounded-lg border border-brand/20 bg-brand/8 px-3 py-1.5 text-xs font-semibold text-text transition-all hover:border-brand/40 hover:bg-brand/15"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* ─── SECTION: High-Level Data Flow ───────────── */}
                  <section data-section="high-level">
                    <SectionHeading icon={Database} title="High-Level Data Flow" />

                    {/* Flow chart — the React replacement for Mermaid */}
                    <div className="mb-6 grid gap-3 sm:grid-cols-2">
                      {flowNodes.map((node) => {
                        const c = colorMap[node.color];
                        const Icon = node.icon;
                        return (
                          <div
                            key={node.id}
                            className={`rounded-xl border p-4 transition-all hover:scale-[1.01] ${c.ring} ${c.bg} ${c.glow}`}
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <Icon size={16} className={c.text} />
                              <h4 className={`text-sm font-semibold ${c.text}`}>{node.label}</h4>
                              {node.sub && (
                                <span className="text-[10px] text-muted/40">({node.sub})</span>
                              )}
                            </div>
                            {node.children && (
                              <ul className="space-y-0.5">
                                {node.children.map((ch) => (
                                  <li key={ch} className="flex items-center gap-2 font-mono text-[11px] text-muted/60">
                                    <span className={`h-1 w-1 rounded-full ${c.text} opacity-50`} />
                                    {ch}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Animated flow SVG connecting the 4 boxes */}
                    <div className="relative mx-auto mb-8 w-full max-w-md">
                      <svg viewBox="0 0 400 120" className="w-full" preserveAspectRatio="xMidYMid meet">
                        {/* Connection path: Bronze → Validation → Silver → Gold */}
                        <path
                          d="M50 20 L150 20 L150 60 L250 60 L250 100 L350 100"
                          fill="none"
                          stroke="var(--color-brand)"
                          strokeOpacity="0.15"
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                        />
                        {/* Quarantine branch from Silver */}
                        <path
                          d="M200 60 L200 110"
                          fill="none"
                          stroke="var(--color-brand)"
                          strokeOpacity="0.1"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        {/* Labels */}
                        <text x="50" y="15" fill="var(--color-text)" fontSize="9" fontWeight="600" textAnchor="middle" opacity="0.6">Bronze</text>
                        <text x="150" y="15" fill="var(--color-text)" fontSize="9" fontWeight="600" textAnchor="middle" opacity="0.6">Validate</text>
                        <text x="250" y="55" fill="var(--color-text)" fontSize="9" fontWeight="600" textAnchor="middle" opacity="0.6">Silver</text>
                        <text x="350" y="95" fill="var(--color-text)" fontSize="9" fontWeight="600" textAnchor="middle" opacity="0.6">Gold</text>
                        <text x="215" y="115" fill="var(--color-text)" fontSize="7" textAnchor="start" opacity="0.3">Quarantine</text>

                        {/* Animated dot along main path */}
                        <circle r="3" fill="var(--color-brand)" opacity="0.7">
                          <animateMotion
                            dur="4s"
                            repeatCount="indefinite"
                            path="M50 20 L150 20 L150 60 L250 60 L250 100 L350 100"
                            calcMode="spline"
                            keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                            keyTimes="0;0.25;0.5;0.75;1"
                          />
                        </circle>

                        {/* Node dots */}
                        {[
                          { x: 50, y: 20, color: 'rgba(251,191,36,0.6)' },
                          { x: 150, y: 20, color: 'rgba(251,113,133,0.6)' },
                          { x: 250, y: 60, color: 'rgba(56,189,248,0.6)' },
                          { x: 350, y: 100, color: 'rgba(102,153,204,0.7)' },
                        ].map((dot, i) => (
                          <circle key={i} cx={dot.x} cy={dot.y} r="4" fill={dot.color}>
                            <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                          </circle>
                        ))}
                      </svg>
                    </div>
                  </section>

                  {/* ─── SECTION: Detailed Pipeline Flow ─────────── */}
                  <section data-section="pipeline">
                    <SectionHeading icon={Workflow} title="Detailed Pipeline Flow" />

                    <div className="relative space-y-2">
                      {detailedPipeline.map((node, i) => {
                        const c = colorMap[node.color];
                        const isLast = i === detailedPipeline.length - 1;
                        return (
                          <div key={node.id} className="relative">
                            {/* Connector */}
                            {!isLast && (
                              <div className="absolute left-5 top-full h-2 w-px bg-gradient-to-b from-brand/20 to-transparent" />
                            )}
                            <div className={`rounded-lg border p-3 ${c.ring} bg-card/40`}>
                              <h5 className={`mb-1 text-xs font-semibold ${c.text}`}>{node.label}</h5>
                              <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                                {node.items.map((item) => (
                                  <span key={item} className="font-mono text-[10px] text-muted/50">{item}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Quarantine side-note */}
                      <div className="ml-8 rounded-lg border border-rose-400/20 bg-rose-400/5 px-3 py-2">
                        <span className="font-mono text-[10px] text-rose-300/60">
                          Rejected Rows → Quarantine Tables (preserved, not dropped)
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* ─── SECTION: Three-Layer Validation ─────────── */}
                  <section data-section="validation" className="mt-10">
                    <SectionHeading icon={Shield} title="Three-Layer Validation Framework" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { title: 'Bronze Validation', desc: 'Manifest exists, row counts, schema conformance, coverage', color: 'amber' },
                        { title: 'Silver Validation', desc: 'PK/FK integrity, quarantine rate, row loss thresholds', color: 'sky' },
                        { title: 'Enriched Validation', desc: 'Business rules, min rows, null analysis', color: 'violet' },
                      ].map((card) => {
                        const c = colorMap[card.color];
                        return (
                          <div key={card.title} className={`rounded-xl border p-4 transition-all hover:scale-[1.01] ${c.ring} bg-card/40 ${c.glow}`}>
                            <h4 className={`mb-1 text-xs font-semibold ${c.text}`}>{card.title}</h4>
                            <p className="font-mono text-[11px] leading-relaxed text-muted/50">{card.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* ─── SECTION: Airflow DAGs ───────────────────── */}
                  <section data-section="airflow" className="mt-10">
                    <SectionHeading icon={Workflow} title="Airflow DAG Architecture" />

                    {/* Pipeline cards */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      {[
                        { title: 'Dim Refresh Pipeline', desc: 'Freshness gates, parallel snapshots, lightweight validation.' },
                        { title: 'Silver to Gold Pipeline', desc: 'Full Bronze → Gold with validation stages and optional BigQuery load.' },
                      ].map((card) => (
                        <div key={card.title} className="rounded-xl border border-line/20 bg-card/40 p-4">
                          <h4 className="mb-1 text-xs font-semibold text-text">{card.title}</h4>
                          <p className="font-mono text-[11px] text-muted/50">{card.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Airflow screenshots */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      {[
                        { src: '/files/pipeline_project/airflow_ui_01.png', alt: 'Airflow DAG orchestration overview', caption: 'Core pipeline DAG with Bronze → Silver → Gold dependencies.' },
                        { src: '/files/pipeline_project/airflow_ui_02.png', alt: 'Airflow task graph with quality gates', caption: 'Quality gates embedded in task graph for early failure detection.' },
                      ].map((img) => (
                        <figure key={img.src} className="group rounded-xl border border-line/20 bg-card/40 p-3">
                          <button
                            onClick={() => setLightboxSrc(img.src)}
                            className="relative block w-full overflow-hidden rounded-lg border border-line/20"
                          >
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="block w-full rounded-lg transition-transform group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                              <ZoomIn size={24} className="text-white opacity-0 transition-opacity group-hover:opacity-80" />
                            </div>
                          </button>
                          <figcaption className="mt-2 font-mono text-[10px] text-muted/40">{img.caption}</figcaption>
                        </figure>
                      ))}
                    </div>

                    {/* Additional Airflow detail cards */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { title: 'Partition-level recovery', desc: 'Backfill single partitions without replaying entire tables.' },
                        { title: 'Data quality enforcement', desc: 'Fail fast on contract violations before downstream publish.' },
                        { title: 'Layered orchestration', desc: 'Independent Bronze, Base Silver, Enriched Silver, Gold schedules.' },
                      ].map((card) => (
                        <div key={card.title} className="rounded-xl border border-line/20 bg-card/40 p-4">
                          <h4 className="mb-1 text-xs font-semibold text-text">{card.title}</h4>
                          <p className="font-mono text-[11px] text-muted/50">{card.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ─── SECTION: Spec-Driven ────────────────────── */}
                  <section data-section="specs" className="mt-10">
                    <SectionHeading icon={FileText} title="Spec-Driven Orchestration" />

                    <div className="mb-4 rounded-xl border border-line/20 bg-card/40 p-4">
                      <p className="font-mono text-[11px] leading-relaxed text-muted/60">
                        Specs define tables, partitions, PK/FK rules, and transform dependencies for dynamic DAG generation.
                        New tables are onboarded via spec file — zero code changes to orchestration.
                      </p>
                    </div>

                    {/* YAML snippet */}
                    <div className="overflow-hidden rounded-xl border border-line/20">
                      <div className="flex items-center gap-2 border-b border-line/20 bg-[#0a0f14] px-4 py-2">
                        <div className="flex gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-red-500/50" />
                          <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
                          <span className="h-2 w-2 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-[10px] text-muted/40">pipeline_spec.yml</span>
                      </div>
                      <pre className="bg-[#0a0f14]/90 p-4 font-mono text-xs leading-relaxed text-muted/60">
{`base_silver:
  tables:
    - name: orders
      partition_key: ingestion_dt
      primary_key: [order_id]
      foreign_keys:
        - column: customer_id
          references: customers.customer_id`}
                      </pre>
                    </div>
                  </section>

                  {/* ─── SECTION: Observability ───────────────────── */}
                  <section data-section="observability" className="mt-10">
                    <SectionHeading icon={Eye} title="Observability & Monitoring" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { title: 'Audit Trail', desc: 'Per-table JSON audits for SLA dashboards and alerts.' },
                        { title: 'Validation Reports', desc: 'Bronze, Silver, Enriched, and Dims snapshot reports.' },
                        { title: 'Structured Logging', desc: 'Local logs + Airflow task logs with enriched context.' },
                      ].map((card) => (
                        <div key={card.title} className="rounded-xl border border-line/20 bg-card/40 p-4">
                          <h4 className="mb-1 text-xs font-semibold text-text">{card.title}</h4>
                          <p className="font-mono text-[11px] text-muted/50">{card.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ─── SECTION: Performance ────────────────────── */}
                  <section data-section="performance" className="mt-10">
                    <SectionHeading icon={Gauge} title="Performance Characteristics" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { title: 'Base Silver', desc: '<2GB memory, under 2 minutes for 8 tables.' },
                        { title: 'Enriched Silver', desc: '<6GB memory, under 5 minutes for 10 transforms.' },
                        { title: 'Gold Marts', desc: 'Warehouse execution under 3 minutes for 8 facts.' },
                      ].map((card) => (
                        <div key={card.title} className="rounded-xl border border-line/20 bg-card/40 p-4">
                          <h4 className="mb-1 text-xs font-semibold text-text">{card.title}</h4>
                          <p className="font-mono text-[11px] text-muted/50">{card.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ─── Linked docs CTA row ──────────────────────── */}
                  <div className="mt-10 rounded-xl border border-line/30 bg-card/30 p-5">
                    <div className="mb-3 flex items-center justify-center gap-2">
                      <Activity size={14} className="text-brand/60" />
                      <span className="text-xs font-medium uppercase tracking-wider text-muted/60">
                        Pipeline Documentation
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {linkedDocs.map((doc) => (
                        <button
                          key={doc.label}
                          onClick={() => setDocViewer(doc)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line/40 bg-surface/60 px-3 py-1.5 text-xs font-medium text-text transition-all hover:border-brand/30 hover:text-brand"
                        >
                          {doc.label}
                          <FileText size={10} className="opacity-40" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom spacer */}
                  <div className="h-12" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for Airflow screenshots */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
          >
            <div className="absolute inset-0 bg-black/85" />
            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxSrc(null)}
                className="absolute -right-3 -top-3 z-10 rounded-full border border-line bg-card px-2.5 py-1 text-xs font-semibold text-text transition-colors hover:text-brand"
              >
                Close
              </button>
              <img
                src={lightboxSrc}
                alt="Expanded view"
                className="max-h-[85vh] max-w-[min(1200px,95vw)] rounded-xl border border-line shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document viewer for linked docs */}
      <DocumentViewer
        isOpen={!!docViewer}
        onClose={() => setDocViewer(null)}
        title={docViewer?.label}
        src={docViewer?.src}
      />
    </>
  );
}

/* ── Section heading helper ────────────────────────────────── */

function SectionHeading({ icon: Icon, title }: { icon: typeof Database; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-line/30 pb-2">
      <Icon size={14} className="text-brand/60" />
      <h3 className="text-sm font-semibold text-text">{title}</h3>
    </div>
  );
}
