import { howItWorks } from '../../data/sections';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import StepCard from './StepCard';
import Button from '../shared/Button';
import { FadeInStagger, FadeInStaggerItem } from '../shared/FadeIn';

export default function HowItWorksSection() {
  return (
    <Section id="how-it-works">
      <SectionTitle>How It Works</SectionTitle>
      <p className="mb-6 max-w-2xl text-muted">
        A straightforward process designed to respect your time and budget.
      </p>

      <FadeInStagger className="relative grid gap-5 sm:grid-cols-3">
        {/* Connector line (desktop only) */}
        <div
          className="
            pointer-events-none absolute left-0 right-0 top-[54px]
            hidden h-px sm:block
          "
          style={{
            background: 'linear-gradient(90deg, transparent, #6699cc, transparent)',
          }}
        />

        {howItWorks.map((step) => (
          <FadeInStaggerItem key={step.number}>
            <StepCard {...step} />
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>

      <div className="mt-8 text-center">
        <Button
          variant="primary"
          href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
          external
        >
          Book a Free Discovery Call
        </Button>
      </div>
    </Section>
  );
}
