import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
const Portfolio: React.FC = () => {
  const projects = [
    { title: 'Project One', description: 'A brief description of project one.', thumbnail: 'https://via.placeholder.com/300x200' },
    { title: 'Project Two', description: 'A brief description of project two.', thumbnail: 'https://via.placeholder.com/300x200' },
    { title: 'Project Three', description: 'A brief description of project three.', thumbnail: 'https://via.placeholder.com/300x200' },
    { title: 'Project Four', description: 'A brief description of project four.', thumbnail: 'https://via.placeholder.com/300x200' },
    { title: 'Project Five', description: 'A brief description of project five.', thumbnail: 'https://via.placeholder.com/300x200' },
    { title: 'Project Six', description: 'A brief description of project six.', thumbnail: 'https://via.placeholder.com/300x200' },
  ];
  return (
    <>
      <Helmet>
        <title>Portfolio - Your Website Name</title>
        <meta name="description" content="Explore our recent projects." />
        <meta property="og:title" content="Portfolio - Your Website Name" />
        <meta property="og:description" content="Explore our recent projects." />
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
              Our Portfolio
            </motion.h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="relative rounded-lg shadow-lg overflow-hidden group bg-white dark:bg-gray-800"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={project.thumbnail} alt={project.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                    <h2 className="text-2xl font-semibold text-white mb-2">{project.title}</h2>
                    <p className="text-gray-300 text-center">{project.description}</p>
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
