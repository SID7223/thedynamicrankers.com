import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DarkModeToggle from './components/DarkModeToggle';
import AIAssistant from './components/AIAssistant';
import ScrollToTop from './components/ScrollToTop';

// Lazy load components for the Home page
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const BusinessGrowth = lazy(() => import('./components/BusinessGrowth'));
const TestimonialsLanding = lazy(() => import('./components/TestimonialsLanding'));
const ContactSection = lazy(() => import('./components/Contact'));

// Lazy load other pages
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ContactPage = lazy(() => import('./Contact'));
const Careers = lazy(() => import('./pages/Careers'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const MessagePage = lazy(() => import('./pages/MessagePage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const SpecialBookingPage = lazy(() => import('./pages/SpecialBookingPage'));
const BookACall = lazy(() => import('./pages/BookACall'));

// Digital Marketing Pages
const DigitalMarketingPage = lazy(() => import('./pages/DigitalMarketingPage'));
const DigitalMarketingSolution = lazy(() => import('./pages/digital-marketing/DigitalMarketingSolution'));
const ScopeOfDigitalMarketing = lazy(() => import('./pages/digital-marketing/ScopeOfDigitalMarketing'));
const WhatIsDigitalMarketing = lazy(() => import('./pages/digital-marketing/WhatIsDigitalMarketing'));
const DigitalGrowthImpact = lazy(() => import('./pages/digital-marketing/DigitalGrowthImpact'));

// AI Solutions Pages
const AISolutionsPage = lazy(() => import('./pages/AISolutionsPage'));
const AIWebAutomation = lazy(() => import('./pages/ai-solutions/AIWebAutomation'));
const AIContentTools = lazy(() => import('./pages/ai-solutions/AIContentTools'));
const AIMarketingInsights = lazy(() => import('./pages/ai-solutions/AIMarketingInsights'));
const AISEOEnhancement = lazy(() => import('./pages/ai-solutions/AISEOEnhancement'));

// Create Website Pages
const CreateWebsitePage = lazy(() => import('./pages/CreateWebsitePage'));
const DesignYourSite = lazy(() => import('./pages/create-website/DesignYourSite'));
const CustomCodingOptions = lazy(() => import('./pages/create-website/CustomCodingOptions'));
const SEOFoundationSetup = lazy(() => import('./pages/create-website/SEOFoundationSetup'));
const USBasedDeployment = lazy(() => import('./pages/create-website/USBasedDeployment'));

// Content Creation Pages
const ContentCreationPage = lazy(() => import('./pages/ContentCreationPage'));
const CopywritingServices = lazy(() => import('./pages/content-creation/CopywritingServices'));
const VideoEditingServices = lazy(() => import('./pages/content-creation/VideoEditingServices'));
const BlogArticlePlanning = lazy(() => import('./pages/content-creation/BlogArticlePlanning'));
const SocialPostDesign = lazy(() => import('./pages/content-creation/SocialPostDesign'));

// CRM Pages
const CRMPage = lazy(() => import('./pages/CRMPage'));
const CRMFeatures = lazy(() => import('./pages/CRMFeatures'));
const CRMIndustries = lazy(() => import('./pages/CRMIndustries'));
const CRMCaseStudies = lazy(() => import('./pages/CRMCaseStudies'));

// Onboarding
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));

// Definition Pages
const SearchEngineOptimization = lazy(() => import('./pages/definitions/SearchEngineOptimization'));
const OnlineEngagement = lazy(() => import('./pages/definitions/OnlineEngagement'));
const ConversionRate = lazy(() => import('./pages/definitions/ConversionRate'));
const AudienceTargeting = lazy(() => import('./pages/definitions/AudienceTargeting'));
const ContentAutomation = lazy(() => import('./pages/definitions/ContentAutomation'));
const NaturalLanguageGeneration = lazy(() => import('./pages/definitions/NaturalLanguageGeneration'));
const DigitalTransformation = lazy(() => import('./pages/definitions/DigitalTransformation'));
const MultiChannelStrategy = lazy(() => import('./pages/definitions/MultiChannelStrategy'));
const WorkflowAutomation = lazy(() => import('./pages/definitions/WorkflowAutomation'));
const ProcessOptimization = lazy(() => import('./pages/definitions/ProcessOptimization'));
const BrandIdentity = lazy(() => import('./pages/definitions/BrandIdentity'));
const VisualStorytelling = lazy(() => import('./pages/definitions/VisualStorytelling'));
const SalesPsychology = lazy(() => import('./pages/definitions/SalesPsychology'));
const ContentOptimization = lazy(() => import('./pages/definitions/ContentOptimization'));
const BehavioralData = lazy(() => import('./pages/definitions/BehavioralData'));
const BrandConsistency = lazy(() => import('./pages/definitions/BrandConsistency'));
const ColorGrading = lazy(() => import('./pages/definitions/ColorGrading'));
const ContentPillars = lazy(() => import('./pages/definitions/ContentPillars'));
const EditorialSeo = lazy(() => import('./pages/definitions/EditorialSeo'));
const InteractiveUx = lazy(() => import('./pages/definitions/InteractiveUx'));
const JavascriptAutomation = lazy(() => import('./pages/definitions/JavascriptAutomation'));
const MotionGraphics = lazy(() => import('./pages/definitions/MotionGraphics'));
const OnPageOptimization = lazy(() => import('./pages/definitions/OnPageOptimization'));
const PredictiveAnalytics = lazy(() => import('./pages/definitions/PredictiveAnalytics'));
const SemanticSearch = lazy(() => import('./pages/definitions/SemanticSearch'));
const ServerResponseTime = lazy(() => import('./pages/definitions/ServerResponseTime'));
const StructuredData = lazy(() => import('./pages/definitions/StructuredData'));
const TechnicalSeoAudit = lazy(() => import('./pages/definitions/TechnicalSeoAudit'));
const VisualHierarchy = lazy(() => import('./pages/definitions/VisualHierarchy'));
const Cdn = lazy(() => import('./pages/definitions/cdn'));
const CustomerSupportPage = lazy(() => import('./pages/CustomerSupportPage'));

// Blog Pages
const ImpactAiGigEconomy2026 = lazy(() => import('./pages/blogs/ImpactAiGigEconomy2026'));
const FutureProofingContentStrategyAiSolutions = lazy(() => import('./pages/blogs/FutureProofingContentStrategyAiSolutions'));
const DynamicRankersCompetitiveAdvantage = lazy(() => import('./pages/blogs/DynamicRankersCompetitiveAdvantage'));
const FutureOfAiEducationPersonalizedLearning = lazy(() => import('./pages/blogs/FutureOfAiEducationPersonalizedLearning'));
const Blog5gAiSolutionsRevolutionizeConnectivity2026 = lazy(() => import('./pages/blogs/Blog5gAiSolutionsRevolutionizeConnectivity2026'));
const FutureOfWebsitesEdgeComputing = lazy(() => import('./pages/blogs/FutureOfWebsitesEdgeComputing'));
const RoleDynamicRankersCreatorEconomy = lazy(() => import('./pages/blogs/RoleDynamicRankersCreatorEconomy'));
const AiSolutionsClimateChangeMitigation2026 = lazy(() => import('./pages/blogs/AiSolutionsClimateChangeMitigation2026'));
const FutureOfAiEmotionalIntelligence = lazy(() => import('./pages/blogs/FutureOfAiEmotionalIntelligence'));
const DynamicRankersMethodologyScalesStartups = lazy(() => import('./pages/blogs/DynamicRankersMethodologyScalesStartups'));
const FutureOfWebsitesVoiceControlledNavigation = lazy(() => import('./pages/blogs/FutureOfWebsitesVoiceControlledNavigation'));
const SecurityChallengesAiSolutionEra2026 = lazy(() => import('./pages/blogs/SecurityChallengesAiSolutionEra2026'));
const FutureOfAiSpaceExploration = lazy(() => import('./pages/blogs/FutureOfAiSpaceExploration'));
const DynamicRankersScienceConversionRates = lazy(() => import('./pages/blogs/DynamicRankersScienceConversionRates'));
const FutureOfWebsitesIntegratedMicroServices = lazy(() => import('./pages/blogs/FutureOfWebsitesIntegratedMicroServices'));
const AiSolutionsSupplyChainOptimization2026 = lazy(() => import('./pages/blogs/AiSolutionsSupplyChainOptimization2026'));
const FutureOfAiNarrowToGeneralIntelligence = lazy(() => import('./pages/blogs/FutureOfAiNarrowToGeneralIntelligence'));
const DynamicRankersFutureDigitalVisibility = lazy(() => import('./pages/blogs/DynamicRankersFutureDigitalVisibility'));
const FutureOfWebsitesDynamicLayoutsMood = lazy(() => import('./pages/blogs/FutureOfWebsitesDynamicLayoutsMood'));
const HarnessingAiSolutionsMentalHealth2026 = lazy(() => import('./pages/blogs/HarnessingAiSolutionsMentalHealth2026'));
const FutureOfAiLegalTechAutomatedContracts = lazy(() => import('./pages/blogs/FutureOfAiLegalTechAutomatedContracts'));
const DynamicRankersPerformanceMarketing = lazy(() => import('./pages/blogs/DynamicRankersPerformanceMarketing'));
const FutureOfWebsitesAccessibilityCompliance = lazy(() => import('./pages/blogs/FutureOfWebsitesAccessibilityCompliance'));
const AiSolutionsModernAgriculture2026 = lazy(() => import('./pages/blogs/AiSolutionsModernAgriculture2026'));
const EmbracingFutureDynamicRankers = lazy(() => import('./pages/blogs/EmbracingFutureDynamicRankers'));

// Home Page Component
const HomePage = () => (
  <>
    <Hero />
    <About />
    <BusinessGrowth />
    <TestimonialsLanding />
    <ContactSection />
  </>
);

function App() {
  const location = useLocation();
  const isCrmPage = location.pathname.startsWith('/crm');
  const isOnboardingPage = location.pathname === '/onboarding';
  const isThankYouPage = location.pathname === '/thank-you';

  return (
    <>
      <ScrollToTop />
      {!isCrmPage && !isOnboardingPage && !isThankYouPage && <Header />}
      <div className="main-content-wrapper min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <DarkModeToggle />
        
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/career" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/message" element={<MessagePage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/special-booking" element={<SpecialBookingPage />} />
            <Route path="/book-a-call-meeting" element={<BookACall />} />
            
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
            
            {/* Blog Routes */}
            <Route path="/blog/impact-ai-gig-economy-2026" element={<ImpactAiGigEconomy2026 />} />
            <Route path="/blog/future-proofing-content-strategy-ai-solutions" element={<FutureProofingContentStrategyAiSolutions />} />
            <Route path="/blog/dynamic-rankers-competitive-advantage" element={<DynamicRankersCompetitiveAdvantage />} />
            <Route path="/blog/future-of-ai-education-personalized-learning" element={<FutureOfAiEducationPersonalizedLearning />} />
            <Route path="/blog/5g-ai-solutions-revolutionize-connectivity-2026" element={<Blog5gAiSolutionsRevolutionizeConnectivity2026 />} />
            <Route path="/blog/future-of-websites-edge-computing" element={<FutureOfWebsitesEdgeComputing />} />
            <Route path="/blog/role-dynamic-rankers-creator-economy" element={<RoleDynamicRankersCreatorEconomy />} />
            <Route path="/blog/ai-solutions-climate-change-mitigation-2026" element={<AiSolutionsClimateChangeMitigation2026 />} />
            <Route path="/blog/future-of-ai-emotional-intelligence" element={<FutureOfAiEmotionalIntelligence />} />
            <Route path="/blog/dynamic-rankers-methodology-scales-startups" element={<DynamicRankersMethodologyScalesStartups />} />
            <Route path="/blog/future-of-websites-voice-controlled-navigation" element={<FutureOfWebsitesVoiceControlledNavigation />} />
            <Route path="/blog/security-challenges-ai-solution-era-2026" element={<SecurityChallengesAiSolutionEra2026 />} />
            <Route path="/blog/future-of-ai-space-exploration" element={<FutureOfAiSpaceExploration />} />
            <Route path="/blog/dynamic-rankers-science-conversion-rates" element={<DynamicRankersScienceConversionRates />} />
            <Route path="/blog/future-of-websites-integrated-micro-services" element={<FutureOfWebsitesIntegratedMicroServices />} />
            <Route path="/blog/ai-solutions-supply-chain-optimization-2026" element={<AiSolutionsSupplyChainOptimization2026 />} />
            <Route path="/blog/future-of-ai-narrow-to-general-intelligence" element={<FutureOfAiNarrowToGeneralIntelligence />} />
            <Route path="/blog/dynamic-rankers-future-digital-visibility" element={<DynamicRankersFutureDigitalVisibility />} />
            <Route path="/blog/future-of-websites-dynamic-layouts-mood" element={<FutureOfWebsitesDynamicLayoutsMood />} />
            <Route path="/blog/harnessing-ai-solutions-mental-health-2026" element={<HarnessingAiSolutionsMentalHealth2026 />} />
            <Route path="/blog/future-of-ai-legal-tech-automated-contracts" element={<FutureOfAiLegalTechAutomatedContracts />} />
            <Route path="/blog/dynamic-rankers-performance-marketing" element={<DynamicRankersPerformanceMarketing />} />
            <Route path="/blog/future-of-websites-accessibility-compliance" element={<FutureOfWebsitesAccessibilityCompliance />} />
            <Route path="/blog/ai-solutions-modern-agriculture-2026" element={<AiSolutionsModernAgriculture2026 />} />
            <Route path="/blog/embracing-future-dynamic-rankers" element={<EmbracingFutureDynamicRankers />} />

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
            <Route path="/definitions/24-7-service" element={<CustomerSupportPage />} />

            {/* CRM Routes */}
            <Route path="/crm" element={<CRMPage />} />
            <Route path="/crm/features" element={<CRMFeatures />} />
            <Route path="/crm/industries" element={<CRMIndustries />} />
            <Route path="/crm/case-studies" element={<CRMCaseStudies />} />

            {/* Onboarding */}
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Routes>
        </Suspense>
        
        {!isCrmPage && !isOnboardingPage && !isThankYouPage && <Footer />}
        {!isOnboardingPage && !isThankYouPage && <AIAssistant />}
      </div>
    </>
  );
}

export default App;
