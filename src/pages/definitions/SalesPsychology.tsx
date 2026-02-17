import React from 'react';
import { Helmet } from 'react-helmet-async';

const SalesPsychology: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Sales Psychology Explained | The Dynamic Rankers</title>
        <meta name="description" content="Sales psychology applies behavioral science principles to understand and influence consumer decision-making processes." />
        <meta property="og:title" content="Sales Psychology Explained | The Dynamic Rankers" />
        <meta property="og:description" content="Sales psychology applies behavioral science principles to understand and influence consumer decision-making processes." />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Sales Psychology"
              title="Sales Psychology | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Sales Psychology?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Influence consumer decisions using behavioral science principles</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Sales psychology applies behavioral science principles to understand and influence consumer decision-making processes. It uses proven psychological triggers to create compelling marketing messages that drive conversions across all digital channels.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Principles</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Social Proof:</strong> Leverage testimonials and reviews to build trust and credibility.</li>
                  <li><strong>Scarcity & Urgency:</strong> Create compelling reasons for immediate action through limited availability.</li>
                  <li><strong>Loss Aversion:</strong> Address customer fears by emphasizing what they stand to lose without a solution.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why It Matters</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Understanding the "why" behind consumer behavior is fundamental to marketing success. By applying these principles, businesses can create messages that resonate emotionally and drive action, resulting in higher conversion rates and better ROI.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesPsychology;
