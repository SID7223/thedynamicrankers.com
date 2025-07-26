import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import DarkModeToggle from './components/DarkModeToggle';
import Hero from './components/Hero';
import BusinessGrowth from './components/BusinessGrowth';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import DigitalMarketingPage from './pages/DigitalMarketingPage';
import AISolutionsPage from './pages/AISolutionsPage';
import CreateWebsitePage from './pages/CreateWebsitePage';
import ContentCreationPage from './pages/ContentCreationPage';

// Import sub-pages
import DigitalMarketingSolution from './pages/digital-marketing/DigitalMarketingSolution';
import ScopeOfDigitalMarketing from './pages/digital-marketing/ScopeOfDigitalMarketing';

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
  return (
    <>
      <Helmet>
        <title>
          The Dynamic Rankers - Digital Marketing & Web Development
        </title>
        <meta name="description" content="Professional digital marketing and SEO services to boost your online presence. Get higher rankings and more traffic with The Dynamic Rankers." />
      </Helmet>
      
      {/* Show Hero only on homepage */}
      {isHomePage && <Hero />}
      
      {/* Only show BusinessGrowth and Contact on homepage */}
      {isHomePage && <BusinessGrowth />}
      {isHomePage && <Contact />}
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
          
          {/* Digital Marketing Routes */}
          <Route path="/digital-marketing" element={<DigitalMarketingPage />}>
            <Route path="digital-marketing-solution" element={<DigitalMarketingSolution />} />
            <Route path="scope-of-digital-marketing" element={<ScopeOfDigitalMarketing />} />
          </Route>
          
          {/* AI Solutions Routes */}
          <Route path="/ai-solutions" element={<AISolutionsPage />} />
          
          {/* Create Website Routes */}
          <Route path="/create-website" element={<CreateWebsitePage />} />
          
          {/* Content Creation Routes */}
          <Route path="/content-creation" element={<ContentCreationPage />} />
        </Routes>
        
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;