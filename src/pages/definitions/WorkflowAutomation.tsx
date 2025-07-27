import React from 'react';
import { Helmet } from 'react-helmet-async';

const WorkflowAutomation = () => {
  return (
    <>
      <Helmet>
        <title>Workflow Automation Definition | The Dynamic Rankers</title>
        <meta name="description" content="Learn about workflow automation and how it streamlines business processes with The Dynamic Rankers' expert insights." />
        <meta name="keywords" content="workflow automation, business process automation, efficiency, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Workflow Automation
          </h1>
          
          <div className="mb-8">
            <picture>
              <source
                srcSet="
                  https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                  https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                  https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                "
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                type="image/webp"
              />
              <img 
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                alt="The Dynamic Rankers – Workflow Automation"
                title="Workflow Automation | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Workflow automation uses technology to streamline repetitive business processes,
              reducing manual effort and increasing efficiency. The Dynamic Rankers implements 
              intelligent automation systems that transform how businesses operate across 
              digital marketing channels and social media platforms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Real-World Examples
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Email Marketing Automation
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Automatically send personalized email sequences based on user behavior, 
                  nurturing leads through the sales funnel without manual intervention.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Social Media Scheduling
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Automated posting schedules ensure consistent social media presence 
                  across multiple platforms at optimal engagement times.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Lead Processing System
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Automatically route, score, and assign leads to appropriate team members 
                  based on predefined criteria and behavioral triggers.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why It Matters in Digital Marketing
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Workflow automation is essential for modern digital marketing because it enables
              businesses to scale their operations while maintaining quality and consistency. 
              The Dynamic Rankers uses automation to help clients maximize efficiency, reduce 
              errors, and focus human resources on strategic activities that drive growth. 
              This technology allows marketers to operate with Apple-level precision and 
              Google-scale efficiency across all their marketing initiatives.
            </p>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Streamline Your Operations</h3>
              <p>
                Discover how workflow automation can transform your business efficiency 
                and free your team to focus on strategic growth initiatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowAutomation;