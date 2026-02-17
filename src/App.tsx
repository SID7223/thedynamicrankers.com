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

const EvolutionHyperPersonalizedUx2026 = React.lazy(() => import('./pages/blogs/EvolutionHyperPersonalizedUx2026'));
const AiSolutionsSmallBusinessGrowth = React.lazy(() => import('./pages/blogs/AiSolutionsSmallBusinessGrowth'));
const DeathOfStaticContentFutureOfWebsites = React.lazy(() => import('./pages/blogs/DeathOfStaticContentFutureOfWebsites'));
const DynamicRankersPredictiveSeo = React.lazy(() => import('./pages/blogs/DynamicRankersPredictiveSeo'));
const QuantumComputingFutureOfAi2026 = React.lazy(() => import('./pages/blogs/QuantumComputingFutureOfAi2026'));
const DecentralizedWebBusinessFuture = React.lazy(() => import('./pages/blogs/DecentralizedWebBusinessFuture'));
const GenerativeAiCorporateBranding = React.lazy(() => import('./pages/blogs/GenerativeAiCorporateBranding'));
const ScalingVenturesLocalizedAiSolutions = React.lazy(() => import('./pages/blogs/ScalingVenturesLocalizedAiSolutions'));
const EthicsOfAi2026DeepDive = React.lazy(() => import('./pages/blogs/EthicsOfAi2026DeepDive'));
const WebsiteIntelligentAgent2026 = React.lazy(() => import('./pages/blogs/WebsiteIntelligentAgent2026'));
const DynamicRankersVoiceSearchLandscape = React.lazy(() => import('./pages/blogs/DynamicRankersVoiceSearchLandscape'));
const FutureOfAiHealthcareDiagnostics = React.lazy(() => import('./pages/blogs/FutureOfAiHealthcareDiagnostics'));
const BuildingSustainableDigitalEcosystems = React.lazy(() => import('./pages/blogs/BuildingSustainableDigitalEcosystems'));
const AiSolutionsReduceOperationalFriction = React.lazy(() => import('./pages/blogs/AiSolutionsReduceOperationalFriction'));
const MobileFirstToAiFirstDesign2026 = React.lazy(() => import('./pages/blogs/MobileFirstToAiFirstDesign2026'));
const DynamicRankersEraSemanticSearch = React.lazy(() => import('./pages/blogs/DynamicRankersEraSemanticSearch'));
const FutureOfWebsitesImmersiveVrar = React.lazy(() => import('./pages/blogs/FutureOfWebsitesImmersiveVrar'));
const NeuralInterfacesUltimateFutureOfAi = React.lazy(() => import('./pages/blogs/NeuralInterfacesUltimateFutureOfAi'));
const AiSolutionsFinancialDecisionMaking = React.lazy(() => import('./pages/blogs/AiSolutionsFinancialDecisionMaking'));
const BusinessesFailAdaptFutureTechnology = React.lazy(() => import('./pages/blogs/BusinessesFailAdaptFutureTechnology'));
const DynamicRankersAdaptiveMarketing = React.lazy(() => import('./pages/blogs/DynamicRankersAdaptiveMarketing'));
const FutureOfAiCreativeIndustries = React.lazy(() => import('./pages/blogs/FutureOfAiCreativeIndustries'));
const SmartCitiesAiSolutions2026 = React.lazy(() => import('./pages/blogs/SmartCitiesAiSolutions2026'));
const FutureOfWebsitesBeyondBrowser = React.lazy(() => import('./pages/blogs/FutureOfWebsitesBeyondBrowser'));
const DataPrivacyDynamicRankers = React.lazy(() => import('./pages/blogs/DataPrivacyDynamicRankers'));
const ImpactAiGigEconomy2026 = React.lazy(() => import('./pages/blogs/ImpactAiGigEconomy2026'));
const FutureProofingContentStrategyAiSolutions = React.lazy(() => import('./pages/blogs/FutureProofingContentStrategyAiSolutions'));
const DynamicRankersCompetitiveAdvantage = React.lazy(() => import('./pages/blogs/DynamicRankersCompetitiveAdvantage'));
const FutureOfAiEducationPersonalizedLearning = React.lazy(() => import('./pages/blogs/FutureOfAiEducationPersonalizedLearning'));
const Blog5gAiSolutionsRevolutionizeConnectivity2026 = React.lazy(() => import('./pages/blogs/Blog5gAiSolutionsRevolutionizeConnectivity2026'));
const FutureOfWebsitesEdgeComputing = React.lazy(() => import('./pages/blogs/FutureOfWebsitesEdgeComputing'));
const RoleDynamicRankersCreatorEconomy = React.lazy(() => import('./pages/blogs/RoleDynamicRankersCreatorEconomy'));
const AiSolutionsClimateChangeMitigation2026 = React.lazy(() => import('./pages/blogs/AiSolutionsClimateChangeMitigation2026'));
const FutureOfAiEmotionalIntelligence = React.lazy(() => import('./pages/blogs/FutureOfAiEmotionalIntelligence'));
const DynamicRankersMethodologyScalesStartups = React.lazy(() => import('./pages/blogs/DynamicRankersMethodologyScalesStartups'));
const FutureOfWebsitesVoiceControlledNavigation = React.lazy(() => import('./pages/blogs/FutureOfWebsitesVoiceControlledNavigation'));
const SecurityChallengesAiSolutionEra2026 = React.lazy(() => import('./pages/blogs/SecurityChallengesAiSolutionEra2026'));
const FutureOfAiSpaceExploration = React.lazy(() => import('./pages/blogs/FutureOfAiSpaceExploration'));
const DynamicRankersScienceConversionRates = React.lazy(() => import('./pages/blogs/DynamicRankersScienceConversionRates'));
const FutureOfWebsitesIntegratedMicroServices = React.lazy(() => import('./pages/blogs/FutureOfWebsitesIntegratedMicroServices'));
const AiSolutionsSupplyChainOptimization2026 = React.lazy(() => import('./pages/blogs/AiSolutionsSupplyChainOptimization2026'));
const FutureOfAiNarrowToGeneralIntelligence = React.lazy(() => import('./pages/blogs/FutureOfAiNarrowToGeneralIntelligence'));
const DynamicRankersFutureDigitalVisibility = React.lazy(() => import('./pages/blogs/DynamicRankersFutureDigitalVisibility'));
const FutureOfWebsitesDynamicLayoutsMood = React.lazy(() => import('./pages/blogs/FutureOfWebsitesDynamicLayoutsMood'));
const HarnessingAiSolutionsMentalHealth2026 = React.lazy(() => import('./pages/blogs/HarnessingAiSolutionsMentalHealth2026'));
const FutureOfAiLegalTechAutomatedContracts = React.lazy(() => import('./pages/blogs/FutureOfAiLegalTechAutomatedContracts'));
const DynamicRankersPerformanceMarketing = React.lazy(() => import('./pages/blogs/DynamicRankersPerformanceMarketing'));
const FutureOfWebsitesAccessibilityCompliance = React.lazy(() => import('./pages/blogs/FutureOfWebsitesAccessibilityCompliance'));
const AiSolutionsModernAgriculture2026 = React.lazy(() => import('./pages/blogs/AiSolutionsModernAgriculture2026'));
const EmbracingFutureDynamicRankers = React.lazy(() => import('./pages/blogs/EmbracingFutureDynamicRankers'));

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
        <title>{isHomePage ? "Dominate Your Market | The Dynamic Rankers" : "The Dynamic Rankers | Elite Digital Solutions"}</title>
        <meta name="description" content={isHomePage ? "Elevate your online presence with The Dynamic Rankers. We specialize in high-conversion web development, precision SEO, and AI-driven digital marketing solutions for USA businesses." : "Professional digital marketing and web development services to boost your online presence and drive growth."} />
        <meta property="og:title" content={isHomePage ? "Dominate Your Market | The Dynamic Rankers" : "The Dynamic Rankers | Elite Digital Solutions"} />
        <meta property="og:description" content={isHomePage ? "Elevate your online presence with The Dynamic Rankers. We specialize in high-conversion web development, precision SEO, and AI-driven digital marketing solutions for USA businesses." : "Professional digital marketing and web development services to boost your online presence and drive growth."} />
        <meta property="og:image" content="https://thedynamicrankers.com/the%20copy%20copy.png" />
        <meta property="og:type" content="website" />
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
  const isThankYouPage = location.pathname === '/thank-you';

  return (
    <>
      <ScrollToTop />
      {!isCrmPage && !isOnboardingPage && !isThankYouPage && <Header />}
      <div className="main-content-wrapper min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog/evolution-hyper-personalized-ux-2026" element={<EvolutionHyperPersonalizedUx2026 />} />
            <Route path="/blog/ai-solutions-small-business-growth" element={<AiSolutionsSmallBusinessGrowth />} />
            <Route path="/blog/death-of-static-content-future-of-websites" element={<DeathOfStaticContentFutureOfWebsites />} />
            <Route path="/blog/dynamic-rankers-predictive-seo" element={<DynamicRankersPredictiveSeo />} />
            <Route path="/blog/quantum-computing-future-of-ai-2026" element={<QuantumComputingFutureOfAi2026 />} />
            <Route path="/blog/decentralized-web-business-future" element={<DecentralizedWebBusinessFuture />} />
            <Route path="/blog/generative-ai-corporate-branding" element={<GenerativeAiCorporateBranding />} />
            <Route path="/blog/scaling-ventures-localized-ai-solutions" element={<ScalingVenturesLocalizedAiSolutions />} />
            <Route path="/blog/ethics-of-ai-2026-deep-dive" element={<EthicsOfAi2026DeepDive />} />
            <Route path="/blog/website-intelligent-agent-2026" element={<WebsiteIntelligentAgent2026 />} />
            <Route path="/blog/dynamic-rankers-voice-search-landscape" element={<DynamicRankersVoiceSearchLandscape />} />
            <Route path="/blog/future-of-ai-healthcare-diagnostics" element={<FutureOfAiHealthcareDiagnostics />} />
            <Route path="/blog/building-sustainable-digital-ecosystems" element={<BuildingSustainableDigitalEcosystems />} />
            <Route path="/blog/ai-solutions-reduce-operational-friction" element={<AiSolutionsReduceOperationalFriction />} />
            <Route path="/blog/mobile-first-to-ai-first-design-2026" element={<MobileFirstToAiFirstDesign2026 />} />
            <Route path="/blog/dynamic-rankers-era-semantic-search" element={<DynamicRankersEraSemanticSearch />} />
            <Route path="/blog/future-of-websites-immersive-vrar" element={<FutureOfWebsitesImmersiveVrar />} />
            <Route path="/blog/neural-interfaces-ultimate-future-of-ai" element={<NeuralInterfacesUltimateFutureOfAi />} />
            <Route path="/blog/ai-solutions-financial-decision-making" element={<AiSolutionsFinancialDecisionMaking />} />
            <Route path="/blog/businesses-fail-adapt-future-technology" element={<BusinessesFailAdaptFutureTechnology />} />
            <Route path="/blog/dynamic-rankers-adaptive-marketing" element={<DynamicRankersAdaptiveMarketing />} />
            <Route path="/blog/future-of-ai-creative-industries" element={<FutureOfAiCreativeIndustries />} />
            <Route path="/blog/smart-cities-ai-solutions-2026" element={<SmartCitiesAiSolutions2026 />} />
            <Route path="/blog/future-of-websites-beyond-browser" element={<FutureOfWebsitesBeyondBrowser />} />
            <Route path="/blog/data-privacy-dynamic-rankers" element={<DataPrivacyDynamicRankers />} />
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
            <Route path="/blog/embracing-future-dynamic-rankers" element={<EmbracingFutureDynamicRankers />} /> {/* DYNAMIC ROUTE ADDED HERE */}

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
        
        {!isCrmPage && !isOnboardingPage && !isThankYouPage && <Footer />}
        {!isOnboardingPage && !isThankYouPage && <AIAssistant />}
      </div>
    </>
  );
}

export default App;
