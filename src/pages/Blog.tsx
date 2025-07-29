import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
const Blog: React.FC = () => {
  const blogPosts = [
    { title: 'Blog Post One', date: 'July 26, 2024', excerpt: 'A short excerpt for blog post one.', image: 'https://via.placeholder.com/400x250' },
    { title: 'Blog Post Two', date: 'July 20, 2024', excerpt: 'A short excerpt for blog post two.', image: 'https://via.placeholder.com/400x250' },
    { title: 'Blog Post Three', date: 'July 15, 2024', excerpt: 'A short excerpt for blog post three.', image: 'https://via.placeholder.com/400x250' },
  ];
  return (
    <>
      <Helmet>
        <title>Blog - Your Website Name</title>
        <meta name="description" content="Read our latest articles and insights." />
        <meta property="og:title" content="Blog - Your Website Name" />
        <meta property="og:description" content="Read our latest articles and insights." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          <div className="max-w-6xl mx-auto p-8">
            <motion.h1 
              className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Blog
            </motion.h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ translateY: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">{post.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{post.date}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                    <button className="text-blue-600 hover:underline dark:text-blue-400">Read More</button>
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
export default Blog;
