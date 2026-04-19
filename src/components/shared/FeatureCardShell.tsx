import { type ReactNode } from 'react';

interface FeatureCardShellProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  ambientClassName?: string;
}

export default function FeatureCardShell({
  children,
  className = '',
  innerClassName = '',
  ambientClassName = '',
}: FeatureCardShellProps) {
  return (
    <div
      className={`
        relative min-h-[26rem] overflow-hidden rounded-[2.15rem] border border-white/10
        bg-card/52 shadow-[0_24px_90px_rgba(7,12,20,0.24)] backdrop-blur-xl
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(102,153,204,0.08),transparent_36%)]" />
      <div className={`absolute inset-0 ${ambientClassName}`} />
      <div className="absolute inset-[1px] rounded-[calc(2.15rem-1px)] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
      <div
        className={`
          relative m-3 min-h-[calc(26rem-1.5rem)] overflow-hidden rounded-[1.7rem]
          ${innerClassName}
        `}
      >
        {children}
      </div>
    </div>
  );
}
