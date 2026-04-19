import { useState } from 'react';
import { Activity, BarChart3, Play } from 'lucide-react';
import Section from '../layout/Section';
import FeatureCardShell from '../shared/FeatureCardShell';
import SQLStoriesModal from './SQLStoriesModal';
import { trackSqlStoriesModalOpen } from '../../utils/analytics';

interface SQLStoriesCTAProps {
  embedded?: boolean;
}

export default function SQLStoriesCTA({ embedded = false }: SQLStoriesCTAProps) {
  const [open, setOpen] = useState(false);

  const content = (
    <>
      <button
        onClick={() => {
          trackSqlStoriesModalOpen('sql_stories_cta');
          setOpen(true);
        }}
        className="group w-full text-left"
        aria-label="Open My SQL Stories case studies"
      >
        <FeatureCardShell
          className="transition-transform duration-300 ease-out group-hover:-translate-y-1"
          ambientClassName="bg-[radial-gradient(circle_at_top_left,rgba(114,197,255,0.1),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(73,138,196,0.1),transparent_32%)]"
          innerClassName="border border-[#274256]/28 bg-[linear-gradient(135deg,#09131b_0%,#102330_38%,#16384a_100%)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(114,197,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(73,138,196,0.16),transparent_35%)]" />
          <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-[#8bd7ff]/35 to-transparent" />
          <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-[#57b6ea]/12 blur-3xl" />
          <div className="absolute bottom-6 right-6 hidden w-64 rounded-[1.6rem] border border-[#9ad8ff]/12 bg-[#c8efff]/6 p-4 backdrop-blur-sm lg:block">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#9cd9ff]/58">
              <span>Signals</span>
              <Activity size={14} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: 'Returns', value: '10.6M' },
                { label: 'SKUs', value: '562' },
                { label: 'Drop', value: '11pt' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#9ad8ff]/10 bg-[#d4f1ff]/7 p-3">
                  <div className="text-[9px] uppercase tracking-[0.25em] text-[#93d6ff]/52">
                    {item.label}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-[#edf9ff]">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-20 overflow-hidden rounded-2xl border border-[#9ad8ff]/10 bg-[#09131b]/60 px-3 py-2">
              <div className="flex h-full items-end gap-2">
                {[42, 68, 56, 90, 74, 83, 62, 96].map((height) => (
                  <div
                    key={height}
                    className="flex-1 rounded-t-full bg-[linear-gradient(180deg,#8fdbff_0%,#3f7da4_100%)] opacity-90"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="relative flex min-h-[calc(26rem-1.5rem)] items-center px-6 py-8 md:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#95d7ff]/18 bg-[#d1efff]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9cd9ff]">
                <BarChart3 size={14} />
                Analytics Lab
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src="/img/logos/transparent_logo_centered.svg"
                    alt=""
                    className="h-18 w-18 object-contain opacity-26 transition-opacity group-hover:opacity-42 sm:h-20 sm:w-20"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9cd9ff]/22 bg-[#d0efff]/10 transition-all group-hover:bg-[#d0efff]/18 group-hover:shadow-[0_0_20px_rgba(114,197,255,0.28)]">
                      <Play size={18} className="ml-0.5 text-[#9cd9ff]" />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-semibold tracking-tight text-[#edf9ff] md:text-5xl">
                    My SQL Stories
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[#d7ebf5]/74 md:text-lg">
                    Follow our simulated ecommerce company, QuickKart&apos;s data story over the
                    course of a year of operations, with three featured case studies covering
                    inventory risk, retention cohorts, and sales diagnostics.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.28em] text-[#8fcff4]">
                {['Signals', 'Cohorts', 'SKUs', 'Diagnostics', 'Decisioning'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#95d7ff]/16 bg-[#d1efff]/7 px-3 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-block text-base font-medium text-[#9cd9ff] transition-colors group-hover:text-[#b2e2ff]">
                Enter the Analytics Lab &rarr;
              </span>
            </div>
          </div>
        </FeatureCardShell>
      </button>

      <SQLStoriesModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );

  if (embedded) return content;

  return (
    <Section id="sql-stories" glow glowVariant="accent">
      {content}
    </Section>
  );
}
