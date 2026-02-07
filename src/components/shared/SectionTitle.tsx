import { type ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export default function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2
      className={`
        mb-4 text-2xl font-semibold tracking-tight text-brand
        ${className}
      `}
    >
      {children}
    </h2>
  );
}
