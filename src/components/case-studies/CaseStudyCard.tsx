import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { CaseStudyData } from '../../types';
import GlassPanel from '../shared/GlassPanel';
import Modal from '../shared/Modal';

interface CaseStudyCardProps {
  study: CaseStudyData;
}

export default function CaseStudyCard({ study }: CaseStudyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <GlassPanel as="article" className="overflow-hidden">
        {/* Thumbnail */}
        <button
          onClick={() => setModalOpen(true)}
          className="group relative mb-4 block w-full overflow-hidden rounded-xl"
        >
          <img
            src={study.image}
            alt={study.imageAlt}
            className="
              w-full object-cover transition-transform duration-500
              group-hover:scale-105
            "
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="absolute bottom-3 left-3 text-xs text-text/80 opacity-0 transition-opacity group-hover:opacity-100">
            Open case study
          </span>
        </button>

        <h3 className="mb-2 text-lg font-semibold text-brand">{study.title}</h3>

        {/* Problem always visible */}
        <p className="text-sm leading-relaxed text-muted">
          <strong className="text-brand">Problem:</strong> {study.problem}
        </p>

        {/* Expand for Delivered + Impact */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-xs text-muted/60 transition-colors hover:text-muted"
        >
          <span>{expanded ? 'Less' : 'See results'}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2 border-t border-line/50 pt-3">
                <p className="text-sm leading-relaxed text-muted">
                  <strong className="text-brand">Delivered:</strong> {study.delivered}
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  <strong className="text-brand">Impact:</strong> {study.impact}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tech stack + links */}
        <div className="mt-4 border-t border-line/50 pt-3">
          <p className="mb-2 text-xs text-muted/60">{study.techStack}</p>
          <div className="flex flex-wrap gap-3">
            {study.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-text"
              >
                {link.label}
                {link.external && <ExternalLink size={12} />}
              </a>
            ))}
          </div>
        </div>
      </GlassPanel>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={study.title}
        src={study.modalSrc}
      />
    </>
  );
}
