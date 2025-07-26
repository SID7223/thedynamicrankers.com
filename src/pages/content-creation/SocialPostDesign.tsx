import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SocialPostDesign = () => {
  return (
    <>
      <Helmet>
        <title>Social Post Design | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' take on Social Post Design with expert insight, visual clarity, and SEO-optimized strategy." />
        <meta name="keywords" content="social media design, visual hierarchy, brand consistency, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Social Post Design
          </h1>
          
          <div className="mb-8">
            <img 
              src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
              alt="The Dynamic Rankers – Social Post Design"
              title="Social Post Design | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Dynamic Rankers creates scroll-stopping social media designs with Apple-inspired aesthetics 
              and Google-optimized engagement strategies. Our visual content drives digital marketing success 
              through compelling carousel formats, story-based visuals, and AI-powered brand consistency.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Visual Content Excellence
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Carousel Post Design
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create engaging multi-slide content that tells your brand story across Instagram, 
                  LinkedIn, and Facebook with Dynamic visual flow and strategic call-to-actions.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Story-Based Visuals
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Design compelling Instagram and Facebook stories that capture attention with 
                  Apple-level aesthetics and drive traffic to your digital marketing funnels.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Design Strategy & Branding
            </h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong>Strategic <Link to="/definitions/visual-hierarchy" className="text-orange-600 hover:text-orange-800 underline">Visual Hierarchy</Link>:</strong> 
                  Guide viewer attention with Google-approved design principles that maximize engagement across all social media platforms
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong>Consistent <Link to="/definitions/brand-consistency" className="text-orange-600 hover:text-orange-800 underline">Brand Consistency</Link>:</strong> 
                  Maintain Rankers-level brand recognition with cohesive visual elements that strengthen your digital marketing identity
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong>Platform Optimization:</strong> Tailor designs for optimal performance on Instagram, Facebook, LinkedIn, TikTok, and other social channels
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong>AI-Enhanced Graphics:</strong> Leverage artificial intelligence to create stunning visuals that outperform competitors and drive engagement
                </div>
              </li>
            </ul>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Design That Drives Results</h3>
              <p className="mb-4">
                Transform your social media presence with professional designs that capture attention, 
                build brand recognition, and convert followers into customers.
              </p>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Design Social Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialPostDesign;