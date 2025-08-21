import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SearchEngineMarketingPage = () => {
  return (
    <>
      <Helmet>
        <title>Search Engine Marketing | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' Search Engine Marketing service with performance visuals and clean design." />
        <meta name="keywords" content="search engine marketing, Google Ads, PPC optimization, conversion funnel, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-orange-600 to-red-700">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Search Engine Marketing
              </h1>
              <p className="text-lg sm:text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                Dynamic Rankers delivers precision Google Ads campaigns with AI-powered optimization. 
                Our strategic digital marketing approach maximizes ROI through expert PPC management.
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
                      https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                      https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                      https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                    "
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                    type="image/webp"
                  />
                  <img 
                    src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                    alt="The Dynamic Rankers – Search Engine Marketing"
                    title="Search Engine Marketing | The Dynamic Rankers"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                    width="1200"
                    height="600"
                  />
                </picture>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                  Professional PPC Management
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Google Ads Optimization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Expert Google Ads management with Apple-level precision targeting and 
                      AI-powered optimization for maximum campaign performance and ROI.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Advanced Bid Strategy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Strategic <Link to="/definitions/bid-strategy" className="text-orange-600 hover:text-orange-800 underline">bid strategy</Link> 
                      optimization that maximizes ad spend efficiency across all digital marketing channels.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Conversion Funnel Design
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Optimized <Link to="/definitions/conversion-funnel" className="text-orange-600 hover:text-orange-800 underline">conversion funnel</Link> 
                      architecture that guides prospects through each stage of the buying journey.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Social Media Advertising
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Integrated social media advertising campaigns that complement Google Ads 
                      for comprehensive digital marketing coverage and enhanced reach.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Our SEM Strategy
                </h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Market Research & Analysis</h4>
                      <p className="text-gray-600 dark:text-gray-300">Comprehensive market analysis and competitor research to identify optimal targeting opportunities.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Campaign Setup & Launch</h4>
                      <p className="text-gray-600 dark:text-gray-300">Strategic campaign architecture with precise targeting and compelling ad creative development.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Optimization & Testing</h4>
                      <p className="text-gray-600 dark:text-gray-300">Continuous A/B testing and optimization to improve performance and reduce cost per acquisition.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Performance Tracking</h4>
                      <p className="text-gray-600 dark:text-gray-300">Detailed analytics and reporting with actionable insights for continuous improvement.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">SEM Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">400%</div>
                      <p className="text-gray-600 dark:text-gray-300">Average ROI improvement</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">65%</div>
                      <p className="text-gray-600 dark:text-gray-300">Cost per click reduction</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">250%</div>
                      <p className="text-gray-600 dark:text-gray-300">Conversion rate increase</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Accelerate Your Growth with SEM</h3>
                  <p className="mb-6">
                    Transform your online presence with Dynamic Rankers' expert search engine marketing. 
                    Our data-driven approach delivers immediate results and sustainable growth through AI-powered optimization.
                  </p>
                  <Link 
                    to="/book-a-call-meeting" 
                    className="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Launch Campaign
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

export default SearchEngineMarketingPage;
