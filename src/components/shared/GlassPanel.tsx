import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'section';
  onClick?: () => void;
}

export default function GlassPanel({
  children,
  className = '',
  hover = false,
  as = 'div',
  onClick,
}: GlassPanelProps) {
  const Component = motion.create(as);

  return (
    <Component
      className={`
        relative rounded-2xl border border-brand/12 bg-card/60 p-6
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={
        hover
          ? {
              y: -4,
              borderColor: 'rgba(102, 153, 204, 0.25)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            }
          : undefined
      }
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
