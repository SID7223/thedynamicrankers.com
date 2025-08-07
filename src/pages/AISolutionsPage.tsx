import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from '../components/SidebarNav';

const AISolutionsPage = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/ai-solutions';

  const subPages = [
    {
      path: 'ai-web-automation',
      title: 'AI Web Automation',
      description: 'Automate your website processes with cutting-edge AI technology'
    },
    {
      path: 'ai-content-tools',
      title: 'AI Content Tools',
      description: 'Create engaging content faster with AI-powered writing tools'
    },
    {
      path: 'ai-marketing-insights',
      title: 'AI Marketing Insights',
      description: 'Data-driven marketing decisions with AI analytics and insights'
    },
    {
      path: 'ai-seo-enhancement',
      title: 'AI SEO Enhancement',
      description: 'Boost your search rankings with AI-optimized SEO strategies'
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI Solutions for Business - The Dynamic Rankers USA</title>
        <meta name="description" content="Revolutionary AI solutions for businesses in USA. Automate processes, enhance content creation, and boost marketing with AI technology from The Dynamic Rankers." />
        <meta name="keywords" content="AI solutions, artificial intelligence, USA, automation, AI marketing, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {isMainPage ? (
            <>
              {/* Hero Section */}
              <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700">
                <div className="container mx-auto px-4 text-center">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                    AI Solutions for Business
                  </h1>
                  <p className="text-lg sm:text-xl text-purple-100 max-w-3xl mx-auto mb-8">
                    Harness the power of artificial intelligence to transform your business operations. 
                    The Dynamic Rankers brings cutting-edge AI solutions to USA businesses.
                  </p>
                </div>
              </section>

              {/* Main Content with Sidebar */}
              <div className="flex flex-col lg:flex-row">
                <SidebarNav 
                  title="AI Solutions"
                  basePath="/ai-solutions"
                  links={subPages}
                />
                
                <div className="flex-1 p-8">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                      The Future is AI-Powered
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      Artificial Intelligence is revolutionizing how businesses operate. The Dynamic Rankers 
                      specializes in implementing AI solutions that streamline processes, enhance productivity, 
                      and drive growth for companies across the USA.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          Intelligent Automation
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Our AI solutions automate repetitive tasks, allowing your team to focus 
                          on strategic initiatives that drive business growth.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          Data-Driven Insights
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Leverage AI analytics to gain deeper insights into your customers, 
                          market trends, and business performance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Discover how AI can transform your business. Explore our AI solutions from the sidebar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col lg:flex-row">
              <SidebarNav 
                title="AI Solutions"
                basePath="/ai-solutions"
                links={subPages}
              />
              <div className="flex-1">
                <Outlet />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AISolutionsPage;
