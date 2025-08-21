import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const WebsiteDevelopmentPage = () => {
  return (
    <>
      <Helmet>
        <title>Website Development | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' Website Development service with performance visuals and clean design." />
        <meta name="keywords" content="website development, responsive design, mobile-first, CMS, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-green-600 to-teal-700">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Website Development
              </h1>
              <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto mb-8">
                Dynamic Rankers creates custom websites with mobile-first design and Apple-inspired aesthetics. 
                Our digital solutions feature responsive layouts optimized for Google search performance.
              </p>
            </div>
          </section>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <picture>
                  <source
                    srcSet="
                      https://images.pexels.com/photos/326518/pexels-photo-326518.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                      https://images.pexels.com/photos/326518/pexels-photo-326518.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                      https://images.pexels.com/photos/326518/pexels-photo-326518.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                    "
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                    type="image/webp"
                  />
                  <img 
                    src="https://images.pexels.com/photos/326518/pexels-photo-326518.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                    alt="The Dynamic Rankers – Website Development"
                    title="Website Development | The Dynamic Rankers"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                    width="1200"
                    height="600"
                  />
                </picture>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                  Custom Website Solutions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Mobile-First Design
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Every website we build prioritizes mobile experience with <Link to="/definitions/responsive-layout" className="text-green-600 hover:text-green-800 underline">responsive layout</Link> 
                      technology that adapts perfectly to any device size.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Interactive Design Elements
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Engaging <Link to="/definitions/interactive-design" className="text-green-600 hover:text-green-800 underline">interactive design</Link> 
                      features powered by AI technology that enhance user experience and boost conversion rates.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Content Management Systems
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Easy-to-use CMS solutions that let you update content effortlessly while maintaining 
                      Google-optimized performance and SEO rankings.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Performance Optimization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Lightning-fast loading speeds with Apple-level attention to detail, ensuring 
                      optimal performance across all digital marketing channels.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Development Process
                </h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Discovery & Planning</h4>
                      <p className="text-gray-600 dark:text-gray-300">We analyze your business needs and create a comprehensive digital strategy.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Design & Prototyping</h4>
                      <p className="text-gray-600 dark:text-gray-300">Custom designs that reflect your brand with modern UI/UX principles.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Development & Testing</h4>
                      <p className="text-gray-600 dark:text-gray-300">Rigorous development and testing ensure flawless functionality across all platforms.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Launch & Support</h4>
                      <p className="text-gray-600 dark:text-gray-300">Seamless deployment with ongoing support and maintenance services.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Ready to Build Your Dream Website?</h3>
                  <p className="mb-6">
                    Partner with Dynamic Rankers for website development that combines cutting-edge technology 
                    with proven marketing strategies. Our team delivers results that drive real business growth.
                  </p>
                  <Link 
                    to="/book-a-call-meeting" 
                    className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Start Your Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WebsiteDevelopmentPage;
