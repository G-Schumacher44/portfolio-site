import Section from '../components/layout/Section';
import SectionTitle from '../components/shared/SectionTitle';
import Navbar from '../components/layout/Navbar';

export default function QuickViewPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section id="quick-view" glow glowVariant="primary">
          <SectionTitle>Quick View</SectionTitle>
          <p className="max-w-2xl text-muted">
            Fast 5-minute hiring manager scan. Scaffolding only for now.
          </p>
        </Section>
      </main>
    </>
  );
}
