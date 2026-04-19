import Hero from '../components/hero/Hero';
import Navbar from '../components/layout/Navbar';
import FeaturedStoriesSurface from '../components/home/FeaturedStoriesSurface';
import ServicesSection from '../components/services/ServicesSection';
import ContactSection from '../components/contact/ContactSection';

export default function MainPage() {
  return (
    <>
      <Hero />
      <Navbar />
      <main>
        <FeaturedStoriesSurface />
        <ServicesSection />
        <ContactSection />
      </main>
    </>
  );
}
