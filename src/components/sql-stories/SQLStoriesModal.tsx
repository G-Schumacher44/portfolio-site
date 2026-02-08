import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import { pipelineStages } from '../../data/pipelineStages';
import { caseStudies } from '../../data/caseStudies';
import TerminalStage from '../pipeline-journey/TerminalStage';
import DataParticle from '../pipeline-journey/DataParticle';
import DocumentViewer from '../shared/DocumentViewer';
import ArchitectureFlowChart from './ArchitectureFlowChart';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { CaseStudyData } from '../../types';

interface SQLStoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SQLStoriesModal({ isOpen, onClose }: SQLStoriesModalProps) {
  const reduced = useReducedMotion();

  // Sub-viewer state
  const [activeStudy, setActiveStudy] = useState<CaseStudyData | null>(null);
  const [archOpen, setArchOpen] = useState(false);
  const [docViewer, setDocViewer] = useState<{ title: string; src: string } | null>(null);

  // Keyboard handling — innermost layer closes first
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (docViewer) {
          setDocViewer(null);
        } else if (activeStudy) {
          setActiveStudy(null);
        } else if (archOpen) {
          setArchOpen(false);
        } else {
          onClose();
        }
      }
    },
    [onClose, activeStudy, archOpen, docViewer]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalContent
          onClose={onClose}
          reduced={reduced}
          activeStudy={activeStudy}
          setActiveStudy={setActiveStudy}
          archOpen={archOpen}
          setArchOpen={setArchOpen}
          docViewer={docViewer}
          setDocViewer={setDocViewer}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * Inner component that only mounts when modal is open.
 * This ensures useScroll's container ref is always attached to a real DOM node.
 */
