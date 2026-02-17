import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Home, Heart, ShoppingCart, Briefcase, Factory, 
  Laptop, DollarSign, GraduationCap, CheckCircle, ArrowRight 
} from 'lucide-react';
import CRMHeader from '../components/CRMHeader';
import CRMFooter from '../components/CRMFooter';

const CRMIndustries = () => {
  const industries = [
    {
      icon: Home,
      name: "Real Estate",
      description: "Manage property listings, client relationships, and sales pipelines with specialized real estate CRM features.",
      features: [
        "Property listing management",
        "Client preference tracking",
        "Automated follow-up sequences",
        "Commission tracking",
        "Market analysis integration"
      ],
      caseStudy: {
        client: "Elite Properties Group",
        result: "+350% lead conversion rate",
        details: "Reduced lead response time from 4 hours to 15 minutes, resulting in 3.5x more closed deals."
      },
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Heart,
      name: "Healthcare",
      description: "HIPAA-compliant patient management with appointment scheduling, treatment tracking, and communication tools.",
      features: [
        "Patient record management",
        "Appointment scheduling",
        "Treatment history tracking",
        "Insurance verification",
        "HIPAA compliance"
      ],
      caseStudy: {
        client: "Advanced Medical Center",
        result: "+280% patient retention",
        details: "Improved patient communication and follow-up care, leading to higher satisfaction and retention rates."
      },
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: ShoppingCart,
      name: "E-commerce",
      description: "Customer lifecycle management with order tracking, inventory integration, and personalized marketing automation.",
      features: [
        "Customer lifecycle tracking",
        "Order history integration",
        "Inventory management",
        "Personalized recommendations",
        "Abandoned cart recovery"
      ],
      caseStudy: {
        client: "Fashion Forward Store",
        result: "+400% customer lifetime value",
        details: "Implemented personalized marketing campaigns that increased repeat purchases and customer loyalty."
      },
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Briefcase,
      name: "Professional Services",
      description: "Client project management, billing integration, and service delivery workflow automation.",
      features: [
        "Project management integration",
        "Time tracking and billing",
        "Service delivery workflows",
        "Contract management",
        "Performance reporting"
      ],
      caseStudy: {
        client: "Consulting Excellence LLC",
        result: "+220% client satisfaction",
        details: "Streamlined project delivery and communication, resulting in higher client satisfaction and referrals."
      },
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Factory,
      name: "Manufacturing",
      description: "B2B relationship management with supply chain integration, order processing, and quality tracking.",
      features: [
        "Supplier relationship management",
        "Order processing automation",
        "Quality control tracking",
        "Inventory coordination",
        "Production scheduling"
      ],
      caseStudy: {
        client: "Precision Manufacturing Co",
        result: "+180% operational efficiency",
        details: "Automated order processing and supplier communication, reducing manual work by 18 hours per week."
      },
      color: "from-gray-500 to-slate-600"
    },
    {
      icon: Laptop,
      name: "Technology",
      description: "Software and tech company CRM with product usage tracking, support ticket integration, and user analytics.",
      features: [
        "Product usage analytics",
        "Support ticket integration",
        "User behavior tracking",
        "Feature adoption monitoring",
        "Churn prediction"
      ],
      caseStudy: {
        client: "TechFlow Solutions",
        result: "+300% user engagement",
        details: "Identified usage patterns and implemented targeted campaigns that increased product adoption."
      },
      color: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tailored CRM Solutions for Every Industry | The Dynamic Rankers</title>
        <meta name="description" content="Our CRM is built to adapt to your specific industry needs. Whether you are in real estate, finance, or retail, we help you manage customer relationships with ease." />
        <meta property="og:title" content="Tailored CRM Solutions for Every Industry | The Dynamic Rankers" />
        <meta property="og:description" content="Our CRM is built to adapt to your specific industry needs. Whether you are in real estate, finance, or retail, we help you manage customer relationships with ease." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <CRMHeader />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                CRM Solutions by Industry
              </h1>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                Tailored CRM features and workflows designed specifically for your industry's 
                unique challenges and requirements.
              </p>
            </div>
          </section>

          {/* Industries Grid */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="space-y-16">
                {industries.map((industry, index) => (
                  <div key={index} className={`${index % 2 === 0 ? '' : 'lg:flex-row-reverse'} flex flex-col lg:flex-row items-center gap-12`}>
                    <div className="lg:w-1/2">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`bg-gradient-to-r ${industry.color} p-4 rounded-lg`}>
                          <industry.icon className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                          {industry.name}
                        </h2>
                      </div>
                      
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {industry.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Key Features for {industry.name}:
                        </h3>
                        {industry.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link 
                        to="/crm#demo"
                        className={`inline-flex items-center space-x-2 bg-gradient-to-r ${industry.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                      >
                        <span>See {industry.name} Demo</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>

                    <div className="lg:w-1/2">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          Success Story: {industry.caseStudy.client}
                        </h3>
                        
                        <div className={`bg-gradient-to-r ${industry.color} text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block`}>
                          {industry.caseStudy.result}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {industry.caseStudy.details}
                        </p>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Implementation Time:</span>
                            <span className="font-semibold text-gray-800 dark:text-white">2-4 weeks</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-gray-500 dark:text-gray-400">ROI Timeline:</span>
                            <span className="font-semibold text-gray-800 dark:text-white">3-6 months</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Transform Your Industry Operations?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Get a personalized demo showing exactly how our CRM works for your specific industry.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/crm#demo"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>Get Industry-Specific Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        </main>
        <CRMFooter />
      </div>
    </>
  );
};

export default CRMIndustries;
