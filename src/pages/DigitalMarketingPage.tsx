import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from '../components/SidebarNav';

const DigitalMarketingPage = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/digital-marketing';

  const subPages = [
    {
      path: 'digital-marketing-solution',
      title: 'Digital Marketing Solution',
      description: 'Comprehensive digital marketing strategies tailored for USA businesses'
    },
    {
      path: 'scope-of-digital-marketing',
      title: 'Scope of Digital Marketing',
      description: 'Understanding the full potential and reach of digital marketing'
    },
    {
      path: 'what-is-digital-marketing',
      title: 'What is Digital Marketing',
      description: 'Complete guide to digital marketing fundamentals and benefits'
    },
    {
      path: 'digital-growth-impact',
      title: 'Digital Growth Impact',
      description: 'Measuring and maximizing your digital marketing ROI'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Digital Marketing Services USA - The Dynamic Rankers</title>
        <meta name="description" content="Professional digital marketing services in USA. Boost your online presence with SEO, SEM, social media marketing, and comprehensive digital strategies from The Dynamic Rankers." />
        <meta name="keywords" content="digital marketing, USA, SEO, SEM, social media marketing, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {isMainPage ? (
            <>
              {/* Hero Section */}
              <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
                <div className="container mx-auto px-4 text-center">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                    Digital Marketing Solutions
                  </h1>
                  <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto mb-8">
                    Transform your business with comprehensive digital marketing strategies designed for USA businesses. 
                    The Dynamic Rankers delivers results-driven solutions that boost your online presence.
                  </p>
                </div>
              </section>

              {/* Main Content with Sidebar */}
              <div className="flex flex-col lg:flex-row">
                <SidebarNav 
                  title="Digital Marketing"
                  basePath="/digital-marketing"
                  links={subPages}
                />
                
                <div className="flex-1 p-8">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                      Why Choose Digital Marketing?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      In today's competitive landscape, digital marketing is essential for business growth. 
                      The Dynamic Rankers specializes in creating comprehensive digital marketing strategies 
                      that drive real results for businesses across the USA.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          Comprehensive Strategy
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Our digital marketing approach covers all aspects of online presence, 
                          from SEO and content marketing to social media and paid advertising.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          USA-Focused Expertise
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          We understand the USA market dynamics and create campaigns that 
                          resonate with American audiences and drive local engagement.
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Ready to explore our digital marketing solutions? Choose a topic from the sidebar to learn more.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col lg:flex-row">
              <SidebarNav 
                title="Digital Marketing"
                basePath="/digital-marketing"
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

export default DigitalMarketingPage;
