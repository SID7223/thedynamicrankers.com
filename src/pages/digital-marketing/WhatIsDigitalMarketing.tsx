import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaBullseye, FaChartLine, FaClipboardList, FaLaptopCode, FaLightbulb, FaShoppingCart } from 'react-icons/fa';

const WhatIsDigitalMarketing: React.FC = () => {
  const flowSteps = [
    {
      id: 1,
      label: "Your Brand",
      icon: <FaLightbulb className="w-8 h-8" />,
      color: "text-green-500",
      description: "We define your brand to resonate with audiences."
    },
    {
      id: 2,
      label: "Website & Social Media",
      icon: <FaLaptopCode className="w-8 h-8" />,
      color: "text-blue-500",
      description: "We build responsive websites and engaging social profiles."
    },
    {
      id: 3,
      label: "Targeted Traffic",
      icon: <FaBullseye className="w-8 h-8" />,
      color: "text-purple-500",
      description: "We use SEO, content, and ads to drive traffic."
    },
    {
      id: 4,
      label: "Leads",
      icon: <FaClipboardList className="w-8 h-8" />,
      color: "text-orange-500",
      description: "We convert visitors with CTAs and lead magnets."
    },
    {
      id: 5,
      label: "Sales",
      icon: <FaShoppingCart className="w-8 h-8" />,
      color: "text-red-500",
      description: "We turn prospects into customers through nurturing and funnels."
    },
    {
      id: 6,
      label: "Growth",
      icon: <FaChartLine className="w-8 h-8" />,
      color: "text-green-600",
      description: "We analyze data to optimize campaigns and grow reach."
    },
  ];

  return (
    <>
      <Helmet>
        <title>What is Digital Marketing | The Dynamic Rankers</title>
        <meta name="description" content="Learn what digital marketing is and how The Dynamic Rankers use AI-powered strategies to transform your online presence and drive business growth." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="The Dynamic Rankers – What is Digital Marketing"
              title="What is Digital Marketing | The Dynamic Rankers"
              className="w-full h-72 object-cover rounded-lg mb-8"
              loading="lazy"
              width="1260"
              height="750"
            />

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
              What is Digital Marketing?
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 leading-relaxed text-center max-w-4xl mx-auto">
              Digital marketing is the strategic use of online channels to connect your brand with customers. At Dynamic Rankers, we blend top-tier design with AI-powered precision to create campaigns that don't just reach people—they convert them into loyal customers.
            </p>

            <div className="space-y-12">
              <section>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                  The Digital Marketing Growth Flow
                </h2>
                
                {/* Desktop Flowchart */}
                <div className="hidden md:flex items-start justify-between relative">
                  <div className="absolute top-10 left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-700" />
                  
                  {flowSteps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center w-48 text-center z-10">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white dark:bg-gray-800">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${step.color.replace('text-', 'bg-')} text-white shadow-lg`}>
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">{step.label}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  ))}
                </div>

                {/* Mobile Flowchart */}
                <div className="md:hidden space-y-8">
                  {flowSteps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${step.color} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.color.replace('text-', 'bg-')} text-white shadow-md`}>
                              {step.icon}
                            </div>
                          </div>
                          {index < flowSteps.length - 1 && <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600 mt-2"></div>}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${step.color}`}>{step.label}</h3>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                  Core Digital Marketing Components
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Search Engine Optimization (SEO)", description: "Making your website visible when customers search for your services on Google and other search engines.", link: "/definitions/search-engine-optimization" },
                    { title: "Social Media Marketing", description: "Building relationships and driving traffic through strategic content on platforms where your audience spends time." },
                    { title: "Content Marketing", description: "Creating valuable, relevant content that attracts and engages your target audience while establishing your expertise." },
                    { title: "Email Marketing", description: "Nurturing leads and maintaining customer relationships through personalized, automated email campaigns." },
                    { title: "Paid Advertising (PPC)", description: "Strategic ad placement on Google, social media, and other platforms to reach high-intent customers quickly." },
                    { title: "Analytics & Data", description: "Tracking every click, conversion, and dollar spent to optimize in real-time." },
                  ].map(item => (
                    <div key={item.title} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                        {item.link && <Link to={item.link} className="text-green-600 hover:text-green-700 font-semibold underline ml-1">Learn More</Link>}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                  Why Digital Marketing Drives Success
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-center max-w-4xl mx-auto">
                  Traditional marketing casts a wide net. Digital marketing uses data and precise targeting to reach the right people at the right moment. Our approach focuses on measurable <Link to="/definitions/online-engagement" className="text-green-600 hover:text-green-700 font-semibold underline">online engagement</Link> that translates directly into business growth.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-green-50 dark:bg-gray-700/50 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">Measurable Results</h3>
                    <p className="text-gray-600 dark:text-gray-300">Track every click, conversion, and dollar spent. Know exactly what's working and optimize in real-time.</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-gray-700/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Cost-Effective</h3>
                    <p className="text-gray-600 dark:text-gray-300">Reach thousands of potential customers for less than the cost of a single print ad or billboard.</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-gray-700/50 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Global Reach</h3>
                    <p className="text-gray-600 dark:text-gray-300">Expand beyond geographical limitations and tap into markets you never thought possible.</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-gray-700/50 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-3">24/7 Marketing</h3>
                    <p className="text-gray-600 dark:text-gray-300">Your digital presence works around the clock, generating leads and sales even while you sleep.</p>
                  </div>
                </div>
              </section>

              <section className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Ready to Grow Your Business?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  We don't just do digital marketing. We engineer growth. Our AI powered strategies combined with human creativity create campaigns that drive measurable results.
                </p>
                <Link to="/book-a-call-meeting" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-colors">
                  Get Your Free Consultation
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatIsDigitalMarketing;
