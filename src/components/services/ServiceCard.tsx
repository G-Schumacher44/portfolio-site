import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, LayoutDashboard, Workflow, ChevronDown } from 'lucide-react';
import type { ServiceData } from '../../types';
import GlassPanel from '../shared/GlassPanel';

const iconMap: Record<string, typeof BarChart3> = {
  BarChart3,
  LayoutDashboard,
  Workflow,
};

interface ServiceCardProps {
  service: ServiceData;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[service.icon] || BarChart3;

  return (
    <GlassPanel
      as="article"
      hover
      onClick={() => setExpanded(!expanded)}
      className="text-left"
    >
      <div className="mb-3 inline-flex rounded-xl bg-brand/10 p-2.5">
        <Icon size={22} className="text-brand" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-brand">{service.title}</h3>
      <p className="text-sm leading-relaxed text-muted">{service.description}</p>

      {/* Expand indicator */}
      <div className="mt-3 flex items-center gap-1 text-xs text-muted/60">
        <span>{expanded ? 'Less' : 'Details'}</span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </div>

      {/* Expandable detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <ul className="mt-4 space-y-1.5 border-t border-line/50 pt-4">
              {service.includes.map((item) => (
                <li key={item} className="text-sm text-muted">
                  <span className="mr-2 text-brand/50">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              See it in action:{' '}
              <a
                href={service.proofHref}
                {...(service.proofExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="text-brand hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {service.proofLabel}
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}
