import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Clock, Zap } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Award, number: "5+", label: "Years Experience" },
    { icon: Users, number: "100+", label: "Happy Clients" },
    { icon: Clock, number: "24/7", label: "Support Available" },
    { icon: Zap, number: "99%", label: "Project Success Rate" }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              About The Dynamic Rankers
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              We are a passionate team of digital marketing experts and web developers 
              dedicated to helping businesses achieve their online goals. Our comprehensive 
              approach combines cutting-edge technology with proven marketing strategies.
            </p>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              From custom website development to advanced SEO techniques, we provide 
              end-to-end solutions that drive real results. Our commitment to excellence 
              and client satisfaction has made us a trusted partner for businesses 
              looking to dominate their digital landscape.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/book-a-call-meeting"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-center"
              >
                Book a Call
              </Link>
              <Link 
                to="/testimonials"
                className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-center"
              >
                View Portfolio
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-8">
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-gray-50 sm:bg-white dark:bg-gray-600 border border-gray-200 sm:border-transparent rounded-xl p-3 sm:p-6 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3 sm:mb-4 mx-auto">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">{stat.number}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="hidden md:block absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse transform scale-100"></div>
            <div className="hidden md:block absolute -bottom-4 -left-4 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 animate-pulse delay-1000 transform scale-100"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;