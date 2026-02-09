import { services } from '../../data/services';
import { howItWorks } from '../../data/sections';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import ServiceCard from './ServiceCard';
import GlassPanel from '../shared/GlassPanel';
import Button from '../shared/Button';
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

      {/* How It Works — merged, smaller, with animated connection line */}
      <div className="relative mt-20">
        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Animated SVG connector line */}
          <svg
            className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px sm:block"
            style={{ width: '100%', height: '2px' }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#6699cc" stopOpacity="0.6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="8 4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="24"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
          </svg>

          {howItWorks.map((step, idx) => (
            <FadeInStaggerItem key={step.number}>
              <div className="relative flex flex-col items-center text-center">
                {/* Step number badge */}
                <div
                  className="
                    relative z-10 mb-3 flex h-11 w-11 items-center justify-center
                    rounded-full border border-brand/30 bg-card
                    text-sm font-bold text-brand shadow-lg
                  "
                  style={{ animation: 'pulse-soft 3s ease-in-out infinite' }}
                >
                  {step.number}
                </div>

                {/* Step content */}
                <h3 className="mb-2 text-base font-semibold text-text">{step.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </FadeInStaggerItem>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="primary"
            href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
            external
          >
            Book a Free Discovery Call
          </Button>
        </div>
      </div>
    </Section>
  );
}
