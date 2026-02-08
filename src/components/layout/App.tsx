import MicroBanner from './MicroBanner';
import Navbar from './Navbar';
import Hero from '../hero/Hero';
import TerminalAnimation from '../hero/TerminalAnimation';
import StatsBar from '../stats/StatsBar';
import SQLStoriesCTA from '../sql-stories/SQLStoriesCTA';
import ServicesSection from '../services/ServicesSection';
import HowItWorksSection from '../how-it-works/HowItWorksSection';
import ProjectsSection from '../projects/ProjectsSection';
import ResourceHubSection from '../resource-hub/ResourceHubSection';
import SkillsSection from '../skills/SkillsSection';
import ContactSection from '../contact/ContactSection';
import Footer from './Footer';

export default function App() {
  return (
    <>
      {/* Fixed background layers — persist as user scrolls */}
      <TerminalAnimation />
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <img
          src="/img/logos/transparent_logo_centered.svg"
          alt=""
          className="h-[600px] w-[600px] object-contain opacity-35"
        />
      </div>

      <MicroBanner />
      <Hero />
      <Navbar />
      <main>
        <StatsBar />
        <SQLStoriesCTA />
        <ServicesSection />
        <HowItWorksSection />
        <ProjectsSection />
        <ResourceHubSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
