import GlassPanel from '../shared/GlassPanel';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

export default function StepCard({ number, title, description }: StepCardProps) {
  return (
    <GlassPanel className="text-center">
      <div
        className="
          mx-auto mb-4 flex h-11 w-11 items-center justify-center
          rounded-full border border-brand/30 bg-brand/10
          text-lg font-bold text-brand
        "
        style={{ animation: 'pulse-soft 3s ease-in-out infinite' }}
      >
        {number}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-brand">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </GlassPanel>
  );
}
