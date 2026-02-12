import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import HeroCTAs from './HeroCTAs';
import HeroBioCard from './HeroBioCard';
import GlowBackground from '../shared/GlowBackground';
import DocumentViewer from '../shared/DocumentViewer';
import { hero, about } from '../../data/sections';

export default function Hero() {
  const [cardVisible, setCardVisible] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const supportsHover =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  const showCard = useCallback(() => {
    clearTimeout(hideTimer.current);
    setCardVisible(true);
  }, []);

  const hideCard = useCallback(() => {
    hideTimer.current = setTimeout(() => setCardVisible(false), 150);
  }, []);

  const handleOpenResume = useCallback(() => {
    setCardVisible(false);
    setResumeOpen(true);
  }, []);

  const handleOpenBio = useCallback(() => {
    setCardVisible(false);
    setBioOpen(true);
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
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line/50 bg-surface/60 px-3 py-1 text-xs text-muted transition-all hover:border-brand/40 hover:bg-surface hover:text-brand"
            aria-expanded={cardVisible}
            aria-haspopup="true"
          >
            About me ↓
          </button>

          <HeroBioCard isVisible={cardVisible} onOpenResume={handleOpenResume} onOpenBio={handleOpenBio} />
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
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        title="Resume — Garrett Schumacher"
        src={about.resumeSrc}
      />
      <DocumentViewer
        isOpen={bioOpen}
        onClose={() => setBioOpen(false)}
        title="About Me"
        src={about.modalSrc}
      />
    </header>
  );
}
