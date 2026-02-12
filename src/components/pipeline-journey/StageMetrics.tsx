import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StageMetricsProps {
  src: string;
  stageId: string;
}

interface TableMetric {
  table_name: string;
  row_count: number;
  test_pass_rate?: number;
  row_loss_pct?: number;
  status: string;
}

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        ref.current = value;
      }
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

export default function StageMetrics({ src, stageId }: StageMetricsProps) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [src]);

  if (error || !data) return null;

  // Extract table metrics from both silver_quality and enriched_silver formats
  const tables: TableMetric[] = [];
  const tableMetrics = (data as Record<string, unknown>).table_metrics as Record<string, Record<string, unknown>> | undefined;

  if (tableMetrics) {
    for (const [name, metrics] of Object.entries(tableMetrics)) {
      tables.push({
        table_name: name,
        row_count: (metrics.row_count as number) ?? 0,
        test_pass_rate: metrics.test_pass_rate as number | undefined,
        row_loss_pct: metrics.row_loss_pct as number | undefined,
        status: (metrics.status as string) ?? 'UNKNOWN',
      });
    }
  }

  if (tables.length === 0) return null;

  const totalRows = tables.reduce((sum, t) => sum + t.row_count, 0);
  const avgPassRate = tables
    .filter((t) => t.test_pass_rate != null)
    .reduce((sum, t, _, arr) => sum + (t.test_pass_rate ?? 0) / arr.length, 0);
  const overallStatus = (data as Record<string, unknown>).overall_status as string | undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted/40">
          Live pipeline metrics
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            overallStatus === 'PASS'
              ? 'bg-green-500/10 text-green-400'
              : 'bg-yellow-500/10 text-yellow-400'
          }`}
        >
          {overallStatus}
        </span>
      </div>

      {/* Summary row */}
      <div className="flex flex-wrap gap-3">
        <div className="rounded-lg border border-brand/10 bg-brand/5 px-3 py-1.5">
          <span className="font-mono text-sm font-bold text-brand">
            <AnimatedNumber value={totalRows} />
          </span>
          <span className="ml-1.5 text-[10px] text-muted/50">total rows</span>
        </div>
        <div className="rounded-lg border border-brand/10 bg-brand/5 px-3 py-1.5">
          <span className="font-mono text-sm font-bold text-brand">{tables.length}</span>
          <span className="ml-1.5 text-[10px] text-muted/50">tables</span>
        </div>
        {avgPassRate > 0 && (
          <div className="rounded-lg border border-green-500/10 bg-green-500/5 px-3 py-1.5">
            <span className="font-mono text-sm font-bold text-green-400">
              {avgPassRate.toFixed(1)}%
            </span>
            <span className="ml-1.5 text-[10px] text-muted/50">pass rate</span>
          </div>
        )}
      </div>

      {/* Table mini-grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {tables.slice(0, 6).map((table) => (
          <div
            key={table.table_name}
            className="flex items-center justify-between rounded-md border border-line/20 bg-card/40 px-2.5 py-1.5"
          >
            <span className="truncate font-mono text-[10px] text-muted/60">
              {table.table_name.replace(/^(stg_|int_|bronze_)/, '')}
            </span>
            <span
              className={`ml-2 flex-shrink-0 font-mono text-[10px] font-bold ${
                table.status === 'PASS' ? 'text-green-400/70' : 'text-yellow-400/70'
              }`}
            >
              {table.row_count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
