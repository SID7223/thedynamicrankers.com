import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DarkModeToggle from './components/DarkModeToggle';
import AIAssistant from './components/AIAssistant';
import ScrollToTop from './components/ScrollToTop';

// Import pages
import Hero from './components/Hero';
import About from './components/BusinessGrowth';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import AboutUs from './pages/AboutUs';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import BookACall from './pages/BookACall';
import ThankYouPage from './pages/ThankYouPage';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Service pages
import OurServicesPage from './pages/OurServicesPage';
import WebsiteDevelopmentPage from './pages/WebsiteDevelopmentPage';
import SEOServicesPage from './pages/SEOServicesPage';
import SearchEngineMarketingPage from './pages/SearchEngineMarketingPage';
import SocialMediaMarketingPage from './pages/SocialMediaMarketingPage';
import CustomerSupportPage from './pages/CustomerSupportPage';

// Main category pages
import DigitalMarketingPage from './pages/DigitalMarketingPage';
import AISolutionsPage from './pages/AISolutionsPage';
import CreateWebsitePage from './pages/CreateWebsitePage';
import ContentCreationPage from './pages/ContentCreationPage';

// Digital Marketing sub-pages
import DigitalMarketingSolution from './pages/digital-marketing/DigitalMarketingSolution';
import ScopeOfDigitalMarketing from './pages/digital-marketing/ScopeOfDigitalMarketing';
import WhatIsDigitalMarketing from './pages/digital-marketing/WhatIsDigitalMarketing';
import DigitalGrowthImpact from './pages/digital-marketing/DigitalGrowthImpact';

// AI Solutions sub-pages
import AIWebAutomation from './pages/ai-solutions/AIWebAutomation';
import AIContentTools from './pages/ai-solutions/AIContentTools';
import AIMarketingInsights from './pages/ai-solutions/AIMarketingInsights';
import AISEOEnhancement from './pages/ai-solutions/AISEOEnhancement';

// Create Website sub-pages
import DesignYourSite from './pages/create-website/DesignYourSite';
import CustomCodingOptions from './pages/create-website/CustomCodingOptions';
import SEOFoundationSetup from './pages/create-website/SEOFoundationSetup';
import USBasedDeployment from './pages/create-website/USBasedDeployment';

// Content Creation sub-pages
import CopywritingServices from './pages/content-creation/CopywritingServices';
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
import DigitalTransformation from './pages/definitions/DigitalTransformation';
import MultiChannelStrategy from './pages/definitions/MultiChannelStrategy';
import WorkflowAutomation from './pages/definitions/WorkflowAutomation';
import ProcessOptimization from './pages/definitions/ProcessOptimization';
import BrandIdentity from './pages/definitions/BrandIdentity';
import VisualStorytelling from './pages/definitions/VisualStorytelling';
import SalesPsychology from './pages/definitions/SalesPsychology';
import ContentOptimization from './pages/definitions/ContentOptimization';

// Homepage component
const HomePage = () => (
  <>
    <Hero />
    <About />
    <Testimonials />
    <Contact />
  </>
);

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <DarkModeToggle />
      <AIAssistant />
      
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Redirect special-booking to book-a-call-meeting */}
        <Route path="/special-booking" element={<Navigate to="/book-a-call-meeting" replace />} />
        
        {/* Main pages */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/career" element={<Careers />} />
        <Route path="/book-a-call-meeting" element={<BookACall />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Service pages */}
        <Route path="/our-services" element={<OurServicesPage />} />
        <Route path="/website-development" element={<WebsiteDevelopmentPage />} />
        <Route path="/seo-services" element={<SEOServicesPage />} />
        <Route path="/search-engine-marketing" element={<SearchEngineMarketingPage />} />
        <Route path="/social-media-marketing" element={<SocialMediaMarketingPage />} />
        <Route path="/customer-support" element={<CustomerSupportPage />} />
        
        {/* Digital Marketing section */}
        <Route path="/digital-marketing" element={<DigitalMarketingPage />}>
          <Route path="digital-marketing-solution" element={<DigitalMarketingSolution />} />
          <Route path="scope-of-digital-marketing" element={<ScopeOfDigitalMarketing />} />
          <Route path="what-is-digital-marketing" element={<WhatIsDigitalMarketing />} />
          <Route path="digital-growth-impact" element={<DigitalGrowthImpact />} />
        </Route>
        
        {/* AI Solutions section */}
        <Route path="/ai-solutions" element={<AISolutionsPage />}>
          <Route path="ai-web-automation" element={<AIWebAutomation />} />
          <Route path="ai-content-tools" element={<AIContentTools />} />
          <Route path="ai-marketing-insights" element={<AIMarketingInsights />} />
          <Route path="ai-seo-enhancement" element={<AISEOEnhancement />} />
        </Route>
        
        {/* Create Website section */}
        <Route path="/create-website" element={<CreateWebsitePage />}>
          <Route path="design-your-site" element={<DesignYourSite />} />
          <Route path="custom-coding-options" element={<CustomCodingOptions />} />
          <Route path="seo-foundation-setup" element={<SEOFoundationSetup />} />
          <Route path="us-based-deployment" element={<USBasedDeployment />} />
        </Route>
        
        {/* Content Creation section */}
        <Route path="/content-creation" element={<ContentCreationPage />}>
          <Route path="copywriting-services" element={<CopywritingServices />} />
          <Route path="video-editing-services" element={<VideoEditingServices />} />
          <Route path="blog-article-planning" element={<BlogArticlePlanning />} />
          <Route path="social-post-design" element={<SocialPostDesign />} />
        </Route>
        
        {/* Definition pages */}
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
        
        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;