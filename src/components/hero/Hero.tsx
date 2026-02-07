import { motion } from 'framer-motion';
import TerminalAnimation from './TerminalAnimation';
import HeroCTAs from './HeroCTAs';
import GlowBackground from '../shared/GlowBackground';
import { hero } from '../../data/sections';

export default function Hero() {
  return (
    <header className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Atmospheric glow */}
      <GlowBackground variant="hero" />

      {/* Terminal background */}
      <TerminalAnimation />

      {/* Content overlay */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-5xl font-bold tracking-tight text-text md:text-6xl">
          {hero.name}
        </h1>

        <p className="mt-2 text-xl font-medium tracking-tight text-brand md:text-2xl">
          {hero.tagline}
        </p>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          {hero.subtitle}
        </p>

        <HeroCTAs />
      </motion.div>
    </header>
  );
}
