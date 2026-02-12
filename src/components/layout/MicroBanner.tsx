import { useScrollDirection } from '../../hooks/useScrollDirection';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function MicroBanner() {
  const scrollDir = useScrollDirection();
  const visible = scrollDir === 'up';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40 }}
          animate={{ y: 0 }}
          exit={{ y: -40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="
            fixed left-0 right-0 top-0 z-50
            border-b border-brand/10
            bg-gradient-to-r from-brand-dim via-card to-brand-dim
            backdrop-blur-md
          "
        >
          <a
            href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-3 px-4 py-2
              text-sm text-muted no-underline transition-colors
              hover:text-text
            "
          >
            <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand">
              Available
            </span>
            <span>Book a Free Consultation — Let's discuss your data project</span>
            <ArrowRight size={14} className="text-brand" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
