import CountUp from '../shared/CountUp';
import type { StatItem as StatItemType } from '../../types';

interface StatItemProps {
  stat: StatItemType;
}

export default function StatItem({ stat }: StatItemProps) {
  if (stat.numericValue !== undefined) {
    return (
      <div className="min-w-[120px] text-center">
        <div className="text-3xl font-bold text-brand">
          <CountUp
            target={stat.numericValue}
            prefix={stat.prefix || ''}
            suffix={stat.suffix || ''}
          />
        </div>
        <div className="mt-1 text-sm text-muted">{stat.label}</div>
      </div>
    );
  }

  return (
    <div className="min-w-[120px] text-center">
      <div className="text-3xl font-bold text-brand">{stat.value}</div>
      <div className="mt-1 text-sm text-muted">{stat.label}</div>
    </div>
  );
}
