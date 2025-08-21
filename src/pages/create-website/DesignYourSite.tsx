import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
const DesignYourSite = () => {
  return (
    <>
      <Helmet>
        <title>Design Your Site | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' expert approach to Design Your Site with clear visuals and smart automation." />
        <meta name="keywords" content="website design, custom design, brand identity, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Design Your Site
          </h1>
          
          <div className="mb-8">
            <picture>
              <source
                srcSet="
                  https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                  https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                  https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                "
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                type="image/webp"
              />
              <img 
                src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                alt="The Dynamic Rankers – Design Your Site"
                title="Design Your Site | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Dynamic Rankers crafts stunning websites with Apple-inspired aesthetics and Google-optimized performance.
              Our custom design approach transforms your brand vision into digital reality through strategic 
              visual storytelling that captivates audiences across all marketing channels and social media platforms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Custom Design Excellence
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Brand Identity Integration
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Seamlessly weave your brand story into every design element, creating 
                  cohesive visual experiences that resonate with your target audience.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  User-Centered Design
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Create intuitive interfaces that guide users effortlessly through your 
                  digital marketing funnel with AI-powered user experience optimization.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Design Process & Features
            </h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Strategic <Link to="/definitions/brand-identity" className="text-blue-600 hover:text-blue-800 underline">Brand Identity</Link> Development:</strong> 
                  <span className="text-gray-600 dark:text-white"> Build distinctive visual identities that stand out in competitive digital marketing landscapes</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Adaptive <Link to="/definitions/visual-storytelling" className="text-blue-600 hover:text-blue-800 underline">Visual Storytelling</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white"> Craft compelling narratives through design that engage visitors across all social media touchpoints</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Mobile-First Approach:</strong> <span className="text-gray-600 dark:text-white">Design with Rankers-level attention to mobile user experience and cross-device consistency</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Performance Optimization:</strong> <span className="text-gray-600 dark:text-white">Balance stunning visuals with lightning-fast loading speeds for optimal Google rankings</span>
                </div>
              </li>
            </ul>
            
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Bring Your Vision to Life</h3>
              <p className="mb-4">
                Transform your brand into a digital masterpiece with Dynamic design solutions 
                that captivate, convert, and create lasting impressions across every platform.
              </p>
              <Link 
                to="/book-a-call-meeting"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Start Design Process
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DesignYourSite;
