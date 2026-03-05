import React from 'react';
import { Helmet } from 'react-helmet-async';

const InteractiveUx: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Interactive UX Explained | The Dynamic Rankers</title>
        <meta name="description" content="Interactive UX combines visual feedback, micro interactions, and responsive interface behavior to keep users engaged and moving toward clear goals." />
        <meta property="og:title" content="Interactive UX Explained | The Dynamic Rankers" />
        <meta property="og:description" content="Interactive UX combines visual feedback, micro interactions, and responsive interface behavior to keep users engaged and moving toward clear goals." />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Interactive UX"
              title="Interactive UX | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Interactive UX?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Design interfaces that guide action</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Interactive UX combines visual feedback, micro interactions, and responsive interface behavior to keep users engaged and moving toward clear goals.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Components</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Micro interactions that confirm user actions</li>
                  <li>Progress indicators for multi step tasks</li>
                  <li>Context aware prompts and dynamic validation</li>
                  <li>Touch friendly controls across devices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real World Example</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">A booking flow added step indicators, inline error hints, and instant field validation. Completion rate increased because users understood progress and recovered quickly from mistakes.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Metrics to Track</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Task completion rate on key funnels</li>
                  <li>Abandonment rate per interaction step</li>
                  <li>Time to complete primary journeys</li>
                  <li>User satisfaction and support ticket trends</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractiveUx;
