import { projects } from '../../data/projects';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import ProjectCard from './ProjectCard';
import { FadeInStagger, FadeInStaggerItem } from '../shared/FadeIn';

export default function ProjectsSection() {
  return (
    <Section id="projects" glow>
      <SectionTitle>Tools & Frameworks</SectionTitle>
      <p className="mb-6 max-w-2xl text-muted">
        Open-source solutions I've built to streamline analytics work — from data generation to pipeline automation to model evaluation.
      </p>

      <FadeInStagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <FadeInStaggerItem key={project.title}>
            <ProjectCard project={project} />
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>
    </Section>
  );
}
