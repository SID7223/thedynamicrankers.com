import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 sm:pt-0 bg-white dark:bg-gray-900 transition-colors duration-500"
    >
      <style>
        {`
          @keyframes shine {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
          }
          .glare-text {
            background: linear-gradient(90deg, var(--glare-color) 0%, var(--glare-color) 45%, #ffffff 50%, var(--glare-color) 55%, var(--glare-color) 100%);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: shine 6s linear infinite;
          }
        `}
      </style>

      {/* Blurred glows (toned down for light mode) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 opacity-[0.05] dark:opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 opacity-[0.05] dark:opacity-10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-screen pt-20 sm:pt-0">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#0a0d36] dark:text-white mb-4 leading-tight">
              Elevate Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block pb-2">
                Digital Presence
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-[#0a0d36] dark:text-white mb-10 leading-relaxed px-4 glare-text [--glare-color:#0a0d36] dark:[--glare-color:white]">
              Universal digital solutions for effortless growth and market dominance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto px-4 mb-16">
              <Link
                to="/book-a-call-meeting"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/our-services"
                className="w-full sm:w-auto border-2 border-[#0a0d36] dark:border-white text-[#0a0d36] dark:text-white hover:bg-[#0a0d36] dark:hover:bg-white hover:text-white dark:hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>View Our Services</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className="text-[#0a0d36] dark:text-gray-300 mb-6 font-medium opacity-80">
                Trusted by businesses across the USA
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 opacity-60">
                <div className="text-sm sm:text-base font-semibold text-[#0a0d36] dark:text-gray-400 hover:opacity-100 transition-opacity">
                  Pro Chicago Painters
                </div>
                <div className="text-sm sm:text-base font-semibold text-[#0a0d36] dark:text-gray-400 hover:opacity-100 transition-opacity">
                  Champion Roofing
                </div>
                <div className="text-sm sm:text-base font-semibold text-[#0a0d36] dark:text-gray-400 hover:opacity-100 transition-opacity">
                  GoLoadUp Baltimore
                </div>
                <div className="text-sm sm:text-base font-semibold text-[#0a0d36] dark:text-gray-400 hover:opacity-100 transition-opacity">
                  + 50 More Businesses
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
