import React from 'react';
import { Helmet } from 'react-helmet-async';

const WorkflowAutomation: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Workflow Automation Explained | The Dynamic Rankers</title>
        <meta name="description" content="Workflow automation uses technology to streamline repetitive business processes, reducing manual effort and increasing efficiency." />
        <meta property="og:title" content="Workflow Automation Explained | The Dynamic Rankers" />
        <meta property="og:description" content="Workflow automation uses technology to streamline repetitive business processes, reducing manual effort and increasing efficiency." />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Workflow Automation"
              title="Workflow Automation | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Workflow Automation?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Streamline repetitive tasks and increase business efficiency</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Workflow automation uses technology to streamline repetitive business processes, reducing manual effort and increasing efficiency. It transforms how businesses operate across digital marketing channels and social media platforms.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Examples</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Email Marketing:</strong> Automatically send personalized sequences based on user behavior.</li>
                  <li><strong>Social Media Scheduling:</strong> Maintain consistent presence across platforms at optimal engagement times.</li>
                  <li><strong>Lead Processing:</strong> Automatically route, score, and assign leads based on predefined criteria.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why It Matters</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Automation is essential for scaling operations while maintaining quality. It helps businesses maximize efficiency, reduce human error, and focus resources on strategic activities that drive growth across all marketing initiatives.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowAutomation;
