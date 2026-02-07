import { services, servicesHighlight } from '../../data/services';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import ServiceCard from './ServiceCard';
import GlassPanel from '../shared/GlassPanel';
import { FadeInStagger, FadeInStaggerItem } from '../shared/FadeIn';

export default function ServicesSection() {
  return (
    <Section id="services" glow>
      <SectionTitle>Services</SectionTitle>
      <p className="mb-6 max-w-2xl text-muted">
        I help businesses make better decisions with their data. Whether you need a
        one-time analysis or an ongoing analytics partner, I deliver clear results on a
        practical timeline.
      </p>

      <FadeInStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <FadeInStaggerItem key={service.title}>
            <ServiceCard service={service} />
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>

      <GlassPanel className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted">
        <strong className="text-brand">My background:</strong> {servicesHighlight}
      </GlassPanel>
    </Section>
  );
}
