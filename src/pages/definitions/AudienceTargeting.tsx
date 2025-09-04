import React from 'react';
import { Helmet } from 'react-helmet-async';

const AudienceTargeting: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Audience Targeting Definition | The Dynamic Rankers</title>
        <meta name="description" content="Learn what audience targeting means in digital marketing. The Dynamic Rankers explain how precise targeting drives better results and higher ROI." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img 
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp" 
              alt="The Dynamic Rankers – Audience Targeting"
              title="Audience Targeting | The Dynamic Rankers"
              className="w-full h-48 object-cover rounded-lg mb-6"
              loading="lazy"
              width="800"
              height="400"
            />
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              What is Audience Targeting?
            </h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Audience targeting is the strategic practice of identifying and reaching specific groups of people who are most likely to be interested in your products or services. At Dynamic Rankers, we use advanced AI and Google-powered analytics to create laser-focused campaigns that speak directly to your ideal customers.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Real-World Examples
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">E-commerce Fashion Brand</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Instead of advertising to everyone, we target women aged 25-40 who have recently searched for "sustainable fashion" and follow eco-friendly social media accounts. Result: 340% higher conversion rates.
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Local Restaurant Chain</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We target families within 5 miles of each location who frequently order takeout on weekends. Our Apple-level precision in location targeting increased foot traffic by 180%.
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">B2B Software Company</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Targeting IT managers at companies with 50-500 employees who have visited competitor websites. This precise digital marketing approach generated 250% more qualified leads.
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Why Audience Targeting Matters in Digital Marketing
              </h2>
              
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-white"><strong>Higher ROI:</strong> Targeted campaigns typically deliver 3-5x better return on investment than broad, untargeted advertising.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-white"><strong>Reduced Waste:</strong> Stop spending money on people who will never buy. Focus your budget on high-intent prospects.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-white"><strong>Better Messaging:</strong> When you know your audience, you can craft messages that resonate deeply and drive action.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-white"><strong>Competitive Edge:</strong> While competitors spray and pray, you'll dominate with surgical precision across every social media platform.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudienceTargeting;
