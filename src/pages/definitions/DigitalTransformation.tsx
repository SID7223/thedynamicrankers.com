import React from 'react';
import { Helmet } from 'react-helmet-async';

const DigitalTransformation: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Digital Transformation Definition | The Dynamic Rankers</title>
        <meta name="description" content="Learn what digital transformation means and how The Dynamic Rankers guide businesses through comprehensive digital evolution strategies." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img 
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp" 
              alt="The Dynamic Rankers – Digital Transformation"
              title="Digital Transformation | The Dynamic Rankers"
              className="w-full h-48 object-cover rounded-lg mb-6"
              loading="lazy"
              width="800"
              height="400"
            />
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              What is Digital Transformation?
            </h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Digital transformation is the comprehensive integration of digital technology into all areas of a business, fundamentally changing how you operate and deliver value to customers. At Dynamic Rankers, we guide organizations through this evolution using Apple-level precision and Google-powered strategies to create lasting competitive advantages.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Real-World Examples
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Traditional Retail to E-commerce</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    A brick-and-mortar store transforms by implementing online sales, mobile apps, inventory management systems, and social media marketing - creating an omnichannel experience that serves customers anywhere, anytime.
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Manufacturing Goes Smart</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    A manufacturing company adopts IoT sensors, AI-powered predictive maintenance, and real-time data analytics to optimize production, reduce downtime, and improve quality control across all operations.
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Healthcare Digital Evolution</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Healthcare providers implement telemedicine, electronic health records, AI diagnostics, and patient portals to deliver better care while improving operational efficiency and patient satisfaction.
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Why Digital Transformation Matters
              </h2>
              
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-white"><strong>Competitive Survival:</strong> Companies that don't transform digitally risk being left behind by more agile, tech-savvy competitors who can serve customers better and faster.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-white"><strong>Enhanced Customer Experience:</strong> Digital tools enable personalized, seamless experiences across all touchpoints, increasing satisfaction and loyalty.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-white"><strong>Operational Efficiency:</strong> Automation and data-driven processes reduce costs, eliminate errors, and free up human resources for strategic activities.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-white"><strong>Data-Driven Decisions:</strong> Digital transformation provides real-time insights that enable better decision-making and faster response to market changes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DigitalTransformation;