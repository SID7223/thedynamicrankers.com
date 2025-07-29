import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaFacebook, FaLinkedin, FaInstagram, FaCommentDots, FaSun } from 'react-icons/fa';

const AboutUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us - The Dynamic Rankers</title>
        <meta name="description" content="Learn more about The Dynamic Rankers and our mission to elevate your digital presence." />
        <meta property="og:title" content="About Us - The Dynamic Rankers" />
        <meta property="og:description" content="Learn more about The Dynamic Rankers and our mission to elevate your digital presence." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Header with Navigation */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-blue-600"
          >
            The Dynamic Rankers
          </motion.div>
          
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex space-x-6"
          >
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Digital Marketing</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">AI Solutions</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Create Your Website</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">Content Creation</a>
          </motion.nav>
          
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaSun className="text-gray-600" />
          </motion.button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.h1>
        
        <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-12">
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Meet our dedicated team of professionals who are passionate about what they do. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              <h3 className="text-xl font-semibold mb-4">The Dynamic Rankers</h3>
              <p className="mb-4">
                Elevating your digital presence through innovative web solutions, strategic marketing, and exceptional customer service.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-400 transition"><FaFacebook size={24} /></a>
                <a href="#" className="text-white hover:text-blue-400 transition"><FaLinkedin size={24} /></a>
                <a href="#" className="text-white hover:text-blue-400 transition"><FaInstagram size={24} /></a>
              </div>
            </motion.div>
            
            {/* Our Services */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Website Development</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">SEO Services</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Search Engine Marketing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Social Media Marketing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Customer Support</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Our Services</a></li>
              </ul>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Portfolio</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Career</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              </ul>
            </motion.div>
          </div>
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="border-t border-gray-700 mt-8 pt-8"
          >
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium">Email:</p>
                <p>eric@thedynamicrankers.com</p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <p>+1 (346) 556-1173</p>
              </div>
              <div>
                <p className="font-medium">Address:</p>
                <p>234 Westheimer Rd, Apt 101, Houston, TX 77077</p>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
      
      {/* Chat Bubble */}
      <motion.button 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FaCommentDots size={24} />
      </motion.button>
    </>
  );
};

export default AboutUs;
