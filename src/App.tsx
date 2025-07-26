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
import WhatIsDigitalMarketing from './pages/digital-marketing/WhatIsDigitalMarketing';
import DigitalGrowthImpact from './pages/digital-marketing/DigitalGrowthImpact';

// AI Solutions sub-pages
import AIContentTools from './pages/ai-solutions/AIContentTools';
import AIMarketingInsights from './pages/ai-solutions/AIMarketingInsights';
import AISEOEnhancement from './pages/ai-solutions/AISEOEnhancement';

// Create Website sub-pages
import CustomCodingOptions from './pages/create-website/CustomCodingOptions';
import SEOFoundationSetup from './pages/create-website/SEOFoundationSetup';
import USBasedDeployment from './pages/create-website/USBasedDeployment';

// Content Creation sub-pages
import VideoEditingServices from './pages/content-creation/VideoEditingServices';
import BlogArticlePlanning from './pages/content-creation/BlogArticlePlanning';
import SocialPostDesign from './pages/content-creation/SocialPostDesign';

// Definition pages
import SearchEngineOptimization from './pages/definitions/SearchEngineOptimization';
import OnlineEngagement from './pages/definitions/OnlineEngagement';
import ConversionRate from './pages/definitions/ConversionRate';
import AudienceTargeting from './pages/definitions/AudienceTargeting';
import ContentAutomation from './pages/definitions/ContentAutomation';
import NaturalLanguageGeneration from './pages/definitions/NaturalLanguageGeneration';

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
            <Route path="what-is-digital-marketing" element={<WhatIsDigitalMarketing />} />
            <Route path="digital-growth-impact" element={<DigitalGrowthImpact />} />
          </Route>
          
          {/* AI Solutions Routes */}
          <Route path="/ai-solutions" element={<AISolutionsPage />}>
            <Route path="ai-content-tools" element={<AIContentTools />} />
            <Route path="ai-marketing-insights" element={<AIMarketingInsights />} />
            <Route path="ai-seo-enhancement" element={<AISEOEnhancement />} />
          </Route>
          
          {/* Create Website Routes */}
          <Route path="/create-website" element={<CreateWebsitePage />}>
            <Route path="custom-coding-options" element={<CustomCodingOptions />} />
            <Route path="seo-foundation-setup" element={<SEOFoundationSetup />} />
            <Route path="us-based-deployment" element={<USBasedDeployment />} />
          </Route>
          
          {/* Content Creation Routes */}
          <Route path="/content-creation" element={<ContentCreationPage />}>
            <Route path="video-editing-services" element={<VideoEditingServices />} />
            <Route path="blog-article-planning" element={<BlogArticlePlanning />} />
            <Route path="social-post-design" element={<SocialPostDesign />} />
          </Route>
          
          {/* Definition Pages */}
          <Route path="/definitions/search-engine-optimization" element={<SearchEngineOptimization />} />
          <Route path="/definitions/online-engagement" element={<OnlineEngagement />} />
          <Route path="/definitions/conversion-rate" element={<ConversionRate />} />
          <Route path="/definitions/audience-targeting" element={<AudienceTargeting />} />
          <Route path="/definitions/content-automation" element={<ContentAutomation />} />
          <Route path="/definitions/natural-language-generation" element={<NaturalLanguageGeneration />} />
        </Routes>
        
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;