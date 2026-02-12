import { useState } from 'react';
import { about } from '../../data/sections';
import Section from '../layout/Section';
import GlassPanel from '../shared/GlassPanel';
import DocumentViewer from '../shared/DocumentViewer';
import SectionTitle from '../shared/SectionTitle';

export default function AboutSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Section id="about" glow>
      <SectionTitle>About</SectionTitle>
      <GlassPanel className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <button
          onClick={() => setModalOpen(true)}
          className="group flex-shrink-0 text-center"
        >
          <img
            src={about.photo}
            alt={about.photoAlt}
            width={120}
            height={120}
            className="
              mx-auto rounded-full border-2 border-brand/20
              transition-all duration-500
              group-hover:border-brand/50 group-hover:shadow-[0_0_24px_rgba(102,153,204,0.2)]
            "
            style={{ animation: 'float 4s ease-in-out infinite' }}
            loading="lazy"
          />
          <span className="mt-2 block text-xs text-muted transition-colors group-hover:text-brand">
            Read full bio
          </span>
        </button>

        <div>
          <p className="text-base leading-relaxed text-text">{about.bio}</p>
          <p className="mt-3 text-sm text-muted">{about.availability}</p>
        </div>
      </GlassPanel>

      <DocumentViewer
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="About Me"
        src={about.modalSrc}
      />
    </Section>
  );
}
