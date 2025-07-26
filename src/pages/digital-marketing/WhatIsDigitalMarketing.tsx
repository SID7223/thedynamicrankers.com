import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const WhatIsDigitalMarketing: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>What is Digital Marketing | The Dynamic Rankers</title>
        <meta name="description" content="Learn what digital marketing is and how The Dynamic Rankers use AI-powered strategies to transform your online presence and drive business growth." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img 
              src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp" 
              alt="The Dynamic Rankers – What is Digital Marketing"
              title="What is Digital Marketing | The Dynamic Rankers"
              className="w-full h-64 object-cover rounded-lg mb-8"
              loading="lazy"
              width="800"
              height="400"
            />
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What is Digital Marketing?
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Digital marketing is the strategic use of online channels to connect your brand with customers where they spend their time. At Dynamic Rankers, we blend Apple-level design precision with Google-powered AI to create campaigns that don't just reach people—they convert them into loyal customers.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                  The Digital Marketing Growth Flow
                </h2>
                <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">1</div>
                      <p className="font-semibold text-gray-800 dark:text-white">Your Brand</p>
                    </div>
                    <div className="hidden md:block text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">2</div>
                      <p className="font-semibold text-gray-800 dark:text-white">Website & Social Media</p>
                    </div>
                    <div className="hidden md:block text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">3</div>
                      <p className="font-semibold text-gray-800 dark:text-white">Targeted Traffic</p>
                    </div>
                    <div className="hidden md:block text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">4</div>
                      <p className="font-semibold text-gray-800 dark:text-white">Leads</p>
                    </div>
                    <div className="hidden md:block text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">5</div>
                      <p className="font-semibold text-gray-800 dark:text-white">Sales</p>
                    </div>
                    <div className="hidden md:block text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">6</div>
                      <p className="font-semibold text-gray-800 dark:text-white">Growth</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  Core Digital Marketing Components
                </h2>
                <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-white"><strong><Link to="/definitions/search-engine-optimization" className="text-green-600 hover:text-green-700 font-semibold underline">Search Engine Optimization</Link> (SEO):</strong> Making your website visible when customers search for your services on Google and other search engines.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-white"><strong>Social Media Marketing:</strong> Building relationships and driving traffic through strategic content on platforms where your audience spends time.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-white"><strong>Content Marketing:</strong> Creating valuable, relevant content that attracts and engages your target audience while establishing your expertise.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-white"><strong>Email Marketing:</strong> Nurturing leads and maintaining customer relationships through personalized, automated email campaigns.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-white"><strong>Paid Advertising:</strong> Strategic ad placement on Google, social media, and other platforms to reach high-intent customers quickly.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  Why Digital Marketing Drives Success
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Traditional marketing casts a wide net and hopes for the best. Digital marketing uses data, AI, and precise targeting to reach the right people at the right moment. Our approach focuses on measurable <Link to="/definitions/online-engagement" className="text-green-600 hover:text-green-700 font-semibold underline">online engagement</Link> that translates directly into business growth.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">Measurable Results</h3>
                    <p className="text-gray-600 dark:text-gray-300">Track every click, conversion, and dollar spent. Know exactly what's working and optimize in real-time.</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Cost-Effective</h3>
                    <p className="text-gray-600 dark:text-gray-300">Reach thousands of potential customers for less than the cost of a single print ad or billboard.</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Global Reach</h3>
                    <p className="text-gray-600 dark:text-gray-300">Expand beyond geographical limitations and tap into markets you never thought possible.</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-3">24/7 Marketing</h3>
                    <p className="text-gray-600 dark:text-gray-300">Your digital presence works around the clock, generating leads and sales even while you sleep.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  The Dynamic Rankers Difference
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We don't just do digital marketing—we engineer growth. Our AI-powered strategies, combined with human creativity and strategic thinking, create campaigns that don't just reach your audience—they inspire action and drive measurable business results.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatIsDigitalMarketing;