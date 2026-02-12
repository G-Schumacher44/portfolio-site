import { services } from '../../data/services';
import { howItWorks } from '../../data/sections';
import Section from '../layout/Section';
import ServiceCard from './ServiceCard';
import Button from '../shared/Button';
import { FadeInStagger, FadeInStaggerItem } from '../shared/FadeIn';

export default function ServicesSection() {
  return (
    <Section id="services" glow>
      {/* Services grid — what I offer, first */}
      <div className="mb-4">
        <h2 className="mb-2 text-2xl font-bold text-text">What I Offer</h2>
        <p className="mb-8 max-w-2xl text-muted">
          From one-time analysis to ongoing analytics infrastructure — click any card to see what's included.
        </p>
      </div>

      <FadeInStagger className="mb-20 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <FadeInStaggerItem key={service.title}>
            <ServiceCard service={service} />
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>

      {/* How It Works — process steps after */}
      <div className="relative">
        <h2 className="mb-8 text-2xl font-bold text-text">How It Works</h2>
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

          {howItWorks.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
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
              <h3 className="mb-2 text-base font-semibold text-text">{step.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
            external
          >
            Book a Free Discovery Call
          </Button>
          <Button
            variant="ghost"
            href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
            external
            className="border border-line/50 hover:border-line"
          >
            Schedule an Interview
          </Button>
        </div>
      </div>
    </Section>
  );
}
