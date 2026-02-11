import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import DarkModeToggle from './components/DarkModeToggle';
import Hero from './components/Hero';
import BusinessGrowth from './components/BusinessGrowth';
import TestimonialsLanding from './components/TestimonialsLanding';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

// Lazy load page components for better performance
const DigitalMarketingPage = React.lazy(() => import('./pages/DigitalMarketingPage'));
const AISolutionsPage = React.lazy(() => import('./pages/AISolutionsPage'));
const CreateWebsitePage = React.lazy(() => import('./pages/CreateWebsitePage'));
const ContentCreationPage = React.lazy(() => import('./pages/ContentCreationPage'));
const OurServicesPage = React.lazy(() => import('./pages/OurServicesPage'));
const WebsiteDevelopmentPage = React.lazy(() => import('./pages/WebsiteDevelopmentPage'));
const SEOServicesPage = React.lazy(() => import('./pages/SEOServicesPage'));
const SearchEngineMarketingPage = React.lazy(() => import('./pages/SearchEngineMarketingPage'));
const SocialMediaMarketingPage = React.lazy(() => import('./pages/SocialMediaMarketingPage'));
const CustomerSupportPage = React.lazy(() => import('./pages/CustomerSupportPage'));
const BookACall = React.lazy(() => import('./pages/BookACall'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost')); // ADDED THIS LINE
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Careers = React.lazy(() => import('./pages/Careers'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const ThankYouPage = React.lazy(() => import('./pages/ThankYouPage'));
const SpecialBookingPage = React.lazy(() => import('./pages/SpecialBookingPage'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'));

// ✅ ADDED: Message page route target
const MessagePage = React.lazy(() => import('./pages/MessagePage'));

// CRM Microsite
const CRMPage = React.lazy(() => import('./pages/CRMPage'));
const CRMFeatures = React.lazy(() => import('./pages/CRMFeatures'));
const CRMIndustries = React.lazy(() => import('./pages/CRMIndustries'));
const CRMCaseStudies = React.lazy(() => import('./pages/CRMCaseStudies'));

// Lazy load sub-pages
const DigitalMarketingSolution = React.lazy(() => import('./pages/digital-marketing/DigitalMarketingSolution'));
const ScopeOfDigitalMarketing = React.lazy(() => import('./pages/digital-marketing/ScopeOfDigitalMarketing'));
const WhatIsDigitalMarketing = React.lazy(() => import('./pages/digital-marketing/WhatIsDigitalMarketing'));
const DigitalGrowthImpact = React.lazy(() => import('./pages/digital-marketing/DigitalGrowthImpact'));

// AI Solutions sub-pages
const AIContentTools = React.lazy(() => import('./pages/ai-solutions/AIContentTools'));
const AIMarketingInsights = React.lazy(() => import('./pages/ai-solutions/AIMarketingInsights'));
const AISEOEnhancement = React.lazy(() => import('./pages/ai-solutions/AISEOEnhancement'));
const AIWebAutomation = React.lazy(() => import('./pages/ai-solutions/AIWebAutomation'));

// Create Website sub-pages
const CustomCodingOptions = React.lazy(() => import('./pages/create-website/CustomCodingOptions'));
const SEOFoundationSetup = React.lazy(() => import('./pages/create-website/SEOFoundationSetup'));
const USBasedDeployment = React.lazy(() => import('./pages/create-website/USBasedDeployment'));
const DesignYourSite = React.lazy(() => import('./pages/create-website/DesignYourSite'));

// Content Creation sub-pages
const VideoEditingServices = React.lazy(() => import('./pages/content-creation/VideoEditingServices'));
const BlogArticlePlanning = React.lazy(() => import('./pages/content-creation/BlogArticlePlanning'));
const SocialPostDesign = React.lazy(() => import('./pages/content-creation/SocialPostDesign'));
const CopywritingServices = React.lazy(() => import('./pages/content-creation/CopywritingServices'));

// Definition pages
const SearchEngineOptimization = React.lazy(() => import('./pages/definitions/SearchEngineOptimization'));
const OnlineEngagement = React.lazy(() => import('./pages/definitions/OnlineEngagement'));
const ConversionRate = React.lazy(() => import('./pages/definitions/ConversionRate'));
const AudienceTargeting = React.lazy(() => import('./pages/definitions/AudienceTargeting'));
const ContentAutomation = React.lazy(() => import('./pages/definitions/ContentAutomation'));
const NaturalLanguageGeneration = React.lazy(() => import('./pages/definitions/NaturalLanguageGeneration'));
const DigitalTransformation = React.lazy(() => import('./pages/definitions/DigitalTransformation'));
const MultiChannelStrategy = React.lazy(() => import('./pages/definitions/MultiChannelStrategy'));
const WorkflowAutomation = React.lazy(() => import('./pages/definitions/WorkflowAutomation'));
const ProcessOptimization = React.lazy(() => import('./pages/definitions/ProcessOptimization'));
const BrandIdentity = React.lazy(() => import('./pages/definitions/BrandIdentity'));
const VisualStorytelling = React.lazy(() => import('./pages/definitions/VisualStorytelling'));
const SalesPsychology = React.lazy(() => import('./pages/definitions/SalesPsychology'));
const ContentOptimization = React.lazy(() => import('./pages/definitions/ContentOptimization'));
const BehavioralData = React.lazy(() => import('./pages/definitions/BehavioralData'));
const BrandConsistency = React.lazy(() => import('./pages/definitions/BrandConsistency'));
const ColorGrading = React.lazy(() => import('./pages/definitions/ColorGrading'));
const ContentPillars = React.lazy(() => import('./pages/definitions/ContentPillars'));
const EditorialSeo = React.lazy(() => import('./pages/definitions/EditorialSeo'));
const InteractiveUx = React.lazy(() => import('./pages/definitions/InteractiveUx'));
const JavascriptAutomation = React.lazy(() => import('./pages/definitions/JavascriptAutomation'));
const MotionGraphics = React.lazy(() => import('./pages/definitions/MotionGraphics'));
const OnPageOptimization = React.lazy(() => import('./pages/definitions/OnPageOptimization'));
const PredictiveAnalytics = React.lazy(() => import('./pages/definitions/PredictiveAnalytics'));
const SemanticSearch = React.lazy(() => import('./pages/definitions/SemanticSearch'));
const ServerResponseTime = React.lazy(() => import('./pages/definitions/ServerResponseTime'));
const StructuredData = React.lazy(() => import('./pages/definitions/StructuredData'));
const TechnicalSeoAudit = React.lazy(() => import('./pages/definitions/TechnicalSeoAudit'));
const VisualHierarchy = React.lazy(() => import('./pages/definitions/VisualHierarchy'));
const Cdn = React.lazy(() => import('./pages/definitions/cdn'));

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
    // Handle smooth scrolling to specific sections for home page
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
          return; // Don't scroll to sections for other pages
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
      
      {/* Show Testimonials Landing on homepage */}
      {isHomePage && <TestimonialsLanding />}
      
      {/* Only show BusinessGrowth and Contact on homepage */}
      {isHomePage && <BusinessGrowth />}
      {isHomePage && <Contact />}
    </>
  );
};


function App() {
  const location = useLocation(); // New addition to track URL
  
  // New logic to check if current route is part of the CRM section
  const isCrmPage = location.pathname.startsWith('/crm');
  const isOnboardingPage = location.pathname === '/onboarding';
  
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Only render global Header if NOT on a CRM page or Onboarding page */}
        {!isCrmPage && !isOnboardingPage && <Header />}
        
        <DarkModeToggle />
        
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            
            {/* Service Pages */}
            <Route path="/our-services" element={<OurServicesPage />} />
            <Route path="/website-development" element={<WebsiteDevelopmentPage />} />
            <Route path="/seo-services" element={<SEOServicesPage />} />
            <Route path="/search-engine-marketing" element={<SearchEngineMarketingPage />} />
            <Route path="/social-media-marketing" element={<SocialMediaMarketingPage />} />
            <Route path="/customer-support" element={<CustomerSupportPage />} />
                        
            {/* Quick Link Pages */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/portfolio" element={<Portfolio />} />
            
            {/* Blog Section */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} /> {/* DYNAMIC ROUTE ADDED HERE */}
            
            <Route path="/career" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* ✅ ADDED: Message route */}
            <Route path="/message" element={<MessagePage />} />
            
            {/* Digital Marketing Routes */}
            <Route path="/digital-marketing" element={<DigitalMarketingPage />}>
              <Route path="digital-marketing-solution" element={<DigitalMarketingSolution />} />
              <Route path="scope-of-digital-marketing" element={<ScopeOfDigitalMarketing />} />
              <Route path="what-is-digital-marketing" element={<WhatIsDigitalMarketing />} />
              <Route path="digital-growth-impact" element={<DigitalGrowthImpact />} />
            </Route>
            
            {/* AI Solutions Routes */}
            <Route path="/ai-solutions" element={<AISolutionsPage />}>
              <Route path="ai-web-automation" element={<AIWebAutomation />} />
              <Route path="ai-content-tools" element={<AIContentTools />} />
              <Route path="ai-marketing-insights" element={<AIMarketingInsights />} />
              <Route path="ai-seo-enhancement" element={<AISEOEnhancement />} />
            </Route>
            
            {/* Create Website Routes */}
            <Route path="/create-website" element={<CreateWebsitePage />}>
              <Route path="design-your-site" element={<DesignYourSite />} />
              <Route path="custom-coding-options" element={<CustomCodingOptions />} />
              <Route path="seo-foundation-setup" element={<SEOFoundationSetup />} />
              <Route path="us-based-deployment" element={<USBasedDeployment />} />
            </Route>
            
            {/* Content Creation Routes */}
            <Route path="/content-creation" element={<ContentCreationPage />}>
              <Route path="copywriting-services" element={<CopywritingServices />} />
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
            <Route path="/definitions/digital-transformation" element={<DigitalTransformation />} />
            <Route path="/definitions/multi-channel-strategy" element={<MultiChannelStrategy />} />
            <Route path="/definitions/workflow-automation" element={<WorkflowAutomation />} />
            <Route path="/definitions/process-optimization" element={<ProcessOptimization />} />
            <Route path="/definitions/brand-identity" element={<BrandIdentity />} />
            <Route path="/definitions/visual-storytelling" element={<VisualStorytelling />} />
            <Route path="/definitions/sales-psychology" element={<SalesPsychology />} />
            <Route path="/definitions/content-optimization" element={<ContentOptimization />} />
            <Route path="/definitions/behavioral-data" element={<BehavioralData />} />
            <Route path="/definitions/brand-consistency" element={<BrandConsistency />} />
            <Route path="/definitions/color-grading" element={<ColorGrading />} />
            <Route path="/definitions/content-pillars" element={<ContentPillars />} />
            <Route path="/definitions/editorial-seo" element={<EditorialSeo />} />
            <Route path="/definitions/interactive-ux" element={<InteractiveUx />} />
            <Route path="/definitions/javascript-automation" element={<JavascriptAutomation />} />
            <Route path="/definitions/motion-graphics" element={<MotionGraphics />} />
            <Route path="/definitions/on-page-optimization" element={<OnPageOptimization />} />
            <Route path="/definitions/predictive-analytics" element={<PredictiveAnalytics />} />
            <Route path="/definitions/semantic-search" element={<SemanticSearch />} />
            <Route path="/definitions/server-response-time" element={<ServerResponseTime />} />
            <Route path="/definitions/structured-data" element={<StructuredData />} />
            <Route path="/definitions/technical-seo-audit" element={<TechnicalSeoAudit />} />
            <Route path="/definitions/visual-hierarchy" element={<VisualHierarchy />} />
            <Route path="/definitions/cdn" element={<Cdn />} />
            <Route path="/definitions/meta-structure" element={<SearchEngineOptimization />} />
            <Route path="/definitions/page-indexing" element={<SearchEngineOptimization />} />
            <Route path="/definitions/responsive-layout" element={<OnPageOptimization />} />
            <Route path="/definitions/engagement-rate" element={<OnlineEngagement />} />
            <Route path="/definitions/platform-targeting" element={<AudienceTargeting />} />
            <Route path="/definitions/bid-strategy" element={<SearchEngineOptimization />} />
            <Route path="/definitions/conversion-funnel" element={<ConversionRate />} />
            <Route path="/definitions/24-7-service" element={<CustomerSupportPage />} />
            <Route path="/definitions/ticket-resolution" element={<CustomerSupportPage />} />
            <Route path="/definitions/interactive-design" element={<InteractiveUx />} />
            <Route path="/book-a-call-meeting" element={<BookACall />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/special-booking" element={<SpecialBookingPage />} />
                     
            {/* CRM Microsite */}
            <Route path="/crm" element={<CRMPage />} />
            <Route path="/crm/features" element={<CRMFeatures />} />
            <Route path="/crm/industries" element={<CRMIndustries />} />
            <Route path="/crm/case-studies" element={<CRMCaseStudies />} />

            {/* Onboarding Funnel */}
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Routes>
        </Suspense>
        
        {!isCrmPage && !isOnboardingPage && <Footer />}
        {!isOnboardingPage && <AIAssistant />}
      </div>
    </>
  );
}

export default App;
