import { contactCards } from '../../data/sections';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import GlassPanel from '../shared/GlassPanel';
import Button from '../shared/Button';
import { FadeInStagger, FadeInStaggerItem } from '../shared/FadeIn';

export default function ContactSection() {
  return (
    <Section id="contact" glow glowVariant="accent">
      <SectionTitle>Let's Work Together</SectionTitle>
      <p className="mb-6 max-w-2xl text-muted">
        Whether you're building a data team or need analytics expertise on a project
        basis, I'd like to hear from you.
      </p>

      <FadeInStagger className="grid gap-5 sm:grid-cols-2">
        {contactCards.map((card) => (
          <FadeInStaggerItem key={card.title}>
            <GlassPanel>
              <h3 className="mb-2 text-lg font-semibold text-brand">{card.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                {card.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {card.ctas.map((cta) => (
                  <Button
                    key={cta.label}
                    variant={cta.primary ? 'primary' : 'secondary'}
                    href={cta.href}
                    external={cta.external}
                  >
                    {cta.label}
                  </Button>
                ))}
              </div>
            </GlassPanel>
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>
    </Section>
  );
}
