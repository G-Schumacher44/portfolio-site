import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import FeatureCardShell from '../shared/FeatureCardShell';
import { trackGardenBookOpen, trackGardenBookOutbound } from '../../utils/analytics';

interface GardenBookHomepageCTAProps {
  embedded?: boolean;
}

export default function GardenBookHomepageCTA({
  embedded = false,
}: GardenBookHomepageCTAProps) {
  const content = (
      <FeatureCardShell
        ambientClassName="bg-[radial-gradient(circle_at_top_left,rgba(212,232,188,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(44,91,58,0.12),transparent_34%)]"
        innerClassName="border border-[#294d34]/35 bg-[linear-gradient(135deg,#183524_0%,#21412c_50%,#dbe3c1_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(235,245,220,0.24),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(22,48,30,0.18),transparent_40%)]" />
        <div className="relative grid min-h-[calc(26rem-1.5rem)] gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="max-w-2xl self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7dfbe]/35 bg-[#edf3d7]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#eef5df]">
              <Sprout size={14} />
              Live on the App Store
            </div>
            <div className="mt-4 flex items-center gap-3">
              <h2 className="max-w-xl font-serif text-4xl font-semibold tracking-tight text-[#f6f7ee] md:text-5xl">
                GardenBook
              </h2>
              <img
                src="/gardenbook/current/gardenbook-icon-cream-transparent.png"
                alt=""
                className="h-9 w-9 object-contain opacity-92 md:h-11 md:w-11"
                loading="lazy"
              />
            </div>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#f0f4e4]/82 md:text-lg">
              A local-first garden planning app with a structured catalog pipeline underneath it.
              Product story up front. Data-engineering depth once you open the cover.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/gardenbook"
                onClick={() => trackGardenBookOpen('homepage_cta_primary')}
                className="inline-flex items-center gap-2 rounded-full bg-[#edf3d7] px-5 py-3 text-sm font-semibold text-[#173321] transition-transform hover:-translate-y-0.5"
              >
                Read the GardenBook story
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://apps.apple.com/us/app/gardenbook/id6762165125"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGardenBookOutbound('homepage_cta_app_store')}
                className="inline-flex items-center gap-2 rounded-full border border-[#e7efd3]/35 bg-[#edf3d7]/10 px-5 py-3 text-sm font-semibold text-[#f6f7ee] transition-colors hover:bg-[#edf3d7]/16"
              >
                Open on the App Store
                <ExternalLink size={16} />
              </a>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#eef4de]/76">
              <a
                href="https://gardenbook.app/support"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGardenBookOutbound('homepage_cta_support')}
                className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
              >
                Support
              </a>
              <a
                href="https://gardenbook.app/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGardenBookOutbound('homepage_cta_privacy')}
                className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
              >
                Privacy
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mx-auto flex w-full max-w-lg items-end justify-center"
          >
            <div className="relative w-full max-w-[30rem]">
              <div className="absolute inset-x-[10%] top-10 h-56 rounded-[2.4rem] bg-[#10251a]/40 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[#2a5037] bg-[linear-gradient(180deg,#294f36_0%,#1a3524_100%)] shadow-[0_20px_60px_rgba(7,12,9,0.42)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,243,233,0.1),transparent_44%)]" />
                <div className="relative min-h-[22rem] px-5 py-5">
                  <div className="relative mx-auto w-full max-w-[25rem]">
                    <div className="absolute inset-x-[14%] bottom-3 h-20 rounded-full bg-[#08130b]/34 blur-2xl" />
                    <img
                      src="/gardenbook/gardenbook_screens/base_screens/ipad-design-layout.png"
                      alt="GardenBook iPad design screen"
                      className="relative z-10 w-full rounded-[1.7rem] border border-[#d9e2c4]/12 object-cover shadow-[0_18px_35px_rgba(5,10,7,0.22)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </FeatureCardShell>
  );

  if (embedded) return content;

  return (
    <Section id="gardenbook-cta" className="py-12 md:py-18">
      {content}
    </Section>
  );
}
