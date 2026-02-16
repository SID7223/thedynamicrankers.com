import React from 'react';
import { Helmet } from 'react-helmet-async';

const ColorGrading: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Color Grading Explained | The Dynamic Rankers</title>
        <meta name="description" content="Color grading adjusts hue, contrast, saturation, and tonal balance so visuals feel cohesive and communicate the right emotional tone across campaigns." />
        <meta property="og:title" content="Color Grading Explained | The Dynamic Rankers" />
        <meta property="og:description" content="Color grading adjusts hue, contrast, saturation, and tonal balance so visuals feel cohesive and communicate the right emotional tone across campaigns." />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Color Grading"
              title="Color Grading | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Color Grading?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Create visual consistency and emotional tone</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Color grading adjusts hue, contrast, saturation, and tonal balance so visuals feel cohesive and communicate the right emotional tone across campaigns.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Components</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Unified look across social, web, and video assets</li>
                  <li>Mood alignment with brand and audience intent</li>
                  <li>Consistency across mixed lighting footage</li>
                  <li>Template based grading for production efficiency</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real World Example</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">A brand running multi channel video campaigns standardized grading profiles. Creative quality became consistent across platforms, reinforcing trust and recognition.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Metrics to Track</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Creative consistency rating in brand reviews</li>
                  <li>Engagement variance across channels</li>
                  <li>Revision cycles during post production</li>
                  <li>Recall lift in brand perception studies</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorGrading;
