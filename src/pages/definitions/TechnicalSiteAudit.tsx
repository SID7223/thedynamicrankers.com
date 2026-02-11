import React from 'react';
import { Helmet } from 'react-helmet-async';

const TechnicalSiteAudit: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Technical Site Audit Definition | The Dynamic Rankers</title>
        <meta
          name="description"
          content="A technical site audit evaluates crawlability, performance, indexing, and architecture issues that limit visibility, trust, and conversion performance."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Technical Site Audit"
              title="Technical Site Audit | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Technical Site Audit?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Resolve technical barriers to growth</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">A technical site audit evaluates crawlability, performance, indexing, and architecture issues that limit visibility, trust, and conversion performance.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Components</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Indexing and crawl diagnostics</li>
                  <li>Core web vitals and asset delivery review</li>
                  <li>Redirect chains and canonical consistency checks</li>
                  <li>Security, accessibility, and mobile readiness validation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real World Example</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">A SaaS site had strong content but unstable rankings. Audit findings revealed duplicate canonicals and slow mobile rendering. Fixes improved index quality and organic lead quality.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Metrics to Track</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Indexed page quality ratio</li>
                  <li>Core web vitals pass percentage</li>
                  <li>Crawl errors and redirect issues</li>
                  <li>Organic landing page stability</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TechnicalSiteAudit;
