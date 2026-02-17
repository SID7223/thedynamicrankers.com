import React from 'react';
import { Helmet } from 'react-helmet-async';

const OnPageOptimization: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>On Page Optimization Explained | The Dynamic Rankers</title>
        <meta name="description" content="On page optimization aligns structure, metadata, copy, and UX so pages rank better and convert more users. It connects technical SEO with persuasive content design." />
        <meta property="og:title" content="On Page Optimization Explained | The Dynamic Rankers" />
        <meta property="og:description" content="On page optimization aligns structure, metadata, copy, and UX so pages rank better and convert more users. It connects technical SEO with persuasive content design." />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers On Page Optimization"
              title="On Page Optimization | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is On Page Optimization?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Improve page level relevance and usability</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">On page optimization aligns structure, metadata, copy, and UX so pages rank better and convert more users. It connects technical SEO with persuasive content design.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Components</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Title tags and meta descriptions aligned to intent</li>
                  <li>Clear heading hierarchy and semantic content blocks</li>
                  <li>Optimized media with descriptive alt text and compression</li>
                  <li>Conversion focused layout with strong action paths</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real World Example</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">An ecommerce category page was rewritten with clearer headings, better product filters, and stronger metadata. Organic clicks rose and the page delivered a higher add to cart rate.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Metrics to Track</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click through rate from search results</li>
                  <li>Time on page and interaction depth</li>
                  <li>Primary keyword ranking movement</li>
                  <li>Conversion rate from organic sessions</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnPageOptimization;
