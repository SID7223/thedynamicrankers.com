import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from '../components/SidebarNav';

const ContentCreationPage = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/content-creation';

  const subPages = [
    {
      path: 'copywriting-services',
      title: 'Copywriting Services',
      description: 'Professional copywriting that converts visitors into customers'
    },
    {
      path: 'video-editing-services',
      title: 'Video Editing Services',
      description: 'Professional video editing for marketing and promotional content'
    },
    {
      path: 'blog-article-planning',
      title: 'Blog Article Planning',
      description: 'Strategic blog content planning and creation for better SEO'
    },
    {
      path: 'social-post-design',
      title: 'Social Post Design',
      description: 'Eye-catching social media designs that drive engagement'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Content Creation Services USA - The Dynamic Rankers</title>
        <meta name="description" content="Professional content creation services in USA. Copywriting, video editing, blog planning, and social media design from The Dynamic Rankers." />
        <meta name="keywords" content="content creation, copywriting, video editing, blog writing, social media design, USA, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {isMainPage ? (
            <>
              {/* Hero Section */}
              <section className="py-20 bg-gradient-to-br from-orange-600 to-red-700">
                <div className="container mx-auto px-4 text-center">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                    Content Creation Services
                  </h1>
                  <p className="text-lg sm:text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                    Engage your audience with compelling content that drives results. The Dynamic Rankers 
                    creates high-quality content for businesses across the USA.
                  </p>
                </div>
              </section>

              {/* Main Content with Sidebar */}
              <div className="flex flex-col lg:flex-row">
                <SidebarNav 
                  title="Content Creation"
                  basePath="/content-creation"
                  links={subPages}
                />
                
                <div className="flex-1 p-8">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                      Compelling Content That Converts
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      Great content is the foundation of successful digital marketing. The Dynamic Rankers 
                      creates engaging, high-quality content that resonates with your audience and drives 
                      business growth across all digital platforms.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          Strategic Content Planning
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          We develop comprehensive content strategies that align with your business 
                          goals and resonate with your target audience.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          Multi-Format Expertise
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          From written content to video production, we create content in all 
                          formats to maximize your reach and engagement.
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Ready to elevate your content strategy? Explore our content creation services from the sidebar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col lg:flex-row">
              <SidebarNav 
                title="Content Creation"
                basePath="/content-creation"
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

export default ContentCreationPage;
