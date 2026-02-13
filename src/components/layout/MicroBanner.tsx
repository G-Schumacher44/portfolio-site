import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function MicroBanner() {
  const scrollDir = useScrollDirection();
  const visible = scrollDir === 'up';
  const { pathname } = useLocation();
  const contactHref = pathname === '/technical-showcase' ? '#showcase-contact' : '#contact';

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
            href={contactHref}
            className="
              flex items-center justify-center gap-3 px-4 py-2
              text-sm text-muted no-underline transition-colors
              hover:text-text
            "
          >
            <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand">
              Available
            </span>
            <span>Let's Talk — Open to full-time, contract, and freelance roles</span>
            <ArrowRight size={14} className="text-brand" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
