import React from 'react';
import { Helmet } from 'react-helmet-async';

const VisualStorytelling: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Visual Storytelling Definition | The Dynamic Rankers</title>
        <meta
          name="description"
          content="Visual storytelling combines compelling narratives with powerful imagery to create emotional connections and convey complex messages instantly."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 pt-32 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
              alt="The Dynamic Rankers Visual Storytelling"
              title="Visual Storytelling | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-6"
              loading="lazy"
              width="1200"
              height="640"
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What is Visual Storytelling?</h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-6">Create emotional connections through compelling narratives and imagery</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Visual storytelling combines compelling narratives with powerful imagery to create emotional connections and convey complex messages instantly. It is a powerful technique for creating memorable brand experiences across all digital marketing channels.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Techniques</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Infographic Narratives:</strong> Transform complex data into compelling visual stories that educate and engage.</li>
                  <li><strong>Sequential Content:</strong> Create multi-part series that guide viewers through a complete story arc.</li>
                  <li><strong>Emotional Triggers:</strong> Use color, composition, and imagery to evoke specific emotions aligned with brand goals.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why It Matters</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-7">Humans process visual information significantly faster than text. Visual storytelling leverages this advantage to capture attention and drive action across search results and social media feeds, ensuring every visual tells your brand story with maximum impact.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualStorytelling;
