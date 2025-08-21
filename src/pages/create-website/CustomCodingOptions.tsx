import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
const CustomCodingOptions = () => {
  return (
    <>
      <Helmet>
        <title>Custom Coding Options | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' take on Custom Coding Options with expert insight, visual clarity, and SEO-optimized strategy." />
        <meta name="keywords" content="custom coding, JavaScript automation, interactive UX, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Custom Coding Options
          </h1>
          
          <div className="mb-8">
            <picture>
              <source
                srcSet="
                  https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                  https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                  https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                "
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                type="image/webp"
              />
              <img 
                src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                alt="The Dynamic Rankers – Custom Coding Options"
                title="Custom Coding Options | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Dynamic Rankers delivers Apple-level coding precision with Google-powered functionality. 
              Our custom development solutions include interactive dashboards, advanced calculators, and 
              seamless API integrations that elevate your digital marketing presence across all platforms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Advanced Development Solutions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Custom Dashboards
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Build powerful analytics dashboards that integrate with Google Analytics, social 
                  media platforms, and AI-driven marketing tools for comprehensive data visualization.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Interactive Calculators
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Engage visitors with Dynamic calculators that provide instant value while capturing 
                  leads and enhancing your digital marketing conversion rates.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Technical Excellence
            </h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Advanced <Link to="/definitions/javascript-automation" className="text-blue-600 hover:text-blue-800 underline">JavaScript Automation</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white">Streamline workflows with custom scripts that integrate Google services, social media APIs, and AI marketing tools</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Premium <Link to="/definitions/interactive-ux" className="text-blue-600 hover:text-blue-800 underline">Interactive UX</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white">Create Apple-inspired user experiences that keep visitors engaged and boost digital marketing performance</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">API Integration:</strong> <span className="text-gray-600 dark:text-white">Connect your website to powerful third-party services, from Google Workspace to social media management platforms</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Performance Optimization:</strong> <span className="text-gray-600 dark:text-white">Rankers-level code optimization ensures lightning-fast loading times and superior user experience</span>
                </div>
              </li>
            </ul>
            
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Build Something Extraordinary</h3>
              <p className="mb-4">
                Transform your vision into reality with custom coding solutions that set you apart 
                from the competition and drive meaningful digital marketing results.
              </p>
              <Link 
                to="/book-a-call-meeting"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Start Custom Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomCodingOptions;
