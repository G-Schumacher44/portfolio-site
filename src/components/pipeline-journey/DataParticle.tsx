import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface DataParticleProps {
  delay: number;
  duration: number;
  startY: number;
  endY: number;
}

export default function DataParticle({
  delay,
  duration,
  startY,
  endY,
}: DataParticleProps) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <motion.div
      className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_8px_rgba(102,153,204,0.5)]"
      initial={{ y: startY, opacity: 0 }}
      animate={{
        y: [startY, endY],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}
