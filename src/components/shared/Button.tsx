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

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        style={style}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} style={style} onClick={onClick}>
      {children}
    </button>
  );
}
