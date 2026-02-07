import MicroBanner from './MicroBanner';
import Navbar from './Navbar';
import Hero from '../hero/Hero';
import StatsBar from '../stats/StatsBar';
import AboutSection from '../about/AboutSection';
import ServicesSection from '../services/ServicesSection';
import CaseStudiesSection from '../case-studies/CaseStudiesSection';
import HowItWorksSection from '../how-it-works/HowItWorksSection';
import PipelineJourney from '../pipeline-journey/PipelineJourney';
import ProjectsSection from '../projects/ProjectsSection';
import ResourceHubSection from '../resource-hub/ResourceHubSection';
import SkillsSection from '../skills/SkillsSection';
import ContactSection from '../contact/ContactSection';
import Footer from './Footer';

export default function App() {
  return (
    <>
      <MicroBanner />
      <Hero />
      <Navbar />
      <main>
        <StatsBar />
        <AboutSection />
        <ServicesSection />
        <CaseStudiesSection />
        <HowItWorksSection />
        <PipelineJourney />
        <ProjectsSection />
        <ResourceHubSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
