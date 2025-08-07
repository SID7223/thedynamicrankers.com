import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from '../components/SidebarNav';

const CreateWebsitePage = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/create-website';

  const subPages = [
    {
      path: 'design-your-site',
      title: 'Design Your Site',
      description: 'Custom website design tailored to your brand and business goals'
    },
    {
      path: 'custom-coding-options',
      title: 'Custom Coding Options',
      description: 'Advanced development solutions with custom coding and functionality'
    },
    {
      path: 'seo-foundation-setup',
      title: 'SEO Foundation Setup',
      description: 'Build your website with strong SEO foundations for better rankings'
    },
    {
      path: 'us-based-deployment',
      title: 'US-Based Deployment',
      description: 'Fast, reliable hosting and deployment services in the USA'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Create Your Website - Professional Web Development USA | The Dynamic Rankers</title>
        <meta name="description" content="Create a professional website with The Dynamic Rankers. Custom design, coding, SEO setup, and US-based deployment for businesses across USA." />
        <meta name="keywords" content="website development, web design, USA, custom coding, SEO, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {isMainPage ? (
            <>
              {/* Hero Section */}
              <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-700">
                <div className="container mx-auto px-4 text-center">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                    Create Your Website
                  </h1>
                  <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                    Build a stunning, high-performance website that drives results. The Dynamic Rankers 
                    offers complete web development services for businesses across the USA.
                  </p>
                </div>
              </section>

              {/* Main Content with Sidebar */}
              <div className="flex flex-col lg:flex-row">
                <SidebarNav 
                  title="Create Your Website"
                  basePath="/create-website"
                  links={subPages}
                />
                
                <div className="flex-1 p-8">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                      Professional Website Development
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      Your website is your digital storefront. The Dynamic Rankers creates custom websites 
                      that not only look amazing but also perform exceptionally well in search engines and 
                      convert visitors into customers.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          Custom Design & Development
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Every website we create is unique, tailored to your brand identity 
                          and business objectives with modern design principles.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                          SEO-Optimized from Day One
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          We build SEO foundations into every website, ensuring your site 
                          is ready to rank well in search engines from launch.
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Ready to create your perfect website? Explore our development services from the sidebar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col lg:flex-row">
              <SidebarNav 
                title="Create Your Website"
                basePath="/create-website"
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

export default CreateWebsitePage;
