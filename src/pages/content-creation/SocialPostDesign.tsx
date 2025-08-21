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
            <picture>
              <source
                srcSet="
                  https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                  https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                  https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                "
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                type="image/webp"
              />
              <img 
                src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                alt="The Dynamic Rankers – Social Post Design"
                title="Social Post Design | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
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
                  <strong className="text-gray-900 dark:text-white">Strategic <Link to="/definitions/visual-hierarchy" className="text-orange-600 hover:text-orange-800 underline">Visual Hierarchy</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white">Guide viewer attention with Google-approved design principles that maximize engagement across all social media platforms</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Consistent <Link to="/definitions/brand-consistency" className="text-orange-600 hover:text-orange-800 underline">Brand Consistency</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white">Maintain Rankers-level brand recognition with cohesive visual elements that strengthen your digital marketing identity</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Platform Optimization:</strong> <span className="text-gray-600 dark:text-white">Tailor designs for optimal performance on Instagram, Facebook, LinkedIn, TikTok, and other social channels</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">AI-Enhanced Graphics:</strong> <span className="text-gray-600 dark:text-white">Leverage artificial intelligence to create stunning visuals that outperform competitors and drive engagement</span>
                </div>
              </li>
            </ul>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Design That Drives Results</h3>
              <p className="mb-4">
                Transform your social media presence with professional designs that capture attention, 
                build brand recognition, and convert followers into customers.
              </p>
              <Link 
                to="/book-a-call-meeting"
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Design Social Content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SocialPostDesign;
