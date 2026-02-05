import React from 'react';
import { Helmet } from 'react-helmet-async';

const PredictiveAnalysis: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Predictive Analysis Definition | The Dynamic Rankers</title>
        <meta
          name="description"
          content="Predictive analysis uses historical performance data and current behavioral signals to estimate future outcomes such as lead quality, campaign performance, and churn risk."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Predictive Analysis"
              title="Predictive Analysis | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Predictive Analysis?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Forecast outcomes using historical and live signals</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Predictive analysis uses historical performance data and current behavioral signals to estimate future outcomes such as lead quality, campaign performance, and churn risk.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Components</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Trend modeling from CRM and campaign history</li>
                  <li>Lead scoring based on intent and engagement signals</li>
                  <li>Probability forecasting for conversions and revenue</li>
                  <li>Scenario planning for budget and channel allocation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real World Example</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">A B2B team used predictive scoring to rank inbound leads. Sales shifted focus to high likelihood accounts first, resulting in faster deal cycles and better close rates without increasing ad spend.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Metrics to Track</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Forecast accuracy against real performance</li>
                  <li>Pipeline velocity after lead prioritization</li>
                  <li>Cost per qualified opportunity</li>
                  <li>Retention risk predictions versus actual churn</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PredictiveAnalysis;
