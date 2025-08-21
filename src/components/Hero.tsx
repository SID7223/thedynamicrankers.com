import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  // Subtle background radial color animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      if (bgRef.current) {
        bgRef.current.style.background = `radial-gradient(
          circle at ${x * 100}% ${y * 100}%,
          rgba(59, 130, 246, 0.2),  /* blue-500 */
          rgba(139, 92, 246, 0.2)   /* purple-500 */
        )`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 sm:pt-0"
    >
      {/* Background layers */}
      <div ref={bgRef} className="absolute inset-0 transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900" />
      <div className="absolute inset-0 bg-black opacity-20" />

      {/* Blurred glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-screen pt-20 sm:pt-0">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Elevate Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block pb-4">
                Digital Presence
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed px-4">
              We specialize in Digital Marketing, SEO, SEM, social media marketing,
              and customer support to help your business dominate the digital landscape.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto px-4">
              <Link
                to="/book-a-call-meeting"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/our-services"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>View Our Services</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 text-center px-4 w-full max-w-sm sm:max-w-none mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 sm:p-8 hover:bg-opacity-20 transition-all duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-white mb-3">50+</div>
                <p className="text-blue-100 text-sm sm:text-lg">Projects Completed</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 sm:p-8 hover:bg-opacity-20 transition-all duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-white mb-3">24/7</div>
                <p className="text-blue-100 text-sm sm:text-lg">Customer Support</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 sm:p-8 hover:bg-opacity-20 transition-all duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-white mb-3">100%</div>
                <p className="text-blue-100 text-sm sm:text-lg">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
