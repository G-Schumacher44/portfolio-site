import Hero from '../components/hero/Hero';
import Navbar from '../components/layout/Navbar';
import SQLStoriesCTA from '../components/sql-stories/SQLStoriesCTA';
import TechnicalShowcaseCTA from '../components/technical-showcase/TechnicalShowcaseCTA';
import ServicesSection from '../components/services/ServicesSection';
import ContactSection from '../components/contact/ContactSection';

export default function MainPage() {
  return (
    <>
      <Hero />
      <Navbar />
      <main>
        <SQLStoriesCTA />
        <TechnicalShowcaseCTA />
        <ServicesSection />
        <ContactSection />
      </main>
    </>
  );
}
