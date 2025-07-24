import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 sm:pt-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900"></div>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-start sm:justify-center min-h-[80vh] sm:min-h-screen pt-20 sm:pt-0">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight sm:leading-normal">
            Elevate Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block pb-4">
              Digital Presence
            </span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed px-2">
            We specialize in website development, SEO, SEM, social media marketing, 
            and customer support to help your business dominate the digital landscape.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 w-full max-w-md sm:max-w-none mx-auto">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              to="/services"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-800 px-6 sm:px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>View Our Services</span>
            </Link>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center px-4 w-full max-w-sm sm:max-w-none mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 sm:p-8 hover:bg-opacity-20 transition-all duration-300">
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3">50+</h3>
              <p className="text-blue-100 text-base sm:text-lg">Projects Completed</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 sm:p-8 hover:bg-opacity-20 transition-all duration-300">
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3">24/7</h3>
              <p className="text-blue-100 text-base sm:text-lg">Customer Support</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 sm:p-8 hover:bg-opacity-20 transition-all duration-300">
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3">100%</h3>
              <p className="text-blue-100 text-base sm:text-lg">Client Satisfaction</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;