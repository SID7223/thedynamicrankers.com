import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import DarkModeToggle from './components/DarkModeToggle';
import Hero from './components/Hero';
import BusinessGrowth from './components/BusinessGrowth';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

// Lazy load page components for better performance
const DigitalMarketingPage = React.lazy(() => import('./pages/DigitalMarketingPage'));
const AISolutionsPage = React.lazy(() => import('./pages/AISolutionsPage'));
const CreateWebsitePage = React.lazy(() => import('./pages/CreateWebsitePage'));
const ContentCreationPage = React.lazy(() => import('./pages/ContentCreationPage'));

// Lazy load sub-pages
const DigitalMarketingSolution = React.lazy(() => import('./pages/digital-marketing/DigitalMarketingSolution'));
const ScopeOfDigitalMarketing = React.lazy(() => import('./pages/digital-marketing/ScopeOfDigitalMarketing'));
const WhatIsDigitalMarketing = React.lazy(() => import('./pages/digital-marketing/WhatIsDigitalMarketing'));
const DigitalGrowthImpact = React.lazy(() => import('./pages/digital-marketing/DigitalGrowthImpact'));

// AI Solutions sub-pages
const AIContentTools = React.lazy(() => import('./pages/ai-solutions/AIContentTools'));
const AIMarketingInsights = React.lazy(() => import('./pages/ai-solutions/AIMarketingInsights'));
const AISEOEnhancement = React.lazy(() => import('./pages/ai-solutions/AISEOEnhancement'));

// Create Website sub-pages
const CustomCodingOptions = React.lazy(() => import('./pages/create-website/CustomCodingOptions'));
const SEOFoundationSetup = React.lazy(() => import('./pages/create-website/SEOFoundationSetup'));
const USBasedDeployment = React.lazy(() => import('./pages/create-website/USBasedDeployment'));

// Content Creation sub-pages
const VideoEditingServices = React.lazy(() => import('./pages/content-creation/VideoEditingServices'));
const BlogArticlePlanning = React.lazy(() => import('./pages/content-creation/BlogArticlePlanning'));
const SocialPostDesign = React.lazy(() => import('./pages/content-creation/SocialPostDesign'));

// Definition pages
const SearchEngineOptimization = React.lazy(() => import('./pages/definitions/SearchEngineOptimization'));
const OnlineEngagement = React.lazy(() => import('./pages/definitions/OnlineEngagement'));
const ConversionRate = React.lazy(() => import('./pages/definitions/ConversionRate'));
const AudienceTargeting = React.lazy(() => import('./pages/definitions/AudienceTargeting'));
const ContentAutomation = React.lazy(() => import('./pages/definitions/ContentAutomation'));
const NaturalLanguageGeneration = React.lazy(() => import('./pages/definitions/NaturalLanguageGeneration'));

// Loading component for lazy-loaded routes
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);
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
        
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
        
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;