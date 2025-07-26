import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import DarkModeToggle from './components/DarkModeToggle';
import Hero from './components/Hero';
import Services from './components/Services';
import BusinessGrowth from './components/BusinessGrowth';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

// Main page component that handles scrolling based on URL
const MainPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top first
    window.scrollTo(0, 0);
    
    // Then scroll to specific section based on path
    const scrollToSection = () => {
      let sectionId = '';
      
      switch (location.pathname) {
        case '/':
          sectionId = 'home';
          break;
        case '/services':
          sectionId = 'services';
          break;
        case '/contact':
          sectionId = 'contact';
          break;
        default:
          sectionId = 'home';
      }

      if (sectionId) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      }
    };

    scrollToSection();
  }, [location.pathname]);

  // Determine which components to show based on route
  const isHomePage = location.pathname === '/';
  const isServicesPage = location.pathname === '/services';
  const isContactPage = location.pathname === '/contact';
  return (
    <>
      <Helmet>
        <title>
          {isServicesPage 
            ? "Our Services - The Dynamic Rankers | Digital Marketing & Web Development"
            : isContactPage 
            ? "Contact Us - The Dynamic Rankers | Get Your Free Consultation"
            : "The Dynamic Rankers - Digital Marketing & Web Development"
          }
        </title>
        <meta name="description" content={
          isServicesPage 
            ? "Comprehensive digital marketing services including website development, SEO, SEM, social media marketing, and customer support. Get higher rankings and more traffic."
            : isContactPage 
            ? "Ready to grow your business? Contact The Dynamic Rankers for a free consultation. Call +1 (346) 556-1173 or email eric@thedynamicrankers.com"
            : "Professional digital marketing and SEO services to boost your online presence. Get higher rankings and more traffic with The Dynamic Rankers."
        } />
      </Helmet>
      
      {/* Show Hero only on homepage */}
      {isHomePage && <Hero />}
      
      {/* Show Services page header for services route */}
      {isServicesPage && (
        <section className="pt-20 pb-8 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Our Premium Services
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive digital solutions to help your business thrive in the competitive online landscape
            </p>
          </div>
        </section>
      )}
      
      {/* Show Contact page header for contact route */}
      {isContactPage && (
        <section className="pt-20 pb-8 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Ready to take your business to the next level? Contact us today for a free consultation
            </p>
          </div>
        </section>
      )}
      
      <Services />
      {isHomePage && <BusinessGrowth />}
      <Contact />
    </>
  );
};

// Hook to detect desktop screen size
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isDesktop;
};
function App() {
  const isDesktop = useIsDesktop();

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <DarkModeToggle />
        
        <Routes>
          <Route path="/" element={<MainPage />} />
          {isDesktop ? (
            <>
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </>
          ) : (
            <>
              <Route path="/services" element={<MainPage />} />
              <Route path="/contact" element={<MainPage />} />
            </>
          )}
        </Routes>
        
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;