import { useCountUp } from '../../hooks/useCountUp';

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CountUp({
  target,
  prefix = '',
  suffix = '',
  duration = 2000,
  className = '',
}: CountUpProps) {
  const { value, ref } = useCountUp(target, duration);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
