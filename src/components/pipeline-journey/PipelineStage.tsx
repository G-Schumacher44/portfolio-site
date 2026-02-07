import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { PipelineStage as PipelineStageType } from '../../types';
import GlassPanel from '../shared/GlassPanel';

interface PipelineStageProps {
  stage: PipelineStageType;
  isActive: boolean;
}

export default function PipelineStage({ stage, isActive }: PipelineStageProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative flex gap-6">
      {/* Left: Stage node */}
      <div className="flex flex-col items-center">
        <motion.div
          className={`
            flex h-10 w-10 flex-shrink-0 items-center justify-center
            rounded-full border-2 text-sm font-bold
            transition-all duration-500
            ${
              isActive
                ? 'border-brand bg-brand/15 text-brand shadow-[0_0_16px_rgba(102,153,204,0.3)]'
                : 'border-line bg-card text-muted'
            }
          `}
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {stage.number}
        </motion.div>
      </div>

      {/* Right: Content */}
      <GlassPanel
        className={`flex-1 transition-all duration-500 ${
          isActive ? 'border-brand/20' : ''
        }`}
        onClick={() => setExpanded(!expanded)}
        hover
      >
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted/60">
          {stage.subtitle}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-brand">{stage.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{stage.description}</p>

        {/* Stats pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {stage.stats.map((stat) => (
            <span
              key={stat}
              className="rounded-full bg-brand/8 px-2.5 py-0.5 text-xs font-medium text-brand"
            >
              {stat}
            </span>
          ))}
        </div>

        {/* Code snippet */}
        {stage.codeSnippet && (
          <pre className="mt-4 overflow-x-auto rounded-xl bg-bg/80 p-4 font-mono text-xs leading-relaxed text-muted/80">
            <code>{stage.codeSnippet}</code>
          </pre>
        )}

        {/* Expand toggle */}
        <button
          className="mt-3 flex items-center gap-1 text-xs text-muted/60 transition-colors hover:text-muted"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          <span>{expanded ? 'Less' : 'More details'}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </button>

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 border-t border-line/50 pt-3">
                <p className="text-sm leading-relaxed text-muted">{stage.details}</p>
                {stage.links && stage.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {stage.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        {...(link.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-text"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.label}
                        {link.external && <ExternalLink size={12} />}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>
    </div>
  );
}
