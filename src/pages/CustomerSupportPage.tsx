import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const CustomerSupportPage = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Set initial dark mode state
    setIsDark(document.documentElement.classList.contains('dark'));

    // Mouse tracking for radial gradient focus
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--x', `${x}%`);
      document.documentElement.style.setProperty('--y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const backgroundStyle = {
    background: isDark
      ? 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), #1a202c, #2d3748)'
      : 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), #0bc5ea, #319795)',
    backgroundSize: '400% 400%',
    transition: 'background-position 0.2s ease',
  };

  return (
    <>
      <Helmet>
        <title>Customer Support | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' Customer Support service with performance visuals and clean design." />
        <meta name="keywords" content="customer support, live chat, AI bots, CRM automation, ticket resolution, The Dynamic Rankers" />
      </Helmet>

      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          background: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), #0bc5ea, #319795)',
          backgroundSize: '400% 400%',
          transition: 'background-position 0.2s',
        }}
      >
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-transparent">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Customer Support
              </h1>
              <p className="text-lg sm:text-xl text-teal-100 max-w-3xl mx-auto mb-8">
                Dynamic Rankers delivers exceptional customer support with AI-powered chatbots and 24/7 service. 
                Our digital solutions enhance customer satisfaction through Apple-level user experience design.
              </p>
            </div>
          </section>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <picture>
                  <source
                    srcSet="
                      https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                      https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                      https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                    "
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                    type="image/webp"
                  />
                  <img 
                    src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                    alt="The Dynamic Rankers – Customer Support"
                    title="Customer Support | The Dynamic Rankers"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                    width="1200"
                    height="600"
                  />
                </picture>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                  Complete Customer Support Solutions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      24/7 Live Chat Support
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Round-the-clock customer assistance with <Link to="/definitions/ticket-resolution" className="text-teal-600 hover:text-teal-800 underline">ticket resolution</Link> 
                      systems that ensure no customer inquiry goes unanswered.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      AI-Powered Chatbots
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Intelligent AI chatbots that provide instant responses and handle routine inquiries, 
                      seamlessly integrating with human agents for complex support needs.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      CRM Automation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Advanced CRM automation that tracks customer interactions across all digital 
                      marketing channels, ensuring personalized and efficient support experiences.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Premium 24/7 Service
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Comprehensive <Link to="/definitions/24-7-service" className="text-teal-600 hover:text-teal-800 underline">24/7 service</Link> 
                      coverage with Google-level reliability and Apple-inspired user experience design.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Support Channel Integration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <h4 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">Live Chat</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Instant website support</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Email</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Detailed support responses</p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <h4 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-3">Phone</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Direct voice support</p>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <h4 className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-3">Social Media</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Social platform assistance</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Our Support Philosophy
                </h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Proactive Communication</h4>
                      <p className="text-gray-600 dark:text-gray-300">We anticipate customer needs and reach out before issues become problems.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Personalized Solutions</h4>
                      <p className="text-gray-600 dark:text-gray-300">Every customer interaction is tailored to their specific needs and history.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Continuous Improvement</h4>
                      <p className="text-gray-600 dark:text-gray-300">We analyze support data to continuously enhance our service quality and response times.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Satisfaction Guarantee</h4>
                      <p className="text-gray-600 dark:text-gray-300">We're not satisfied until you are - every interaction is an opportunity to exceed expectations.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Support Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600 mb-2">&lt;2 min</div>
                      <p className="text-gray-600 dark:text-gray-300">Average response time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600 mb-2">98%</div>
                      <p className="text-gray-600 dark:text-gray-300">Customer satisfaction rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
                      <p className="text-gray-600 dark:text-gray-300">Available every day</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Experience World-Class Support</h3>
                  <p className="mb-6">
                    Transform your customer experience with Dynamic Rankers' comprehensive support solutions. 
                    Our AI-powered tools and dedicated team ensure every customer interaction builds lasting relationships.
                  </p>
                  <Link 
                    to="/book-a-call-meeting" 
                    className="inline-block bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Support Solutions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CustomerSupportPage;
