import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';

// Background & Navigation
import { Surround3DBackground } from './components/3d/Surround3DBackground';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ToastNotification } from './components/common/ToastNotification';

// Home Sections
import { HeroSection } from './components/home/HeroSection';
import { ClientAttractSection } from './components/home/ClientAttractSection';
import { ServicesSection } from './components/home/ServicesSection';
import { ProjectsSection } from './components/home/ProjectsSection';
import { AboutSection } from './components/home/AboutSection';
import { DigitalGrowthSection } from './components/home/DigitalGrowthSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { ContactSection } from './components/home/ContactSection';
import { NewsletterSection } from './components/home/NewsletterSection';

// Sub-pages
import { AuthPage } from './components/auth/AuthPage';
import { BlogView } from './components/blog/BlogView';

// Modals
import { GoogleSignInModal } from './components/modals/GoogleSignInModal';
import { ProjectManageModal } from './components/modals/ProjectManageModal';
import { OwnerSettingsModal } from './components/modals/OwnerSettingsModal';
import { ConsultationBookingModal } from './components/modals/ConsultationBookingModal';
import { ServiceDetailModal } from './components/modals/ServiceDetailModal';
import { ServiceItem, ProjectItem } from './types';

const MainAppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'blog'>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isOwnerSettingsModalOpen, setIsOwnerSettingsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleBookConsultationWithService = (serviceTitle: string) => {
    setSelectedService(null);
    setIsBookingModalOpen(true);
  };

  const handleSelectProjectForInquiry = (project: ProjectItem) => {
    // Scroll directly to contact section or open booking modal
    const contactEl = document.querySelector('#contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Dynamic 3D Geometric Space Canvas */}
      <Surround3DBackground />

      {/* Clean Top Bar Navigation (No left sidebar, clean top menu only) */}
      <Navbar
        currentView={currentView}
        setCurrentView={(v) => setCurrentView(v as any)}
        openBookingModal={() => setIsBookingModalOpen(true)}
        openAddProjectModal={() => setIsAddProjectModalOpen(true)}
        openOwnerSettingsModal={() => setIsOwnerSettingsModalOpen(true)}
      />

      {/* View Routing */}
      {currentView === 'home' && (
        <main className="relative z-10">
          <HeroSection
            onStartProject={() => {
              const el = document.querySelector('#contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreServices={() => {
              const el = document.querySelector('#services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onBookConsultation={() => setIsBookingModalOpen(true)}
          />

          <ClientAttractSection 
            onSelectPillar={(pillar) => {
              const el = document.querySelector('#services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} 
          />

          <ServicesSection
            onSelectService={(service) => setSelectedService(service)}
          />

          {/* Featured Projects with in-place Owner Add, Edit & Delete */}
          <ProjectsSection
            onSelectProjectForInquiry={handleSelectProjectForInquiry}
            openOwnerSettingsModal={() => setIsOwnerSettingsModalOpen(true)}
          />

          <AboutSection />

          <DigitalGrowthSection />

          <TestimonialsSection />

          <ContactSection
            onOpenConsultationModal={() => setIsBookingModalOpen(true)}
            onNavigateToAuth={() => setCurrentView('auth')}
          />

          <NewsletterSection />
        </main>
      )}

      {currentView === 'auth' && (
        <AuthPage
          onBackToHome={() => setCurrentView('home')}
          onSuccessRedirect={() => {
            setCurrentView('home');
            setTimeout(() => {
              const el = document.querySelector('#projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      )}

      {currentView === 'blog' && (
        <BlogView onBackToHome={() => setCurrentView('home')} />
      )}

      {/* Global Footer */}
      <Footer
        setCurrentView={(v) => setCurrentView(v as any)}
        openBookingModal={() => setIsBookingModalOpen(true)}
      />

      {/* Floating WhatsApp Action Pill */}
      <FloatingWhatsApp />

      {/* Global Real-time Toast Notifications */}
      <ToastNotification />

      {/* Resilient Google Sign-In Selector Modal */}
      <GoogleSignInModal />

      {/* Owner Project Add/Edit Modal */}
      <ProjectManageModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />

      {/* Owner Settings Modal */}
      <OwnerSettingsModal
        isOpen={isOwnerSettingsModalOpen}
        onClose={() => setIsOwnerSettingsModalOpen(false)}
      />

      {/* Consultation Booking Modal */}
      <ConsultationBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onNavigateToAuth={() => setCurrentView('auth')}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookConsultation={handleBookConsultationWithService}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <MainAppContent />
      </ProjectsProvider>
    </AuthProvider>
  );
}
