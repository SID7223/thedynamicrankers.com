import React from 'react';
import { Helmet } from 'react-helmet-async';

const BrandConsistency: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Brand Consistency Explained | The Dynamic Rankers</title>
        <meta name="description" content="Brand consistency ensures your tone, visuals, and messaging remain aligned across website, ads, sales collateral, and support channels." />
        <meta property="og:title" content="Brand Consistency Explained | The Dynamic Rankers" />
        <meta property="og:description" content="Brand consistency ensures your tone, visuals, and messaging remain aligned across website, ads, sales collateral, and support channels." />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Brand Consistency"
              title="Brand Consistency | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Brand Consistency?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Keep identity coherent across every touchpoint</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Brand consistency ensures your tone, visuals, and messaging remain aligned across website, ads, sales collateral, and support channels.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Components</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Shared voice and messaging framework</li>
                  <li>Unified visual system with reusable components</li>
                  <li>Governance checks across teams and vendors</li>
                  <li>Templates that balance speed and quality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real World Example</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">A growing startup created a consistency playbook for content, design, and sales messaging. Customer trust improved because every interaction felt familiar and professional.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Metrics to Track</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Brand compliance rate in published assets</li>
                  <li>Creative revision frequency</li>
                  <li>Customer trust and recall survey scores</li>
                  <li>Conversion impact from standardized messaging</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandConsistency;
