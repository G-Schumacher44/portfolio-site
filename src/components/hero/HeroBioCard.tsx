import { motion, AnimatePresence } from 'framer-motion';
import { about } from '../../data/sections';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroBioCardProps {
  isVisible: boolean;
  onOpenResume: () => void;
  onOpenBio: () => void;
}

export default function HeroBioCard({ isVisible, onOpenResume, onOpenBio }: HeroBioCardProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute left-1/2 top-full z-30 mt-2 w-[340px] -translate-x-1/2 sm:w-[400px]"
          initial={reduced ? false : { opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="rounded-2xl border border-line/50 bg-card/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              {/* Photo */}
              <img
                src={about.photo}
                alt={about.photoAlt}
                width={80}
                height={80}
                className="mb-4 flex-shrink-0 rounded-full border-2 border-brand/20"
                style={{ animation: 'float 4s ease-in-out infinite' }}
              />

              {/* Bio content */}
              <div className="min-w-0">
                <p className="text-sm leading-relaxed text-text">{about.bio}</p>
                <p className="mt-2 text-xs text-muted">{about.availability}</p>
                <div className="mt-3 flex items-center justify-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenResume(); }}
                    className="text-sm font-medium text-brand transition-colors hover:text-text"
                  >
                    View Resume &rarr;
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenBio(); }}
                    className="text-xs text-muted/70 transition-colors hover:text-muted"
                  >
                    Full bio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
