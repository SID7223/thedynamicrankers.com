import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Zap, Shield, ArrowRight, CheckCircle, Star, Play } from 'lucide-react';
import CRMHeader from '../components/CRMHeader';
import CRMFooter from '../components/CRMFooter';

const CRMPage = () => {

  const features = [
    {
      icon: Users,
      title: "Customer Management",
      description: "Centralize all customer data, interactions, and communication history in one powerful dashboard."
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Track performance metrics, conversion rates, and revenue trends with real-time reporting."
    },
    {
      icon: Zap,
      title: "Automation Tools",
      description: "Automate follow-ups, lead scoring, and workflow processes to maximize efficiency."
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security ensures your customer data is protected with bank-level encryption."
    }
  ];

  const industries = [
    {
      name: "Real Estate",
      description: "Manage leads, track property inquiries, and automate follow-ups for higher conversion rates.",
      growth: "+350% Lead Conversion"
    },
    {
      name: "Healthcare",
      description: "Patient management, appointment scheduling, and HIPAA-compliant communication systems.",
      growth: "+280% Patient Retention"
    },
    {
      name: "E-commerce",
      description: "Customer lifecycle management, order tracking, and personalized marketing automation.",
      growth: "+400% Customer Lifetime Value"
    },
    {
      name: "Professional Services",
      description: "Client project management, billing integration, and automated service delivery workflows.",
      growth: "+220% Client Satisfaction"
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Martinez",
      company: "Elite Real Estate Group",
      text: "The Dynamic Rankers CRM transformed our lead management. We went from losing 40% of leads to converting 85% of them. The automation features saved us 20 hours per week.",
      rating: 5,
      results: "+350% Lead Conversion",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&fm=webp"
    },
    {
      name: "Dr. Michael Chen",
      company: "Advanced Medical Center",
      text: "Patient management has never been easier. The CRM handles appointments, follow-ups, and patient communication seamlessly. Our patient satisfaction scores increased dramatically.",
      rating: 5,
      results: "+280% Patient Retention",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&fm=webp"
    },
    {
      name: "Sarah Thompson",
      company: "TechFlow Solutions",
      text: "The integration capabilities are outstanding. Our CRM now connects with our website, social media, and email marketing. Everything works together perfectly.",
      rating: 5,
      results: "+400% Efficiency Gain",
      image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&fm=webp"
    }
  ];

  return (
    <>
      <Helmet>
        <title>CRM Solutions - The Dynamic Rankers</title>
        <meta name="description" content="Powerful CRM solutions that transform customer relationships and drive business growth. Manage leads, automate workflows, and boost sales with The Dynamic Rankers CRM." />
        <meta name="keywords" content="CRM, customer relationship management, sales automation, lead management, The Dynamic Rankers" />
        <link rel="canonical" href="https://thedynamicrankers.com/crm" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <CRMHeader />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  Transform Customer Relationships with Our CRM
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  The Dynamic Rankers CRM solution helps businesses manage leads, automate workflows,
                  and boost sales with AI-powered insights and seamless integrations.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="#demo"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Demo</span>
                  </a>

                  <Link
                    to="/book-a-call-meeting"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Schedule Consultation</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
                    <div className="text-3xl font-bold mb-2">350%</div>
                    <p className="text-blue-100">Average Lead Conversion Increase</p>
                  </div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
                    <div className="text-3xl font-bold mb-2">20hrs</div>
                    <p className="text-blue-100">Weekly Time Savings</p>
                  </div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
                    <div className="text-3xl font-bold mb-2">99.9%</div>
                    <p className="text-blue-100">Uptime Guarantee</p>
                  </div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <p className="text-blue-100">Support Available</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Powerful CRM Features
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Everything you need to manage customer relationships, automate sales processes,
                  and grow your business efficiently.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Industries Section */}
          <section id="industries" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Industries We Serve
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Our CRM solutions are tailored for specific industry needs, delivering
                  measurable results across diverse business sectors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {industries.map((industry, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {industry.name}
                      </h3>
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                        {industry.growth}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {industry.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Client Success Stories
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  See how businesses across different industries have transformed their
                  customer relationships with our CRM solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                        <div className="flex space-x-1 mt-1">
                          {[...Array(testimonial.rating)].map((_, starIndex) => (
                            <Star key={starIndex} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      {testimonial.results}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Demo Section */}
          <section id="demo" className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  See Our CRM in Action
                </h2>
                <p className="text-xl text-blue-100 mb-12">
                  Experience the power of our CRM solution with a personalized demo
                  tailored to your industry and business needs.
                </p>

                {/* Demo Request Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    Request Your Personalized Demo
                  </h3>

                  <form
                    name="crm-demo-request"
                    method="POST"
                    action="/api/contact"
                    className="space-y-6"
                  >
                    <input type="hidden" name="redirect" value="/thank-you" />
                    <div style={{ display: 'none' }}>
                      <label>
                        Don't fill this out if you're human: <input name="bot-field" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="demo_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="demo_name"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="demo_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="demo_email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="demo_company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="demo_company"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <label htmlFor="demo_industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Industry *
                        </label>
                        <select
                          name="industry"
                          id="demo_industry"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select your industry</option>
                          <option value="real-estate">Real Estate</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="e-commerce">E-commerce</option>
                          <option value="professional-services">Professional Services</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="technology">Technology</option>
                          <option value="finance">Finance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="demo_team_size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Team Size
                      </label>
                      <select
                        name="teamSize"
                        id="demo_team_size"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select team size</option>
                        <option value="1-5">1-5 employees</option>
                        <option value="6-20">6-20 employees</option>
                        <option value="21-50">21-50 employees</option>
                        <option value="51-100">51-100 employees</option>
                        <option value="100+">100+ employees</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="demo_current_crm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current CRM Solution
                      </label>
                      <select
                        name="currentCRM"
                        id="demo_current_crm"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select current solution</option>
                        <option value="none">No CRM currently</option>
                        <option value="spreadsheets">Using spreadsheets</option>
                        <option value="salesforce">Salesforce</option>
                        <option value="hubspot">HubSpot</option>
                        <option value="pipedrive">Pipedrive</option>
                        <option value="zoho">Zoho CRM</option>
                        <option value="other">Other CRM</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="demo_challenges" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Challenges *
                      </label>
                      <textarea
                        name="challenges"
                        id="demo_challenges"
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="What challenges are you facing with customer management, lead tracking, or sales processes?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <Play className="w-5 h-5" />
                      <span>Request Personalized Demo</span>
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                      By submitting this form, you agree to receive communications from us. We respect your privacy and will never share your information.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Real-World Use Cases
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Discover how our CRM transforms business operations across different scenarios.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Lead Management Automation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Automatically capture leads from your website, social media, and advertising campaigns.
                      Our CRM scores leads based on behavior and routes them to the right sales team member.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Automatic lead capture from all sources
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        AI-powered lead scoring and prioritization
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Intelligent routing to sales team members
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Customer Communication Hub
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Centralize all customer communications including emails, calls, meetings, and social media
                      interactions in one unified timeline for complete relationship visibility.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unified communication timeline
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Email and call integration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Social media monitoring
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Sales Pipeline Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Visualize your entire sales process with customizable pipelines. Track deals,
                      forecast revenue, and identify bottlenecks to optimize your sales performance.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Visual pipeline management
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Revenue forecasting
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Performance analytics
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Marketing Integration
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Connect your CRM with all marketing channels including email campaigns,
                      social media, and advertising platforms for complete customer journey tracking.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Email marketing automation
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Social media integration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Campaign performance tracking
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Why Choose Our CRM?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">AI</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    AI-Powered Intelligence
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Machine learning algorithms that predict customer behavior, optimize sales processes,
                    and provide actionable insights for better decision-making.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">∞</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Seamless Integrations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Connect with 500+ business tools including email platforms, accounting software,
                    marketing automation, and social media management systems.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">24/7</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Expert Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Round-the-clock technical support, onboarding assistance, and strategic consulting
                    to ensure your CRM delivers maximum value for your business.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Transform Your Customer Relationships?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Join hundreds of businesses that have revolutionized their sales processes
                with The Dynamic Rankers CRM. Start your transformation today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#demo"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  <span>Get Free Demo</span>
                </a>

                <Link
                  to="/book-a-call-meeting"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Schedule Consultation</span>
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

export default CRMPage;
