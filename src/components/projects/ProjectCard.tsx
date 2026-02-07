import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { ProjectData } from '../../types';
import GlassPanel from '../shared/GlassPanel';
import Modal from '../shared/Modal';

interface ProjectCardProps {
  project: ProjectData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <GlassPanel as="article" hover>
        <button
          onClick={() => setModalOpen(true)}
          className="group relative mb-4 block w-full overflow-hidden rounded-xl"
        >
          <img
            src={project.image}
            alt={project.imageAlt}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </button>

        <h3 className="mb-2 text-lg font-semibold text-brand">{project.title}</h3>
        <p className="mb-3 text-sm leading-relaxed text-muted">{project.description}</p>
        <p className="mb-3 text-xs text-muted/60">{project.techStack}</p>

        <div className="flex flex-wrap gap-3 border-t border-line/50 pt-3">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-text"
            >
              {link.label}
              {link.external && <ExternalLink size={12} />}
            </a>
          ))}
        </div>
      </GlassPanel>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={project.title}
        src={project.modalSrc}
      />
    </>
  );
}
