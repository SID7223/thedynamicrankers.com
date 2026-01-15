import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const blogPosts = [
    { 
      slug: 'ai-powered-crms-revolutionizing-sales',
      title: 'How AI-Powered CRMs are Revolutionizing Sales in 2025', 
      date: 'January 10, 2026', 
      excerpt: 'Discover how predictive analytics and automated lead scoring are helping small businesses close deals 3x faster than traditional methods.', 
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      category: 'CRM Solutions'
    },
    { 
      slug: 'future-of-seo-user-intent',
      title: 'The Future of SEO: Beyond Keywords to User Intent', 
      date: 'December 28, 2025', 
      excerpt: 'Search engines now prioritize "helpful content" over keyword density. Learn the new rules of ranking high on Google’s ever-evolving algorithm.', 
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      category: 'SEO Services'
    },
    { 
      slug: 'web-design-trends-2025',
      title: '7 High-Converting Web Design Trends for Service Agencies', 
      date: 'December 15, 2025', 
      excerpt: 'From micro-interactions to mobile-first speed optimization, here is what your website needs to turn casual visitors into loyal customers.', 
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
      category: 'Web Development'
    },
    { 
      slug: 'maximizing-roi-multi-channel',
      title: 'Maximizing ROI: Why Multi-Channel Marketing is Mandatory', 
      date: 'November 30, 2025', 
      excerpt: 'Relying on just one social platform is a risk. We break down how to synchronize your Meta, Google, and Email campaigns for maximum impact.', 
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      category: 'Digital Marketing'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Blog & Insights - The Dynamic Rankers</title>
        <meta name="description" content="Read the latest insights on SEO, CRM automation, and digital marketing strategies from The Dynamic Rankers." />
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
                Insights & Industry Trends
              </motion.h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Stay ahead of the competition with our expert takes on the latest in technology and digital growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700"
                  whileHover={{ translateY: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 sm:h-56">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <time className="text-sm text-blue-500 dark:text-blue-400 font-medium mb-2">{post.date}</time>
                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                      {post.excerpt}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline inline-flex items-center"
                    >
                      Read Full Article
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Blog;
