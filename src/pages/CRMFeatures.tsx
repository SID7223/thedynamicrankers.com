import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Users, Database, BarChart3, Zap, Shield, Globe, 
  MessageSquare, Calendar, FileText, Target, 
  TrendingUp, Clock, CheckCircle 
} from 'lucide-react';

const CRMFeatures = () => {
  const coreFeatures = [
    {
      icon: Users,
      title: "Contact Management",
      description: "Centralized customer database with complete interaction history, preferences, and communication logs.",
      benefits: ["360° customer view", "Interaction timeline", "Custom fields", "Duplicate detection"]
    },
    {
      icon: Target,
      title: "Lead Management",
      description: "Capture, score, and nurture leads automatically from all marketing channels and touchpoints.",
      benefits: ["Auto lead capture", "AI scoring", "Lead routing", "Conversion tracking"]
    },
    {
      icon: BarChart3,
      title: "Sales Pipeline",
      description: "Visual pipeline management with customizable stages, forecasting, and performance analytics.",
      benefits: ["Visual pipelines", "Revenue forecasting", "Stage automation", "Win/loss analysis"]
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "Automate repetitive tasks, follow-ups, and processes to maximize team productivity.",
      benefits: ["Task automation", "Email sequences", "Trigger-based actions", "Custom workflows"]
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Unified communication center for emails, calls, meetings, and social media interactions.",
      benefits: ["Email integration", "Call logging", "Meeting scheduler", "Social monitoring"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics with real-time dashboards and custom metrics.",
      benefits: ["Real-time dashboards", "Custom reports", "Performance metrics", "ROI tracking"]
    }
  ];

  const advancedFeatures = [
    {
      icon: Globe,
      title: "Multi-Channel Integration",
      description: "Connect with websites, social media, email platforms, and advertising channels for complete visibility."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, role-based access control, and compliance with industry standards."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered appointment scheduling with automatic reminders and calendar synchronization."
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Store, organize, and share documents with version control and access permissions."
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "AI-driven insights that predict customer behavior and identify growth opportunities."
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Track time spent on activities, projects, and client interactions for accurate billing."
    }
  ];

  return (
    <>
      <Helmet>
        <title>CRM Features - The Dynamic Rankers</title>
        <meta name="description" content="Explore comprehensive CRM features including lead management, sales automation, analytics, and integrations. Transform your customer relationships with The Dynamic Rankers." />
        <meta name="keywords" content="CRM features, lead management, sales automation, customer management, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Comprehensive CRM Features
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Discover the powerful features that make The Dynamic Rankers CRM 
                the perfect solution for managing customer relationships and driving sales growth.
              </p>
              <Link 
                to="/crm#demo"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>See Features in Action</span>
              </Link>
            </div>
          </section>

          {/* Core Features */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Core CRM Capabilities
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Essential features that form the foundation of effective customer relationship management.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {coreFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start space-x-6">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg flex-shrink-0">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {feature.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Advanced Features
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Powerful additional capabilities that set our CRM apart from the competition.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {advancedFeatures.map((feature, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Feature Comparison */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Why Choose Our CRM?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  See how The Dynamic Rankers CRM compares to other solutions in the market.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="grid grid-cols-4 gap-0">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 font-bold">
                      Features
                    </div>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 font-bold text-center">
                      Dynamic Rankers
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-4 font-bold text-center">
                      Competitor A
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-4 font-bold text-center">
                      Competitor B
                    </div>

                    {/* Rows */}
                    {[
                      ['AI-Powered Lead Scoring', '✓', '✗', '✗'],
                      ['24/7 Support', '✓', 'Limited', '✗'],
                      ['Custom Integrations', '✓', 'Limited', '✓'],
                      ['Mobile App', '✓', '✓', 'Basic'],
                      ['Advanced Analytics', '✓', 'Basic', '✓'],
                      ['Workflow Automation', '✓', 'Limited', 'Basic']
                    ].map((row, index) => (
                      <React.Fragment key={index}>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-800 dark:text-white">
                          {row[0]}
                        </div>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-600 text-center">
                          <span className="text-green-600 font-bold text-lg">{row[1]}</span>
                        </div>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-600 text-center text-gray-600 dark:text-gray-400">
                          {row[2]}
                        </div>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-600 text-center text-gray-600 dark:text-gray-400">
                          {row[3]}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Experience These Features?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                See how our comprehensive CRM features can transform your business operations 
                and drive unprecedented growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/crm#demo"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Request Demo</span>
                </Link>
                
                <Link
                  to="/book-a-call-meeting"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <span>Talk to Expert</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default CRMFeatures;
