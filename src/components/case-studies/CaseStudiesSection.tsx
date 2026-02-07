import { caseStudies } from '../../data/caseStudies';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import CaseStudyCard from './CaseStudyCard';
import { FadeInStagger, FadeInStaggerItem } from '../shared/FadeIn';

export default function CaseStudiesSection() {
  return (
    <Section id="case-studies" glow glowVariant="accent">
      <SectionTitle>Case Studies</SectionTitle>
      <p className="mb-6 max-w-2xl text-muted">
        Real business problems, real data, real results. Click any card to dive
        deeper.
      </p>

      <FadeInStagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((study) => (
          <FadeInStaggerItem key={study.title}>
            <CaseStudyCard study={study} />
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>
    </Section>
  );
}
