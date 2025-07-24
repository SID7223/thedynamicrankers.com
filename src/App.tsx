import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import DarkModeToggle from './components/DarkModeToggle';
import Hero from './components/Hero';
import Services from './components/Services';
import BusinessGrowth from './components/BusinessGrowth';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

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
        case '/about':
          sectionId = 'about';
          break;
        case '/testimonials':
          sectionId = 'testimonials';
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

  return (
    <>
      <Hero />
      <Services />
      <BusinessGrowth />
      <About />
      <Testimonials />
      <Contact />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <DarkModeToggle />
        
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/services" element={<MainPage />} />
          <Route path="/about" element={<MainPage />} />
          <Route path="/testimonials" element={<MainPage />} />
          <Route path="/contact" element={<MainPage />} />
        </Routes>
        
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;