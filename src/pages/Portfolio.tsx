import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Portfolio: React.FC = () => {
  const projects = [
    { 
      title: 'E-Commerce Growth Engine', 
      description: 'Built a custom Shopify headless store that increased mobile conversion rates by 45% and decreased load time by 2 seconds.', 
      thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800',
      category: 'Web Development'
    },
    { 
      title: 'Real Estate CRM Integration', 
      description: 'Implemented a custom CRM solution for a multi-state agency, automating 85% of lead follow-ups and increasing agent efficiency.', 
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
      category: 'CRM Solutions'
    },
    { 
      title: 'SaaS SEO Dominance', 
      description: 'Executed a content-led SEO strategy that took a Fintech startup from 0 to 150k monthly organic visitors in 12 months.', 
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      category: 'SEO Services'
    },
    { 
      title: 'Luxury Brand Rebranding', 
      description: 'Complete digital transformation for a boutique watchmaker, including high-end 4K video content and social media strategy.', 
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      category: 'Content Creation'
    },
    { 
      title: 'Multi-Channel Ad Campaign', 
      description: 'Managed a $50k/month PPC budget across Google and Meta, achieving a consistent 4.2x ROAS for a healthcare provider.', 
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      category: 'Digital Marketing'
    },
    { 
      title: 'Healthcare Patient Portal', 
      description: 'Developed a HIPAA-compliant secure portal for patient scheduling and records, improving patient retention by 30%.', 
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      category: 'Web Solutions'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Portfolio - The Dynamic Rankers</title>
        <meta name="description" content="Explore our successful projects in web development, SEO, and CRM solutions." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Proven Results
              </motion.h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore how we've helped businesses scale through innovative technology and strategic digital marketing.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {project.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="px-6 pb-6 mt-auto">
                    <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline flex items-center">
                      View Case Study
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Portfolio;
