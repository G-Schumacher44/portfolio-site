import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Section from '../layout/Section';
import GlassPanel from '../shared/GlassPanel';
import { trackTechnicalShowcaseOpen } from '../../utils/analytics';

const strips = [
  { src: '/img/tech_showcase/comic_strips/fridai/ollama_farm.png', alt: 'Ollama Farm' },
  { src: '/img/tech_showcase/comic_strips/fridai/release_strip.png', alt: 'Preview Release' },
];

export default function TechnicalShowcaseCTA() {
  const [active, setActive] = useState<{ src: string; alt: string } | null>(null);

  return (
    <Section id="technical-showcase-cta" glow glowVariant="accent">
      <GlassPanel className="relative overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-brand/70">
              Sunday Funnies Edition
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-brand">
              Technical Showcase (Comic Strip Cut)
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted/80">
              Engineer-to-engineer breakdowns, but with a little cartoon energy. Each project
              becomes its own panel — click in for the technical deep-dive.
            </p>
            <Link
              to="/technical-showcase"
              onClick={() => trackTechnicalShowcaseOpen('technical_showcase_cta')}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition-all hover:border-brand/70 hover:bg-brand/20"
            >
              Open the Sunday Funnies &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {strips.map((strip) => (
              <button
                key={strip.src}
                onClick={() => setActive(strip)}
                className="group overflow-hidden rounded-xl border border-line/40 bg-surface/50 transition-transform hover:-translate-y-0.5"
                aria-label={`View ${strip.alt}`}
              >
                <img
                  src={strip.src}
                  alt={strip.alt}
                  className="h-28 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(102,153,204,0.15),_transparent_60%)]" />
      </GlassPanel>

      {createPortal(
        <AnimatePresence>
          {active && (
            <motion.div
              className="fixed inset-0 z-[70] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setActive(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="relative max-h-[88vh] w-[92vw] max-w-4xl overflow-hidden rounded-3xl border-[3px] border-[#2b2a27] bg-white shadow-[10px_10px_0_#2b2a27]"
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                role="dialog"
                aria-modal="true"
                aria-label={active.alt}
              >
                <div className="flex items-center justify-between border-b-[3px] border-[#2b2a27] bg-[#fff3d6] px-5 py-2.5">
                  <span className="text-[11px] uppercase tracking-[0.4em] text-[#2b2a27]">
                    {active.alt}
                  </span>
                  <button
                    onClick={() => setActive(null)}
                    className="rounded-full border-2 border-[#2b2a27] bg-white p-1.5 transition-colors hover:bg-[#fff3d6]"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="max-h-[calc(88vh-52px)] overflow-y-auto">
                  <img
                    src={active.src}
                    alt={active.alt}
                    className="w-full"
                    style={{ borderRadius: 0, border: 'none', margin: 0, boxShadow: 'none' }}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Section>
  );
}
