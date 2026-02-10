import { motion } from 'framer-motion';

type VizType = 'returns' | 'inventory' | 'retention';

interface CaseStudyVizCardProps {
  title: string;
  heroStat: string;
  heroLabel: string;
  terminalLine: string;
  onClick: () => void;
  vizType: VizType;
  reduced: boolean;
}

export default function CaseStudyVizCard({
  title,
  heroStat,
  heroLabel,
  terminalLine,
  onClick,
  vizType,
  reduced,
}: CaseStudyVizCardProps) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-line/30 text-left transition-all hover:border-brand/20 hover:shadow-[0_0_24px_rgba(102,153,204,0.12)]"
    >
      {/* Mini terminal header */}
      <div className="flex items-center gap-1.5 border-b border-line/20 bg-[#0a0f14] px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-green-500/50" />
        <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-muted/40">
          case study
        </span>
      </div>

      {/* Terminal body with query */}
      <div className="bg-[#0a0f14]/90 px-3 py-2.5 font-mono">
        <div className="truncate text-[10px] leading-relaxed text-sky-200/70">
          {terminalLine}
        </div>
      </div>

      {/* Viz */}
      <div className="bg-card/40 px-4 py-4">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <div className="text-xl font-bold text-brand">{heroStat}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted/50">{heroLabel}</div>
          </div>
          <span className="text-[10px] text-brand/60 transition-colors group-hover:text-brand">
            open →
          </span>
        </div>
        <div className="relative rounded-lg border border-line/30 bg-[#0a0f14]/70 p-3">
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-sky-400/10 to-transparent"
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: [0, 0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {vizType === 'returns' && <ReturnsViz reduced={reduced} />}
          {vizType === 'inventory' && <InventoryDonut reduced={reduced} />}
          {vizType === 'retention' && <RetentionViz reduced={reduced} />}
        </div>
        <h4 className="mt-3 text-xs font-semibold text-text group-hover:text-brand">
          {title}
        </h4>
      </div>
    </button>
  );
}

function ReturnsViz({ reduced }: { reduced: boolean }) {
  const values = [6, 9, 10, 12, 8, 7, 11, 13, 9, 8, 7, 6];
  const max = Math.max(...values);
  const linePath = values
    .map((v, i) => {
      const x = i * 9.2 + 5;
      const y = 55 - (v / max) * 44;
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 120 60" className="h-14 w-full">
      <motion.path
        d={linePath}
        fill="none"
        stroke="rgba(245, 158, 11, 0.9)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={reduced ? undefined : { pathLength: 1 }}
        transition={{ duration: 1.2 }}
      />
      {values.map((v, i) => {
        const h = (v / max) * 44;
        const x = i * 9.2 + 2;
        const y = 55 - h;
        return (
          <motion.rect
            key={i}
            x={x}
            y={reduced ? y : 55}
            width="6"
            height={reduced ? h : 0}
            rx="1"
            fill="rgba(56, 189, 248, 0.7)"
            initial={false}
            animate={reduced ? undefined : { y, height: h }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
          />
        );
      })}
      <motion.circle
        cx="5"
        cy={55 - (values[0] / max) * 44}
        r="2.5"
        fill="#F59E0B"
        initial={reduced ? false : { cx: 5 }}
        animate={reduced ? undefined : { cx: [5, 108, 5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line
        x1="2"
        y1="55"
        x2="118"
        y2="55"
        stroke="rgba(148, 163, 184, 0.25)"
        strokeWidth="1"
        initial={reduced ? false : { opacity: 0.4 }}
        animate={reduced ? undefined : { opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
    </svg>
  );
}

function InventoryDonut({ reduced }: { reduced: boolean }) {
  const locked = 19.1;
  const productive = 9.1;
  const total = locked + productive;
  const lockedFrac = locked / total;
  const radius = 20;
  const cx = 40;
  const cy = 30;
  const circumference = 2 * Math.PI * radius;
  const lockedLen = circumference * lockedFrac;
  const productiveLen = circumference - lockedLen;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 80 60" className="h-14 w-20">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#F59E0B"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${lockedLen} ${circumference - lockedLen}`}
          strokeDashoffset={0}
          initial={reduced ? false : { strokeDasharray: `0 ${circumference}` }}
          animate={reduced ? undefined : { strokeDasharray: `${lockedLen} ${circumference - lockedLen}` }}
          transition={{ duration: 0.8 }}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#60A5FA"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${productiveLen} ${circumference - productiveLen}`}
          strokeDashoffset={-lockedLen}
          initial={reduced ? false : { strokeDasharray: `0 ${circumference}` }}
          animate={reduced ? undefined : { strokeDasharray: `${productiveLen} ${circumference - productiveLen}` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </svg>
      <div className="text-[10px] text-muted/70">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
          <span>$19.1M locked</span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
          <span>$9.1M productive</span>
        </div>
      </div>
    </div>
  );
}

function RetentionViz({ reduced }: { reduced: boolean }) {
  const series = [
    [90, 75, 62, 52, 45, 40],
    [85, 70, 58, 49, 43, 38],
    [78, 65, 54, 46, 41, 36],
  ];
  const colors = ['rgba(56, 189, 248, 0.8)', 'rgba(34, 211, 238, 0.7)', 'rgba(20, 184, 166, 0.7)'];
  return (
    <svg viewBox="0 0 120 60" className="h-14 w-full">
      {series.map((line, idx) => {
        const path = line
          .map((v, i) => {
            const x = 6 + i * 20;
            const y = 52 - (v / 100) * 36;
            return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
          })
          .join(' ');
        return (
          <motion.path
            key={idx}
            d={path}
            fill="none"
            stroke={colors[idx]}
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={reduced ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.8, delay: idx * 0.15 }}
          />
        );
      })}
      <motion.circle
        cx="6"
        cy="16"
        r="2.5"
        fill="rgba(56, 189, 248, 0.9)"
        initial={reduced ? false : { cx: 6, cy: 16 }}
        animate={reduced ? undefined : { cx: [6, 106, 6], cy: [16, 32, 16] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <line x1="4" y1="55" x2="116" y2="55" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
    </svg>
  );
}
