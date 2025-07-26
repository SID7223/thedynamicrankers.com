import React from 'react';
import { Globe, Search, Target, Users, Headphones } from 'lucide-react';
import ServiceModal from './ServiceModal';

const Services = () => {
  const [selectedService, setSelectedService] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const services = [
    {
      icon: Globe,
      title: "Website Development",
      description: "Custom websites built with modern technologies, responsive design, and optimized performance to establish your strong online presence.",
      features: ["Custom Design", "Mobile Responsive", "Fast Loading", "SEO Ready"],
      detailedInfo: {
        overview: "Our website development service creates stunning, high-performance websites that not only look amazing but also drive results. We use the latest technologies and best practices to ensure your website stands out from the competition and provides an exceptional user experience across all devices.",
        benefits: [
          "Fully responsive design that works on all devices",
          "Lightning-fast loading speeds for better user experience",
          "SEO-optimized structure for better search rankings",
          "Custom design tailored to your brand identity",
          "Content management system for easy updates",
          "Security features to protect your website",
          "Analytics integration for performance tracking",
          "Ongoing maintenance and support"
        ],
        process: [
          "Discovery & Planning: We analyze your business needs and create a comprehensive project plan",
          "Design & Wireframing: Our designers create mockups and wireframes for your approval",
          "Development: Our developers build your website using modern technologies",
          "Testing & Quality Assurance: Thorough testing across all devices and browsers",
          "Launch & Deployment: We launch your website and ensure everything works perfectly",
          "Training & Support: We provide training and ongoing support for your team"
        ],
        pricing: "Starting from $2,500 for basic websites. Custom quotes available for complex projects.",
        timeline: "2-6 weeks depending on complexity and requirements"
      }
    },
    {
      icon: Search,
      title: "Search Engine Optimization (SEO)",
      description: "Improve your search rankings and organic traffic with our comprehensive SEO strategies and technical optimization.",
      features: ["Keyword Research", "On-page SEO", "Technical SEO", "Link Building"],
      detailedInfo: {
        overview: "Our SEO service is designed to improve your website's visibility in search engines and drive more organic traffic to your business. We use white-hat techniques and data-driven strategies to help you rank higher for keywords that matter to your business.",
        benefits: [
          "Higher search engine rankings for targeted keywords",
          "Increased organic traffic and qualified leads",
          "Better user experience and website performance",
          "Improved local search visibility",
          "Comprehensive competitor analysis",
          "Monthly reporting and performance tracking",
          "Long-term sustainable growth",
          "Higher conversion rates from organic traffic"
        ],
        process: [
          "SEO Audit: Comprehensive analysis of your current website and SEO performance",
          "Keyword Research: Identify high-value keywords for your business",
          "On-Page Optimization: Optimize content, meta tags, and website structure",
          "Technical SEO: Fix technical issues that may be hurting your rankings",
          "Content Strategy: Create and optimize content that ranks and converts",
          "Link Building: Build high-quality backlinks to improve domain authority"
        ],
        pricing: "Starting from $1,500/month for local SEO. Enterprise packages available.",
        timeline: "3-6 months to see significant results, ongoing optimization required"
      }
    },
    {
      icon: Target,
      title: "Search Engine Marketing (SEM)",
      description: "Drive targeted traffic and maximize ROI through strategic paid advertising campaigns across search platforms.",
      features: ["Google Ads", "Campaign Management", "Conversion Tracking", "Performance Analysis"],
      detailedInfo: {
        overview: "Our SEM service helps you get immediate visibility in search results through strategic paid advertising. We create and manage high-performing campaigns that drive qualified traffic and maximize your return on ad spend.",
        benefits: [
          "Immediate visibility in search results",
          "Highly targeted traffic and leads",
          "Complete control over budget and spending",
          "Detailed performance tracking and analytics",
          "A/B testing for optimal campaign performance",
          "Remarketing to convert previous visitors",
          "Geographic and demographic targeting",
          "Quick scalability based on performance"
        ],
        process: [
          "Campaign Strategy: Develop comprehensive paid search strategy",
          "Keyword Research: Identify high-converting keywords for your campaigns",
          "Ad Creation: Write compelling ad copy that drives clicks and conversions",
          "Landing Page Optimization: Ensure landing pages convert visitors effectively",
          "Campaign Launch: Set up and launch campaigns with proper tracking",
          "Monitoring & Optimization: Continuously optimize for better performance"
        ],
        pricing: "Management fee starting from $500/month + ad spend budget",
        timeline: "Campaigns can be live within 1-2 weeks, optimization is ongoing"
      }
    },
    {
      icon: Users,
      title: "Social Media Marketing",
      description: "Build brand awareness and engage your audience across all major social media platforms with strategic content.",
      features: ["Content Strategy", "Community Management", "Paid Social Ads", "Analytics & Reporting"],
      detailedInfo: {
        overview: "Our social media marketing service helps you build a strong presence across all major social platforms. We create engaging content, manage your communities, and run targeted advertising campaigns to grow your brand and drive business results.",
        benefits: [
          "Increased brand awareness and recognition",
          "Higher engagement with your target audience",
          "More website traffic from social platforms",
          "Improved customer relationships and loyalty",
          "Lead generation through social channels",
          "Crisis management and reputation protection",
          "Competitive advantage in your industry",
          "Measurable ROI from social media efforts"
        ],
        process: [
          "Social Media Audit: Analyze current social presence and opportunities",
          "Strategy Development: Create comprehensive social media strategy",
          "Content Planning: Develop content calendar and creative assets",
          "Community Management: Engage with followers and manage interactions",
          "Paid Advertising: Run targeted social media ad campaigns",
          "Analytics & Reporting: Track performance and optimize strategies"
        ],
        pricing: "Starting from $1,200/month for basic social media management",
        timeline: "Strategy development: 1-2 weeks, ongoing management and optimization"
      }
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description: "Provide exceptional customer service and support to enhance customer satisfaction and retention.",
      features: ["24/7 Support", "Multi-channel Service", "Live Chat", "Help Desk Solutions"],
      detailedInfo: {
        overview: "Our customer support service ensures your customers receive exceptional service at every touchpoint. We provide comprehensive support solutions that enhance customer satisfaction, reduce churn, and drive business growth through superior customer experiences.",
        benefits: [
          "24/7 availability for customer inquiries",
          "Multi-channel support (phone, email, chat, social)",
          "Faster response times and resolution",
          "Improved customer satisfaction scores",
          "Reduced customer churn and increased retention",
          "Professional, trained support representatives",
          "Detailed reporting and analytics",
          "Scalable solutions that grow with your business"
        ],
        process: [
          "Needs Assessment: Analyze your current support needs and challenges",
          "System Setup: Implement support tools and communication channels",
          "Team Training: Train support representatives on your products/services",
          "Process Development: Create support workflows and procedures",
          "Launch & Monitoring: Begin support operations with continuous monitoring",
          "Optimization: Regular review and improvement of support processes"
        ],
        pricing: "Starting from $800/month for basic support package",
        timeline: "Setup: 1-2 weeks, ongoing support operations"
      }
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 px-2">
            Our Premium Services
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            We offer comprehensive digital solutions to help your business thrive in the competitive online landscape
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 sm:bg-white dark:bg-gray-700 rounded-xl shadow-md sm:shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-8 group hover:transform hover:scale-105 relative overflow-hidden">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 sm:mb-6 group-hover:from-purple-600 group-hover:to-blue-500 transition-all duration-300">
                <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">
                {service.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => openModal(service)}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 relative z-10"
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <ServiceModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        service={selectedService}
      />
    </section>
  );
};

export default Services;