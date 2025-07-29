import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Your Website Name</title>
        <meta name="description" content="Learn more about our company and mission." />
        <meta property="og:title" content="About Us - Your Website Name" />
        <meta property="og:description" content="Learn more about our company and mission." />
        <meta property="og:type" content="website" />
        {/* Add more meta tags as needed */}
      </Helmet>
      <div className="container mx-auto px-4 pt-16 pb-8">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.h1>
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src="https://via.placeholder.com/600x400" alt="About Us" className="rounded-lg shadow-lg w-full" />
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We are a dedicated team of professionals who are passionate about what they do. Our mission is to deliver high-quality solutions tailored to your needs, driven by creativity, innovation, and a commitment to excellence.
            </p>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Meet our dedicated team of professionals who are passionate about what they do. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            {/* You can add team member photos and names here */}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
