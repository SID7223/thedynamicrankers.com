import React from 'react';
import { Helmet } from 'react-helmet-async';

const JavascriptAutomation: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>JavaScript Automation Definition | The Dynamic Rankers</title>
        <meta
          name="description"
          content="JavaScript automation reduces manual effort by scripting repetitive workflows like reporting, validation checks, data extraction, and marketing operations."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers JavaScript Automation"
              title="JavaScript Automation | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is JavaScript Automation?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Automate repeatable browser and data tasks</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">JavaScript automation reduces manual effort by scripting repetitive workflows like reporting, validation checks, data extraction, and marketing operations.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Components</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Automated QA checks for forms and funnels</li>
                  <li>Scheduled data pulls from APIs and dashboards</li>
                  <li>Workflow triggers for lead routing and notifications</li>
                  <li>Scripted monitoring for uptime and conversion paths</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real World Example</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">A growth team automated weekly campaign reporting and anomaly alerts. Analysts spent less time exporting spreadsheets and more time optimizing ad and landing page performance.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Metrics to Track</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Hours saved per week through automation</li>
                  <li>Error reduction in recurring workflows</li>
                  <li>Execution speed for recurring tasks</li>
                  <li>Response time to detected funnel issues</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JavascriptAutomation;
