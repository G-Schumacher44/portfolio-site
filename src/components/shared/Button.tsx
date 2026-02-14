import { type ReactNode } from 'react';
import {
  trackEvent,
  trackGenerateLead,
  trackResumeOpen,
  trackTechnicalShowcaseOpen,
} from '../../utils/analytics';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  external?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  href,
  variant = 'secondary',
  external = false,
  onClick,
  className = '',
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2
    rounded-xl px-5 py-2.5 text-sm font-medium
    transition-all duration-300 ease-out
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
  `;

  const variants = {
    primary: `
      relative overflow-hidden
      border border-brand bg-brand
      hover:opacity-90
      active:scale-[0.98]
    `,
    secondary: `
      border border-line bg-surface/80 text-text
      backdrop-blur-sm
      hover:border-brand/30 hover:bg-surface
      active:scale-[0.98]
    `,
    ghost: `
      text-muted
      hover:text-text hover:bg-surface/50
    `,
  };

  const cls = `${base} ${variants[variant]} ${className}`;

  const style = variant === 'primary' ? { backgroundColor: '#6699cc', color: '#ffffff', borderColor: '#6699cc' } : undefined;

  const getCtaLabel = (target: string) => {
    if (target.startsWith('mailto:')) return 'email_cta';
    if (target.includes('calendar.app.google')) return 'calendar_cta';
    if (target.startsWith('/')) return 'internal_nav_cta';
    return 'external_cta';
  };

  const handleClick = () => {
    if (href) {
      trackEvent('cta_click', 'button', getCtaLabel(href));
      if (href.includes('/pdf/gschumacher_resume.pdf')) {
        trackResumeOpen('button');
      }
      if (href.startsWith('/technical-showcase')) {
        trackTechnicalShowcaseOpen('button');
      }
      if (href.startsWith('mailto:')) {
        trackGenerateLead('email', 'button');
      }
      if (href.includes('calendar.app.google')) {
        trackGenerateLead('calendar', 'button');
      }
    }
    onClick?.();
  };

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={cls}
        style={style}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} style={style} onClick={handleClick}>
      {children}
    </button>
  );
}
