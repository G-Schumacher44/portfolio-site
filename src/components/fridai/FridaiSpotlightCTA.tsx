import { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../layout/Section';
import GlassPanel from '../shared/GlassPanel';
import DocumentViewer from '../shared/DocumentViewer';

export default function FridaiSpotlightCTA() {
  const [deckOpen, setDeckOpen] = useState(false);

  return (
    <Section id="fridai-spotlight" glow glowVariant="accent">
      <GlassPanel className="relative overflow-hidden">
        {/* Radial glow accent */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(102,153,204,0.12),_transparent_60%)]" />

        <div className="relative flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand/70">
                Flagship Project
              </span>
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-amber-300">
                Dev Preview · Mar 2026
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-semibold text-brand sm:text-3xl">
              FridAI Core
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted/80">
              An open-source platform for governed AI execution. Point any MCP-compatible AI at
              the hub — it routes tools, enforces approval gates, runs workloads in Docker
              sandboxes, and stores results in vector memory. One system, zero rogue agents.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {['MCP', 'FastMCP', 'FastAPI', 'Docker', 'Pinecone', 'Python'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-surface/60 px-2.5 py-0.5 text-[10px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setDeckOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition-all hover:border-brand/80 hover:bg-brand/20"
            >
              View Project Overview →
            </button>
            <Link
              to="/technical-showcase"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 text-xs font-medium text-muted transition-all hover:border-muted/40 hover:text-text"
            >
              Full Technical Showcase
            </Link>
          </div>
        </div>
      </GlassPanel>

      <DocumentViewer
        isOpen={deckOpen}
        onClose={() => setDeckOpen(false)}
        src="/files/modals/fridai-overview.html"
        title="FridAI Core — Project Overview"
      />
    </Section>
  );
}
