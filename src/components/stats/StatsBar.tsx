import { stats } from '../../data/sections';
import StatItem from './StatItem';
import FadeIn, { FadeInStagger, FadeInStaggerItem } from '../shared/FadeIn';

export default function StatsBar() {
  return (
    <FadeIn>
      <div
        className="
          border-y border-brand/10
          bg-gradient-to-r from-brand-dim via-transparent to-brand-dim
        "
      >
        <FadeInStagger
          className="
            mx-auto flex max-w-5xl flex-wrap items-center justify-around
            gap-6 px-4 py-8
          "
        >
          {stats.map((stat) => (
            <FadeInStaggerItem key={stat.label}>
              <StatItem stat={stat} />
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>
    </FadeIn>
  );
}
