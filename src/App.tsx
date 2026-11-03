import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Generated High-Fidelity Realistic Automotive Assets
import heroCarImg from './assets/images/hero_car_studio_1793689339443.jpg';
import workshopBayImg from './assets/images/workshop_clean_bay_1793689340496.jpg';
import serviceMaintenanceImg from './assets/images/service_maintenance_1793689340307.jpg';
import serviceRepairImg from './assets/images/service_brake_repair_1793689341288.jpg';
import usedCarShowroomImg from './assets/images/used_car_showroom_1793689342029.jpg';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  // Track active section for top bar indicator
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'services', 'used-cars', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnquireUsedCar = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Sticky Header */}
      <Navbar activeSection={activeSection} />

      <main className="flex-1">
        {/* Section 2: Hero with Cinematic 3D Vehicle Entrance */}
        <HeroSection heroCarSrc={heroCarImg} />

        {/* Section 4: About Us — Interactive 3D Section */}
        <AboutSection
          workshopImgSrc={workshopBayImg}
          maintenanceImgSrc={serviceMaintenanceImg}
          showroomImgSrc={usedCarShowroomImg}
        />

        {/* Section 5: Services — 3D Animated Tilt Cards */}
        <ServicesSection
          maintenanceImg={serviceMaintenanceImg}
          repairImg={serviceRepairImg}
          salesImg={usedCarShowroomImg}
        />

        {/* Section 6: Used Cars — Premium Automotive Showcase */}
        <ShowcaseSection
          showcaseImg={usedCarShowroomImg}
          onEnquire={handleEnquireUsedCar}
        />

        {/* Section 7: Why Choose Us — Animated 3D Automotive Experience */}
        <WhyChooseUsSection />

        {/* Section 8: Contact Section — 3D Workshop Environment */}
        <ContactSection workshopImg={workshopBayImg} />
      </main>

      {/* Section 10: Footer */}
      <Footer />

      {/* Mobile Floating Quick Call Button */}
      <a
        href="tel:+447735508394"
        aria-label="Call MMR MOTORS LTD"
        className="fixed bottom-5 right-5 sm:hidden z-40 w-13 h-13 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 transition-transform active:scale-95"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
}
