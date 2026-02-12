import { useState } from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { resourceHub } from '../../data/sections';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import GlassPanel from '../shared/GlassPanel';
import DocumentViewer from '../shared/DocumentViewer';

export default function ResourceHubSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Section id="resource-hub">
      <SectionTitle>Analyst Resource Hub</SectionTitle>
      <GlassPanel className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <button
          onClick={() => setModalOpen(true)}
          className="group flex-shrink-0"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/10 transition-all duration-300 group-hover:bg-brand/20 group-hover:shadow-[0_0_20px_rgba(102,153,204,0.15)]">
            <BookOpen size={32} className="text-brand" />
          </div>
        </button>

        <div>
          <p className="text-sm leading-relaxed text-muted">{resourceHub.description}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {resourceHub.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-text"
              >
                {link.label}
                <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </GlassPanel>

      <DocumentViewer
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Analyst Resource Hub"
        src={resourceHub.modalSrc}
      />
    </Section>
  );
}
