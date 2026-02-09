import { type ReactNode } from 'react';

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
      border border-brand/40 bg-brand/10 text-brand
      backdrop-blur-sm
      hover:border-brand/60 hover:bg-brand/20 hover:text-text
      hover:shadow-[0_0_24px_rgba(102,153,204,0.2)]
      active:scale-[0.98]
      before:absolute before:inset-0 before:-z-10
      before:bg-gradient-to-br before:from-brand/5 before:to-transparent
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

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
