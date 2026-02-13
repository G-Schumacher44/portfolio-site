import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { technicalProjects } from '../data/technicalProjects';
import TechnicalProjectModal from '../components/technical-showcase/TechnicalProjectModal';

export default function TechnicalShowcasePage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const activeProject = technicalProjects.find((item) => item.slug === activeSlug) ?? null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f3e6cf] text-[#2b2a27]">
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage:
              "url('/img/backgrounds/comic_newspaper_bg.jpg'), radial-gradient(circle at top, rgba(255,255,255,0.95), transparent 60%)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply',
            backgroundColor: '#f3e6cf',
          }}
        />
        <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
          <img
            src="/img/logos/transparent_logo_centered.svg"
            alt=""
            className="h-[540px] w-[540px] object-contain opacity-20"
          />
        </div>
        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-10">
          <div className="rounded-3xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-6 shadow-[8px_8px_0_#2b2a27]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[12px] uppercase tracking-[0.4em]">
                  Sunday Funnies
                </div>
                <h1 className="mt-2 text-4xl font-black">
                  The Technical Showcase
                </h1>
                <p className="mt-2 max-w-2xl text-sm">
                  Real projects, comic format. Each strip is a working system — click any panel to
                  see the architecture, artifacts, and engineering decisions behind it.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[#2b2a27] bg-white px-4 py-2 text-xs">
                Issue No. 01 · “Data is weird” edition
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {technicalProjects.map((project) => (
              <button
                key={project.slug}
                onClick={() => setActiveSlug(project.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border-[3px] border-[#2b2a27] bg-white text-left shadow-[6px_6px_0_#2b2a27] transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between border-b-[3px] border-[#2b2a27] bg-[#fff3d6] px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">{project.title}</span>
                  {project.slug === 'fridai-core' && (
                    <span className="rounded-full border-2 border-[#2b2a27] bg-[#2b2a27] px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#fff7e6]">
                      Dev Preview
                    </span>
                  )}
                </div>
                <div className="relative border-b-[3px] border-[#2b2a27] bg-[#fff7e6] p-4">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    className="h-64 w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-sm font-semibold">{project.subtitle}</p>
                  <p className="text-xs text-[#2b2a27]">{project.summary}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-[#2b2a27]">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#2b2a27] bg-[#fff0c2] px-2 py-1 text-[#2b2a27]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="rounded-2xl border-2 border-[#2b2a27] bg-[#f6f1e7] px-3 py-2 text-[11px]">
                    {project.callout}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {/* Contact strip */}
          <div id="showcase-contact" className="mt-10 rounded-3xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-6 shadow-[6px_6px_0_#2b2a27]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]/60">Let's Talk</div>
                <p className="mt-1 text-sm font-semibold text-[#2b2a27]">Open to full-time, contract, and freelance roles.</p>
                <p className="mt-0.5 text-xs text-[#2b2a27]/70">Want to dig into the architecture or discuss a project? Reach out.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ borderColor: '#2b2a27', backgroundColor: '#2b2a27', color: '#fff7e6' }}
                  className="inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
                >
                  Book a Call
                </a>
                <a
                  href="mailto:garrettschumacher44@gmail.com"
                  style={{ borderColor: '#2b2a27', color: '#2b2a27', backgroundColor: '#fff7e6' }}
                  className="inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-70"
                >
                  Email Me
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <TechnicalProjectModal
        project={activeProject}
        onClose={() => setActiveSlug(null)}
      />
    </>
  );
}
