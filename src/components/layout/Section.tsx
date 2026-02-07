import { type ReactNode } from 'react';
import FadeIn from '../shared/FadeIn';
import GlowBackground from '../shared/GlowBackground';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  glow?: boolean;
  glowVariant?: 'default' | 'hero' | 'accent';
}

export default function Section({
  id,
  children,
  className = '',
  glow = false,
  glowVariant = 'default',
}: SectionProps) {
  return (
    <section id={id} className={`relative py-16 ${className}`}>
      {glow && <GlowBackground variant={glowVariant} />}
      <FadeIn className="relative z-10 mx-auto max-w-5xl px-4">
        {children}
      </FadeIn>
    </section>
  );
}
