import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SocialMediaMarketingPage = () => {
  return (
    <>
      <Helmet>
        <title>Social Media Marketing | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' Social Media Marketing service with performance visuals and clean design." />
        <meta name="keywords" content="social media marketing, engagement rate, platform targeting, audience building, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-pink-600 to-purple-700">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Social Media Marketing
              </h1>
              <p className="text-lg sm:text-xl text-pink-100 max-w-3xl mx-auto mb-8">
                Dynamic Rankers amplifies your social media presence with AI-powered content strategies. 
                Our digital marketing expertise drives engagement across all major platforms with Apple-inspired creativity.
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
                      https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                      https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                      https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                    "
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                    type="image/webp"
                  />
                  <img 
                    src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                    alt="The Dynamic Rankers – Social Media Marketing"
                    title="Social Media Marketing | The Dynamic Rankers"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                    width="1200"
                    height="600"
                  />
                </picture>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                  Strategic Social Media Growth
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Engagement Rate Optimization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Maximize your <Link to="/definitions/engagement-rate" className="text-pink-600 hover:text-pink-800 underline">engagement rate</Link> 
                      with AI-powered content strategies that resonate with your audience across all social media platforms.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Advanced Platform Targeting
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Strategic <Link to="/definitions/platform-targeting" className="text-pink-600 hover:text-pink-800 underline">platform targeting</Link> 
                      ensures your content reaches the right audience on Facebook, Instagram, LinkedIn, and TikTok.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Creative Ad Design
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Apple-inspired ad designs that capture attention and drive action, 
                      optimized for each platform's unique format and audience behavior.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Audience Building & Growth
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Organic audience building strategies combined with paid social campaigns 
                      that expand your reach and build lasting brand loyalty through digital marketing.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Platform-Specific Strategies
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Facebook</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Community building and targeted advertising</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <h4 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-3">Instagram</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Visual storytelling and influencer partnerships</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-3">LinkedIn</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">B2B networking and thought leadership</p>
                  </div>
                  
                  <div className="bg-gray-900 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <h4 className="text-lg font-bold text-white mb-3">TikTok</h4>
                    <p className="text-sm text-gray-300">Viral content and Gen Z engagement</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Our Social Media Process
                </h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Audience Research & Strategy</h4>
                      <p className="text-gray-600 dark:text-gray-300">Deep dive into your audience demographics, interests, and social media behavior patterns.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Content Creation & Design</h4>
                      <p className="text-gray-600 dark:text-gray-300">Custom content creation with Google-optimized visuals and engaging copy that drives interaction.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Campaign Management</h4>
                      <p className="text-gray-600 dark:text-gray-300">Strategic posting schedules and paid campaign management across all relevant platforms.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Analytics & Optimization</h4>
                      <p className="text-gray-600 dark:text-gray-300">Continuous performance monitoring with data-driven optimizations for maximum ROI.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Social Media Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600 mb-2">280%</div>
                      <p className="text-gray-600 dark:text-gray-300">Average engagement increase</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600 mb-2">150K+</div>
                      <p className="text-gray-600 dark:text-gray-300">New followers generated</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600 mb-2">500%</div>
                      <p className="text-gray-600 dark:text-gray-300">Brand awareness boost</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Transform Your Social Presence</h3>
                  <p className="mb-6">
                    Partner with Dynamic Rankers to elevate your social media marketing strategy. 
                    Our AI-powered approach delivers authentic engagement and measurable growth across all platforms.
                  </p>
                  <Link 
                    to="/book-a-call-meeting" 
                    className="inline-block bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Boost Social Media
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

export default SocialMediaMarketingPage;
