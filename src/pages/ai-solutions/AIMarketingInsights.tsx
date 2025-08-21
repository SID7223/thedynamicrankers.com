import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const AIMarketingInsights = () => {
  return (
    <>
      <Helmet>
        <title>AI Marketing Insights | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' take on AI Marketing Insights with expert insight, visual clarity, and SEO-optimized strategy." />
        <meta name="keywords" content="AI marketing insights, behavioral data, predictive analytics, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            AI Marketing Insights
          </h1>
          
          <div className="mb-8">
            <picture>
              <source
                srcSet="
                  https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                  https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                  https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                "
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                type="image/webp"
              />
              <img 
                src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                alt="The Dynamic Rankers – AI Marketing Insights"
                title="AI Marketing Insights | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Dynamic Rankers combines Google-level analytics with Apple's intuitive design to deliver 
              AI-powered marketing insights. Our advanced systems analyze real-time data across digital 
              platforms, transforming raw information into actionable strategies for social media success.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Real-Time Analytics Power
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Customer Journey Mapping
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track every touchpoint from Google search to social media engagement, 
                  revealing the complete digital marketing funnel with AI precision.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Performance Forecasting
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Predict campaign outcomes with Dynamic accuracy, optimizing your marketing 
                  spend across all digital channels before you invest.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Advanced Data Intelligence
            </h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                <div>
                   <strong className="text-gray-900 dark:text-white">Deep <Link to="/definitions/behavioral-data" className="text-purple-600 hover:text-purple-800 underline">Behavioral Data</Link> Analysis:</strong> 
                  <span className="text-gray-600 dark:text-white">Understand how users interact with your content across Google, social media, and other digital touchpoints</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                <div>
                   <strong className="text-gray-900 dark:text-white">Advanced <Link to="/definitions/predictive-analytics" className="text-purple-600 hover:text-purple-800 underline">Predictive Analytics</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white">Forecast trends and optimize campaigns with AI-powered insights that rival Apple's data science capabilities</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                <div>
                   <strong className="text-gray-900 dark:text-white">Competitive Intelligence:</strong> <span className="text-gray-600 dark:text-white">Monitor competitor strategies across all digital marketing channels with Rankers-level precision</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                <div>
                   <strong className="text-gray-900 dark:text-white">ROI Optimization:</strong> <span className="text-gray-600 dark:text-white">Maximize returns on every marketing dollar with AI-driven budget allocation recommendations</span>
                </div>
              </li>
            </ul>

            
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Unlock Data-Driven Growth</h3>
              <p className="mb-4">
                Transform your marketing strategy with AI insights that reveal hidden opportunities 
                and optimize performance across every digital channel.
              </p>
              <Link 
                to="/book-a-call-meeting"
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Get AI Insights
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIMarketingInsights;
