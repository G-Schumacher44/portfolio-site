import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { pipelineStages } from '../../data/pipelineStages';
import { caseStudies } from '../../data/caseStudies';
import TerminalStage from '../pipeline-journey/TerminalStage';
import DataParticle from '../pipeline-journey/DataParticle';
import DocumentViewer from '../shared/DocumentViewer';
import SQLStoriesNarrative from './SQLStoriesNarrative';
import CaseStudyModal from './CaseStudyModal';
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
  const [docViewer, setDocViewer] = useState<{ title: string; src: string } | null>(null);

  // Keyboard handling — innermost layer closes first
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (docViewer) {
          setDocViewer(null);
        } else if (activeStudy) {
          setActiveStudy(null);
        } else {
          onClose();
        }
      }
    },
    [onClose, activeStudy, docViewer]
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
  docViewer,
  setDocViewer,
}: {
  onClose: () => void;
  reduced: boolean;
  activeStudy: CaseStudyData | null;
  setActiveStudy: (s: CaseStudyData | null) => void;
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
        aria-label="My SQL Stories — QuickKart Case Studies"
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
            <h2 className="text-lg font-bold text-brand sm:text-xl">
              QuickKart: Year One
            </h2>
            <p className="text-xs text-muted/60">
              Three decisions, one dataset — built for curiosity, confidence, and clarity.
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
            {/* Narrative set piece */}
            <div className="mb-12">
              <SQLStoriesNarrative
                studies={caseStudies}
                onSelectStudy={setActiveStudy}
                reduced={reduced}
              />
            </div>

            <h3 className="mb-6 pl-[56px] text-lg font-semibold text-brand sm:pl-[64px]">
              How the insights were built
            </h3>
            <div className="mb-8 ml-[56px] inline-flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-left shadow-[0_0_30px_rgba(102,153,204,0.15)] sm:ml-[64px]">
              <div className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand/70" />
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-brand/80">Data Modeling Studio</div>
                <div className="mt-1 text-sm text-text/80">
                  Using my Operations Data Modeling Studio, we follow QuickKart's simulated data from raw numbers to actionable insight.
                </div>
              </div>
            </div>

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

            {/* Divider before CTA */}
            <div className="mt-12 flex items-center gap-4">
              <div className="h-px flex-1 bg-line/30" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted/40">your data could look like this</span>
              <div className="h-px flex-1 bg-line/30" />
            </div>

            {/* Client CTA */}
            <div className="mt-10 rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h4 className="text-sm font-semibold text-brand">
                Like what you see?
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-muted/70">
                I build these kinds of systems for real businesses. Let's talk about what your data could look like.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <a
                  href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition-all hover:border-brand/50 hover:bg-brand/20"
                >
                  Book a Discovery Call
                  <ExternalLink size={12} />
                </a>
                <a
                  href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-line/40 bg-surface/60 px-4 py-2 text-xs font-semibold text-text transition-all hover:border-brand/30 hover:text-brand"
                >
                  Schedule an Interview
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              </div>
            </div>

            {/* Bottom padding so last content is scrollable into view */}
            <div className="h-24" />
          </div>
        </div>
      </motion.div>

      {/* Case study sub-viewer (z-50, layers on top) */}
      <CaseStudyModal
        study={activeStudy}
        onClose={() => setActiveStudy(null)}
        reduced={reduced}
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
