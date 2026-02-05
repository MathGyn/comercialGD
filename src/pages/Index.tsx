import { useRef, useState, useEffect } from 'react';

import HeroSection from '@/components/landing/HeroSection';
import FloatingNav from '@/components/landing/FloatingNav';
import FloatingWhatsApp from '@/components/landing/FloatingWhatsApp';
import ProjectCarousel from '@/components/landing/ProjectCarousel';
import LinksSection from '@/components/landing/LinksSection';
import CustomerServiceSection from '@/components/landing/CustomerServiceSection';
import MapSection from '@/components/landing/MapSection';
import TeamSection from '@/components/landing/TeamSection';
import ContactAccordion from '@/components/landing/ContactAccordion';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const [showNav, setShowNav] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero (100svh)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setShowNav(scrollY > heroHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      projects: projectsRef,
      links: linksRef,
      team: teamRef,
      locations: locationsRef,
      contacts: contactsRef,
    };

    const ref = refs[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Floating Navigation - appears after scrolling past hero */}
      <FloatingNav isVisible={showNav} onNavigate={handleNavigate} />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Hero */}
      <div ref={heroRef}>
        <HeroSection />
      </div>

      {/* Links Section - Agora inclui Drive Geral e Links Úteis */}
      <div ref={linksRef}>
        <LinksSection />
      </div>

      {/* Projects Carousel */}
      <div ref={projectsRef}>
        <ProjectCarousel />
      </div>

      {/* Team Section */}
      <div ref={teamRef}>
        <TeamSection />
      </div>

      {/* Map & Locations */}
      <div ref={locationsRef}>
        <MapSection />
      </div>

      {/* Customer Service Section */}
      <CustomerServiceSection />

      {/* Contacts Accordion */}
      <div ref={contactsRef}>
        <ContactAccordion />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
