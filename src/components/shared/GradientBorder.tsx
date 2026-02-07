import { type ReactNode } from 'react';

interface GradientBorderProps {
  children?: ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export default function GradientBorder({
  children,
  className = '',
  direction = 'horizontal',
}: GradientBorderProps) {
  if (!children) {
    // Standalone divider line
    return (
      <div
        className={`${className}`}
        style={{
          height: direction === 'horizontal' ? '1px' : '100%',
          width: direction === 'horizontal' ? '100%' : '1px',
          background:
            direction === 'horizontal'
              ? 'linear-gradient(90deg, transparent, #6699cc, transparent)'
              : 'linear-gradient(180deg, transparent, #6699cc, transparent)',
        }}
      />
    );
  }

  // Wrapper with gradient border
  return (
    <div
      className={`rounded-2xl p-px ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(102,153,204,0.3), rgba(102,153,204,0.05), rgba(102,153,204,0.3))',
      }}
    >
      <div className="rounded-2xl bg-bg">{children}</div>
    </div>
  );
}
