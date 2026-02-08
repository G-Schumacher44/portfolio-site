import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import HeroCTAs from './HeroCTAs';
import HeroBioCard from './HeroBioCard';
import GlowBackground from '../shared/GlowBackground';
import DocumentViewer from '../shared/DocumentViewer';
import { hero, about } from '../../data/sections';

export default function Hero() {
  const [cardVisible, setCardVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const supportsHover =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  const showCard = useCallback(() => {
    clearTimeout(hideTimer.current);
    setCardVisible(true);
  }, []);

  const hideCard = useCallback(() => {
    hideTimer.current = setTimeout(() => setCardVisible(false), 150);
  }, []);

  const handleOpenFullBio = useCallback(() => {
    setCardVisible(false);
    setModalOpen(true);
  }, []);

  // Click outside to dismiss
  useEffect(() => {
    if (!cardVisible) return;

    const handleClick = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setCardVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [cardVisible]);

  // Escape to dismiss
  useEffect(() => {
    if (!cardVisible) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCardVisible(false);
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [cardVisible]);

  return (
    <header className="relative flex min-h-[90vh] items-center justify-center">
      {/* Atmospheric glow */}
      <GlowBackground variant="hero" />

      {/* Content overlay */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Name trigger zone */}
        <div
          ref={triggerRef}
          className="relative inline-block"
          onMouseEnter={supportsHover ? showCard : undefined}
          onMouseLeave={supportsHover ? hideCard : undefined}
        >
          <h1 className="text-5xl font-bold tracking-tight text-text md:text-6xl">
            {hero.name}
          </h1>

          <button
            onClick={() => setCardVisible((prev) => !prev)}
            className="mt-1 text-xs italic text-muted/60 transition-colors hover:text-brand"
            aria-expanded={cardVisible}
            aria-haspopup="true"
          >
            Who is this guy?
          </button>

          <HeroBioCard isVisible={cardVisible} onOpenFullBio={handleOpenFullBio} />
        </div>

        <p className="mt-2 text-xl font-medium tracking-tight text-brand md:text-2xl">
          {hero.tagline}
        </p>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          {hero.subtitle}
        </p>

        <HeroCTAs />
      </motion.div>

      <DocumentViewer
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="About Me"
        src={about.modalSrc}
      />
    </header>
  );
}
