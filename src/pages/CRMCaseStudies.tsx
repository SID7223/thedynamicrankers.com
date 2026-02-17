import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Users, DollarSign, Clock, 
  CheckCircle, ArrowRight, BarChart3, Target 
} from 'lucide-react';
import CRMHeader from '../components/CRMHeader';
import CRMFooter from '../components/CRMFooter';

const CRMCaseStudies = () => {
  const caseStudies = [
    {
      company: "Elite Real Estate Group",
      industry: "Real Estate",
      location: "Austin, Texas",
      teamSize: "25 agents",
      challenge: "Losing 40% of leads due to poor follow-up and manual processes. Agents were spending 60% of their time on administrative tasks instead of selling.",
      solution: "Implemented automated lead capture, AI-powered lead scoring, and automated follow-up sequences. Integrated with their website and social media channels.",
      results: {
        leadConversion: "+350%",
        timesSaved: "20 hours/week",
        revenueGrowth: "+$2.4M annually",
        agentProductivity: "+180%"
      },
      timeline: "6 weeks implementation, results within 30 days",
      testimonial: "The Dynamic Rankers CRM transformed our entire operation. We went from losing leads to converting them at an incredible rate. Our agents are happier and more productive than ever.",
      contact: "Jennifer Martinez, Sales Director",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&fm=webp"
    },
    {
      company: "Advanced Medical Center",
      industry: "Healthcare",
      location: "Miami, Florida",
      teamSize: "45 staff members",
      challenge: "Patient appointment no-shows were 35%, follow-up care was inconsistent, and patient satisfaction scores were declining due to communication gaps.",
      solution: "Deployed HIPAA-compliant CRM with automated appointment reminders, patient communication workflows, and treatment tracking systems.",
      results: {
        patientRetention: "+280%",
        noShowReduction: "-65%",
        satisfactionScore: "+45%",
        operationalEfficiency: "+200%"
      },
      timeline: "8 weeks implementation, HIPAA compliance verified",
      testimonial: "Patient care has never been more organized. Our staff can focus on what matters most - providing excellent healthcare - while the CRM handles the administrative complexity.",
      contact: "Dr. Michael Chen, Medical Director",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&fm=webp"
    },
    {
      company: "TechFlow Solutions",
      industry: "B2B Software",
      location: "San Francisco, California",
      teamSize: "80 employees",
      challenge: "Complex B2B sales cycles were difficult to track, customer onboarding was inconsistent, and churn rates were higher than industry average.",
      solution: "Implemented enterprise CRM with custom B2B workflows, customer success tracking, and predictive analytics for churn prevention.",
      results: {
        salesCycleReduction: "-40%",
        customerChurn: "-55%",
        upsellRevenue: "+320%",
        teamProductivity: "+150%"
      },
      timeline: "12 weeks implementation with custom integrations",
      testimonial: "The CRM gave us complete visibility into our customer journey. We can now predict and prevent churn while identifying upsell opportunities we never saw before.",
      contact: "Sarah Thompson, VP of Sales",
      image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&fm=webp"
    }
  ];

  const metrics = [
    { icon: TrendingUp, label: "Average Revenue Growth", value: "+285%" },
    { icon: Users, label: "Customer Retention Improvement", value: "+240%" },
    { icon: Clock, label: "Time Savings Per Week", value: "18 hours" },
    { icon: Target, label: "Lead Conversion Increase", value: "+310%" }
  ];

  return (
    <>
      <Helmet>
        <title>Real Results: CRM Success Stories | The Dynamic Rankers</title>
        <meta name="description" content="See how businesses like yours have achieved record growth with our CRM. Explore case studies of improved sales efficiency and customer satisfaction." />
        <meta property="og:title" content="Real Results: CRM Success Stories | The Dynamic Rankers" />
        <meta property="og:description" content="See how businesses like yours have achieved record growth with our CRM. Explore case studies of improved sales efficiency and customer satisfaction." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <CRMHeader />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                CRM Success Stories
              </h1>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                Real businesses, real results. See how The Dynamic Rankers CRM has transformed 
                operations and driven growth across different industries.
              </p>
            </div>
          </section>

          {/* Metrics Overview */}
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Proven Results Across All Industries
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {metrics.map((metric, index) => (
                  <div key={index} className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <metric.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {metric.value}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Case Studies */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="space-y-20">
                {caseStudies.map((study, index) => (
                  <div key={index} className="max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden">
                      <div className={`bg-gradient-to-r ${study.color} text-white p-8`}>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                          <div>
                            <h2 className="text-3xl font-bold mb-2">{study.company}</h2>
                            <div className="flex items-center space-x-4 text-sm opacity-90">
                              <span>{study.industry}</span>
                              <span>•</span>
                              <span>{study.location}</span>
                              <span>•</span>
                              <span>{study.teamSize}</span>
                            </div>
                          </div>
                          <img 
                            src={study.image}
                            alt={study.company}
                            className="w-20 h-20 rounded-full object-cover mt-4 lg:mt-0"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                              The Challenge
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                              {study.challenge}
                            </p>

                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                              Our Solution
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {study.solution}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                              Results Achieved
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              {Object.entries(study.results).map(([key, value], resultIndex) => (
                                <div key={resultIndex} className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 text-center">
                                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                    {value}
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div className="bg-blue-50 dark:bg-gray-600 rounded-lg p-4 mb-6">
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <strong>Implementation:</strong> {study.timeline}
                              </p>
                            </div>

                            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300">
                              "{study.testimonial}"
                              <footer className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                — {study.contact}
                              </footer>
                            </blockquote>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ROI Calculator Section */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Calculate Your Potential ROI
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
                  Based on our case studies, estimate the potential impact of our CRM on your business.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                      <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        Average Lead Increase
                      </h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        +285%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        More qualified leads from better management
                      </p>
                    </div>

                    <div>
                      <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        Revenue Growth
                      </h3>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        +$1.8M
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Average annual revenue increase
                      </p>
                    </div>

                    <div>
                      <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        Time Savings
                      </h3>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        19 hrs
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Weekly time savings per team member
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Process */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Our Proven Implementation Process
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Based on successful implementations across industries, we've refined our process 
                  to ensure smooth deployment and rapid results.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="space-y-8">
                  {[
                    {
                      week: "Week 1-2",
                      title: "Discovery & Planning",
                      description: "Analyze current processes, identify pain points, and design custom workflows tailored to your industry.",
                      deliverables: ["Process audit", "Custom workflow design", "Integration planning", "Team training schedule"]
                    },
                    {
                      week: "Week 3-4",
                      title: "Setup & Configuration",
                      description: "Configure CRM settings, import existing data, set up integrations, and customize dashboards.",
                      deliverables: ["Data migration", "System configuration", "Integration setup", "Custom field creation"]
                    },
                    {
                      week: "Week 5-6",
                      title: "Training & Launch",
                      description: "Comprehensive team training, soft launch with pilot group, and full deployment with ongoing support.",
                      deliverables: ["Team training", "Pilot testing", "Full deployment", "Support documentation"]
                    },
                    {
                      week: "Week 7-8",
                      title: "Optimization & Support",
                      description: "Monitor performance, optimize workflows, and provide ongoing support to ensure maximum ROI.",
                      deliverables: ["Performance analysis", "Workflow optimization", "Advanced training", "Success metrics review"]
                    }
                  ].map((phase, index) => (
                    <div key={index} className="flex items-start space-x-6">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {phase.title}
                          </h3>
                          <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium">
                            {phase.week}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {phase.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {phase.deliverables.map((deliverable, deliverableIndex) => (
                            <div key={deliverableIndex} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join the growing list of businesses that have transformed their operations 
                with The Dynamic Rankers CRM.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/crm#demo"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>Start Your Transformation</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link
                  to="/book-a-call-meeting"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <span>Speak with Expert</span>
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

export default CRMCaseStudies;
