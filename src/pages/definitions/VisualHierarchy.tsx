import React from 'react';
import { Helmet } from 'react-helmet-async';

const VisualHierarchy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Visual Hierarchy Explained | The Dynamic Rankers</title>
        <meta name="description" content="Visual hierarchy uses size, spacing, contrast, and placement to direct user focus. Done well, it helps people scan quickly and take confident action." />
        <meta property="og:title" content="Visual Hierarchy Explained | The Dynamic Rankers" />
        <meta property="og:description" content="Visual hierarchy uses size, spacing, contrast, and placement to direct user focus. Done well, it helps people scan quickly and take confident action." />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Visual Hierarchy"
              title="Visual Hierarchy | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Visual Hierarchy?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Guide attention to what matters most</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Visual hierarchy uses size, spacing, contrast, and placement to direct user focus. Done well, it helps people scan quickly and take confident action.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Components</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Priority based heading and section order</li>
                  <li>Contrast and whitespace for scan efficiency</li>
                  <li>Call to action prominence without clutter</li>
                  <li>Responsive composition across breakpoints</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real World Example</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">A lead generation page reordered sections and improved button prominence. Users found value propositions faster and conversion rate increased with no traffic change.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Metrics to Track</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Attention distribution from heatmaps</li>
                  <li>CTA interaction rate</li>
                  <li>Scroll depth to key value sections</li>
                  <li>Conversion lift after layout revisions</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualHierarchy;
