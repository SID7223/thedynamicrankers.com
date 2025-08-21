import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
const CopywritingServices = () => {
  return (
    <>
      <Helmet>
        <title>Copywriting Services | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' expert approach to Copywriting Services with clear visuals and smart automation." />
        <meta name="keywords" content="copywriting services, content writing, persuasive copy, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Copywriting Services
          </h1>
          
          <div className="mb-8">
            <picture>
              <source
                srcSet="
                  https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                  https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                  https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                "
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                type="image/webp"
              />
              <img 
                src="https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                alt="The Dynamic Rankers – Copywriting Services"
                title="Copywriting Services | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Dynamic Rankers delivers persuasive copywriting that converts readers into customers with Apple-level
              precision and Google-optimized content strategy. Our AI-enhanced writing transforms your brand message 
              into compelling narratives that drive action across all digital marketing channels and social media platforms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Conversion-Focused Writing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Strategic Sales Copy
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Craft compelling sales pages, product descriptions, and email campaigns 
                  that drive conversions with psychologically-proven persuasion techniques.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Brand Voice Development
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Establish consistent brand voice across all platforms with Dynamic 
                  messaging that resonates with your target audience and builds trust.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Writing Solutions
            </h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Persuasive <Link to="/definitions/sales-psychology" className="text-orange-600 hover:text-orange-800 underline">Sales Psychology</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white"> Apply proven psychological triggers that motivate action and increase conversion rates across all marketing materials</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Advanced <Link to="/definitions/content-optimization" className="text-orange-600 hover:text-orange-800 underline">Content Optimization</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white"> Optimize every word for both human engagement and Google search rankings with Rankers-level precision</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Multi-Channel Messaging:</strong> <span className="text-gray-600 dark:text-white">Adapt your message for different platforms while maintaining brand consistency across social media and digital channels</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">AI-Enhanced Writing:</strong> <span className="text-gray-600 dark:text-white">Leverage artificial intelligence tools to refine and optimize copy for maximum impact and engagement</span>
                </div>
              </li>
            </ul>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Words That Work</h3>
              <p className="mb-4">
                Transform your business with copywriting that doesn't just inform—it persuades, 
                converts, and builds lasting relationships with your audience through Dynamic storytelling.
              </p>
              <Link 
                to="/book-a-call-meeting"
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Get Copy That Converts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CopywritingServices;
