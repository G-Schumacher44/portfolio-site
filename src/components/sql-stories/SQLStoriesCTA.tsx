import { useState } from 'react';
import { Play } from 'lucide-react';
import Section from '../layout/Section';
import GlassPanel from '../shared/GlassPanel';
import SQLStoriesModal from './SQLStoriesModal';

export default function SQLStoriesCTA() {
  const [open, setOpen] = useState(false);

  return (
    <Section id="sql-stories" glow glowVariant="accent">
      <button onClick={() => setOpen(true)} className="group w-full text-left">
        <GlassPanel hover className="flex items-center gap-5 sm:gap-8">
          {/* Logo accent */}
          <div className="relative flex-shrink-0">
            <img
              src="/img/logos/transparent_logo_centered.svg"
              alt=""
              className="h-20 w-20 object-contain opacity-40 transition-opacity group-hover:opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 transition-all group-hover:bg-brand/30 group-hover:shadow-[0_0_20px_rgba(102,153,204,0.3)]">
                <Play size={18} className="ml-0.5 text-brand" />
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-brand sm:text-2xl">My SQL Stories</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              From raw data to executive insight — trace 194K rows through a complete
              analytics pipeline. Five stages, live metrics, three case studies.
            </p>
            <span className="mt-2 inline-block text-xs font-medium text-brand/60 transition-colors group-hover:text-brand">
              Launch the journey &rarr;
            </span>
          </div>
        </GlassPanel>
      </button>

      <SQLStoriesModal isOpen={open} onClose={() => setOpen(false)} />
    </Section>
  );
}
