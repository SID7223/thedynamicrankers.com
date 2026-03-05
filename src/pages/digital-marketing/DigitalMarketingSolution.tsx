import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const DigitalMarketingSolution = () => {
  return (
    <>
      <Helmet>
        <title>Full-Stack Digital Marketing Solutions | The Dynamic Rankers</title>
        <meta name="description" content="Discover comprehensive digital marketing solutions tailored to your business needs. We integrate SEO, content, and paid media into a single high-performance growth engine." />
        <meta property="og:title" content="Full-Stack Digital Marketing Solutions | The Dynamic Rankers" />
        <meta property="og:description" content="Discover comprehensive digital marketing solutions tailored to your business needs. We integrate SEO, content, and paid media into a single high-performance growth engine." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Digital Marketing Solution
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              The Dynamic Rankers provides comprehensive digital marketing solutions designed specifically 
              for businesses in the USA. Our proven strategies help you reach your target audience, 
              increase brand awareness, and drive sustainable growth.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Our Complete Digital Marketing Approach
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Search Engine Optimization (SEO)
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Improve your website's visibility in search results with our advanced SEO techniques 
                  tailored for the USA market.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Pay-Per-Click Advertising (PPC)
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Drive immediate traffic and conversions with targeted PPC campaigns across 
                  Google Ads and social media platforms.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Social Media Marketing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Build brand awareness and engage with your audience across all major 
                  social media platforms popular in the USA.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Content Marketing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create valuable, relevant content that attracts and retains your target 
                  audience while driving profitable customer action.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Why Choose The Dynamic Rankers?
            </h2>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-8">
              <li>Proven track record with USA businesses across various industries</li>
              <li>Data-driven strategies that deliver measurable results</li>
              <li>Customized solutions tailored to your specific business goals</li>
              <li>Transparent reporting and regular performance updates</li>
              <li>Dedicated account management and ongoing support</li>
            </ul>
            
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Ready to Transform Your Digital Presence?</h3>
              <p className="mb-4">
                Contact The Dynamic Rankers today to discuss your digital marketing needs and 
                discover how we can help your USA business thrive online.
              </p>
              <Link 
                to="/book-a-call-meeting"
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DigitalMarketingSolution;
