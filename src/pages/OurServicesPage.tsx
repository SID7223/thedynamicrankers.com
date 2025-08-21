import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const OurServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Services | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' Our Services with performance visuals and clean design." />
        <meta name="keywords" content="digital services, web development, SEO, social media marketing, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Our Services
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Dynamic Rankers delivers comprehensive digital transformation solutions for modern businesses. 
                Our multi-channel strategy leverages AI-powered tools and Apple-level precision to drive results.
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
                      https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                      https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                      https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                    "
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                    type="image/webp"
                  />
                  <img 
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                    alt="The Dynamic Rankers – Our Services"
                    title="Our Services | The Dynamic Rankers"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                    width="1200"
                    height="600"
                  />
                </picture>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                  Complete Digital Marketing Solutions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Website Development
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Custom websites with Google-optimized performance and Apple-inspired design aesthetics.
                    </p>
                    <Link to="/website-development" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Learn More →
                    </Link>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      SEO Services
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Technical audits and optimization strategies that boost your search rankings.
                    </p>
                    <Link to="/seo-services" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Learn More →
                    </Link>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Social Media Marketing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Strategic social media campaigns that build your brand across all major platforms.
                    </p>
                    <Link to="/social-media-marketing" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Learn More →
                    </Link>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Search Engine Marketing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      AI-powered PPC campaigns and Google Ads management for maximum ROI.
                    </p>
                    <Link to="/search-engine-marketing" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Learn More →
                    </Link>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Customer Support
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      24/7 customer support solutions with AI chatbots and CRM automation.
                    </p>
                    <Link to="/customer-support" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Learn More →
                    </Link>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Digital Transformation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Complete business transformation with <Link to="/definitions/digital-transformation" className="text-blue-600 hover:text-blue-800 underline">digital transformation</Link> strategies.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Why Choose Dynamic Rankers?</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                      <span>Comprehensive <Link to="/definitions/multi-channel-strategy" className="text-blue-200 hover:text-white underline">multi-channel strategy</Link> approach</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                      <span>AI-powered marketing automation and analytics</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                      <span>Apple-level design quality with Google-optimized performance</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                      <span>Proven results across all digital marketing channels</span>
                    </li>
                  </ul>
                  <Link 
                    to="/book-a-call-meeting" 
                    className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Started Today
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

export default OurServicesPage;
