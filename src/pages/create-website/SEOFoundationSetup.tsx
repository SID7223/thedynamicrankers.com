import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
const SEOFoundationSetup = () => {
  return (
    <>
      <Helmet>
        <title>SEO Foundation Setup | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' take on SEO Foundation Setup with expert insight, visual clarity, and SEO-optimized strategy." />
        <meta name="keywords" content="SEO foundation, structured data, technical SEO audit, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            SEO Foundation Setup
          </h1>
          
          <div className="mb-8">
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
                alt="The Dynamic Rankers – SEO Foundation Setup"
                title="SEO Foundation Setup | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Dynamic Rankers builds SEO foundations with Google-approved techniques and Apple-level precision. 
              Our comprehensive setup includes keyword research, schema markup, and core web vitals optimization 
              to ensure your digital marketing efforts achieve maximum visibility across all platforms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Complete SEO Architecture
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Keyword Research & Strategy
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Identify high-value keywords that drive traffic from Google search and social 
                  media discovery, creating a Dynamic foundation for long-term marketing success.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Core Web Vitals Optimization
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Achieve Apple-level performance standards with optimized loading speeds, 
                  interactivity, and visual stability that Google rewards with higher rankings.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Technical SEO Excellence
            </h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Advanced <Link to="/definitions/structured-data" className="text-blue-600 hover:text-blue-800 underline">Structured Data</Link> Implementation:</strong> 
                  <span className="text-gray-600 dark:text-white">Rich snippets and schema markup that help Google understand your content and boost social media sharing</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Comprehensive <Link to="/definitions/technical-seo-audit" className="text-blue-600 hover:text-blue-800 underline">Technical SEO Audit</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white">Identify and fix issues that prevent your digital marketing content from ranking at Rankers level</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Mobile-First Indexing:</strong> <span className="text-gray-600 dark:text-white">Ensure your website performs flawlessly on mobile devices with AI-optimized responsive design</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Site Architecture:</strong> <span className="text-gray-600 dark:text-white">Build logical URL structures and navigation that both users and search engines love</span>
                </div>
              </li>
            </ul>
            
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Build Unshakeable SEO Foundations</h3>
              <p className="mb-4">
                Start with a solid SEO foundation that supports all your digital marketing efforts 
                and delivers sustainable organic growth across every channel.
              </p>
              <Link 
                to="/book-a-call-meeting"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Setup SEO Foundation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SEOFoundationSetup;