function ModalContent({
  onClose,
  reduced,
  activeStudy,
  setActiveStudy,
  archOpen,
  setArchOpen,
  docViewer,
  setDocViewer,
}: {
  onClose: () => void;
  reduced: boolean;
  activeStudy: CaseStudyData | null;
  setActiveStudy: (s: CaseStudyData | null) => void;
  archOpen: boolean;
  setArchOpen: (v: boolean) => void;
  docViewer: { title: string; src: string } | null;
  setDocViewer: (v: { title: string; src: string } | null) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track which stages are active — cascades via onComplete callbacks
  const [activeStages, setActiveStages] = useState<boolean[]>(
    pipelineStages.map(() => reduced) // all true if reduced, all false otherwise
  );

  // Activate first stage after modal entrance animation completes
  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(() => {
      setActiveStages((prev) => prev.map((v, i) => (i === 0 ? true : v)));
    }, 500);
    return () => clearTimeout(timer);
  }, [reduced]);

  // When a stage completes, activate the next one after a brief pause
  const handleStageComplete = useCallback(
    (index: number) => {
      if (reduced) return;
      const nextIndex = index + 1;
      if (nextIndex < pipelineStages.length) {
        // Brief pause between stages, then auto-scroll and activate
        setTimeout(() => {
          setActiveStages((prev) => prev.map((v, i) => (i <= nextIndex ? true : v)));
          // Auto-scroll to keep the next stage in view
          const stageElements = scrollRef.current?.querySelectorAll('[data-stage]');
          stageElements?.[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
      }
    },
    [reduced]
  );

  // Scroll-linked progress track (visual only — doesn't control activation)
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const trackHeight = useTransform(scrollYProgress, [0, 0.85], ['0%', '100%']);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal panel */}
      <motion.div
        className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-line/50 bg-bg/95 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        role="dialog"
        aria-modal="true"
        aria-label="My SQL Stories — Pipeline Journey"
      >
        {/* GS logo watermark behind content */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img
            src="/img/logos/transparent_logo_centered.svg"
            alt=""
            className="h-[400px] w-[400px] object-contain opacity-[0.06]"
          />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-line/50 px-5 py-3 sm:px-8">
          <div>
            <h2 className="text-lg font-bold text-brand sm:text-xl">Follow the Data</h2>
            <p className="text-xs text-muted/60">
              Scroll to trace 194K rows through the pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-text"
            aria-label="Close journey"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
            {/* Ecosystem intro */}
            <div className="mb-10 text-center">
              <p className="text-sm leading-relaxed text-muted">
                <span className="font-semibold text-text">SQL Stories</span> is an interconnected
                ecosystem of open-source projects built for stress-testing analytics frameworks,
                data models, and data management strategies at scale. Every stage below — from
                synthetic data generation to executive reporting — is its own standalone project,
                wired together into a single end-to-end pipeline that mirrors production-grade
                data operations.
              </p>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
            </div>

            {/* Under the Hood CTA */}
            <button
              onClick={() => setArchOpen(true)}
              className="group mb-10 w-full rounded-xl border border-brand/15 bg-brand/5 p-5 text-left transition-all hover:border-brand/30 hover:bg-brand/8 hover:shadow-[0_0_24px_rgba(102,153,204,0.1)]"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-brand">
                  Under the Hood
                </h4>
                <span className="text-xs text-brand/40 transition-colors group-hover:text-brand">
                  Explore &rarr;
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted/60">
                How the pipeline is designed — medallion layers, validation gates, Airflow orchestration, data contracts, and performance benchmarks.
              </p>
            </button>

            <h3 className="mb-6 pl-[56px] text-lg font-semibold text-brand sm:pl-[64px]">
              Follow the Data
            </h3>

            {/* Stages container */}
            <div className="relative">
              {/* Progress track */}
              <div className="absolute bottom-0 left-[19px] top-0 w-px bg-line/30">
                <motion.div
                  className="w-full bg-gradient-to-b from-brand to-brand/30"
                  style={{ height: reduced ? '100%' : trackHeight }}
                />

                {!reduced && (
                  <>
                    <motion.div
                      className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-brand/40 blur-md"
                      style={{ top: trackHeight }}
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

              {/* Terminal stages */}
              <div className="space-y-6">
                {pipelineStages.map((stage, index) => (
                  <div key={stage.id} data-stage>
                    <TerminalStage
                      stage={stage}
                      isActive={activeStages[index]}
                      reduced={reduced}
                      onComplete={() => handleStageComplete(index)}
                      onDocOpen={(title, src) => setDocViewer({ title, src })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Case Studies bridge */}
            <div className="mt-12 space-y-0">
              {/* Bridge label */}
              <div className="flex justify-center pb-3">
                <div className="rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand">
                  Pipeline complete — three stories from one dataset
                </div>
              </div>

              {/* Branching line SVG */}
              <div className="relative mx-auto w-full max-w-md">
                <svg
                  viewBox="0 0 300 80"
                  className="mx-auto block w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Static lines */}
                  {/* Trunk */}
                  <line x1="150" y1="0" x2="150" y2="35" stroke="var(--color-brand)" strokeOpacity="0.15" strokeWidth="1" />
                  {/* Left branch */}
                  <path d="M150 35 Q150 55 50 60 L50 80" fill="none" stroke="var(--color-brand)" strokeOpacity="0.15" strokeWidth="1" />
                  {/* Center branch */}
                  <line x1="150" y1="35" x2="150" y2="80" stroke="var(--color-brand)" strokeOpacity="0.15" strokeWidth="1" />
                  {/* Right branch */}
                  <path d="M150 35 Q150 55 250 60 L250 80" fill="none" stroke="var(--color-brand)" strokeOpacity="0.15" strokeWidth="1" />

                  {/* Pulse dots — one per branch, all fire simultaneously */}
                  {/* Trunk pulse */}
                  <circle r="2.5" fill="var(--color-brand)" opacity="0.7">
                    <animateMotion dur="2s" repeatCount="indefinite" keyPoints="0;0.45" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                      <mpath href="#trunk-path" />
                    </animateMotion>
                  </circle>
                  {/* Left branch pulse */}
                  <circle r="2" fill="var(--color-brand)" opacity="0.6">
                    <animateMotion dur="2s" repeatCount="indefinite" begin="0.8s" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                      <mpath href="#left-branch" />
                    </animateMotion>
                  </circle>
                  {/* Center branch pulse */}
                  <circle r="2" fill="var(--color-brand)" opacity="0.6">
                    <animateMotion dur="2s" repeatCount="indefinite" begin="0.8s" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                      <mpath href="#center-branch" />
                    </animateMotion>
                  </circle>
                  {/* Right branch pulse */}
                  <circle r="2" fill="var(--color-brand)" opacity="0.6">
                    <animateMotion dur="2s" repeatCount="indefinite" begin="0.8s" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                      <mpath href="#right-branch" />
                    </animateMotion>
                  </circle>

                  {/* Hidden paths for animateMotion */}
                  <defs>
                    <path id="trunk-path" d="M150 0 L150 35" />
                    <path id="left-branch" d="M150 35 Q150 55 50 60 L50 80" />
                    <path id="center-branch" d="M150 35 L150 80" />
                    <path id="right-branch" d="M150 35 Q150 55 250 60 L250 80" />
                  </defs>
                </svg>
              </div>

              {/* Case study cards — terminal style */}
              <div className="grid gap-3 sm:grid-cols-3">
                {caseStudies.map((study) => (
                  <button
                    key={study.title}
                    onClick={() => setActiveStudy(study)}
                    className="group overflow-hidden rounded-xl border border-line/30 text-left transition-all hover:border-brand/20 hover:shadow-[0_0_20px_rgba(102,153,204,0.08)]"
                  >
                    {/* Mini terminal header */}
                    <div className="flex items-center gap-1.5 border-b border-line/20 bg-[#0a0f14] px-3 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500/50" />
                    </div>

                    {/* Terminal body with query */}
                    <div className="bg-[#0a0f14]/90 px-3 py-2.5 font-mono">
                      <div className="truncate text-[10px] leading-relaxed text-sky-200/70">
                        {study.terminalLine}
                      </div>
                    </div>

                    {/* Hero stat + title */}
                    <div className="bg-card/40 p-3">
                      <div className="text-2xl font-bold text-brand">{study.heroStat}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted/50">
                        {study.heroLabel}
                      </div>
                      <h4 className="mt-2 text-xs font-semibold text-text group-hover:text-brand">
                        {study.title}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>

              {/* Ecosystem end cap */}
              <div className="mt-8 rounded-xl border border-line/30 bg-card/30 p-5">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <Github size={16} className="text-brand/60" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted/60">
                    Explore the Source
                  </span>
                </div>
                <p className="mb-4 text-center text-[11px] text-muted/50">
                  Every piece of this pipeline is open-source — dive into the code behind each stage.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { label: 'Data Generator', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator' },
                    { label: 'Datalake Pipelines', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines' },
                    { label: 'Data Lake Extension', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten' },
                    { label: 'Year-End Sales Analysis', href: 'https://github.com/G-Schumacher44/VP-Request' },
                    { label: 'SQL Learning Lab', href: 'https://github.com/G-Schumacher44/sql_stories_skills_builder' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line/40 bg-surface/60 px-3 py-1.5 text-xs font-medium text-text transition-all hover:border-brand/30 hover:text-brand"
                    >
                      {link.label}
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom padding so last content is scrollable into view */}
            <div className="h-24" />
          </div>
        </div>
      </motion.div>

      {/* Architecture blueprint flow chart (z-50) */}
      <ArchitectureFlowChart
        isOpen={archOpen}
        onClose={() => setArchOpen(false)}
      />

      {/* Case study sub-viewer (z-50, layers on top) */}
      <DocumentViewer
        isOpen={!!activeStudy}
        onClose={() => setActiveStudy(null)}
        title={activeStudy?.title}
        src={activeStudy?.modalSrc}
      />

      {/* Pipeline doc viewer (z-50, for local doc links) */}
      <DocumentViewer
        isOpen={!!docViewer}
        onClose={() => setDocViewer(null)}
        title={docViewer?.title}
        src={docViewer?.src}
      />
    </motion.div>
  );
}
