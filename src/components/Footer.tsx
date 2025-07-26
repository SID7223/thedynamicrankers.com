import React from 'react';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/the copy.png" 
                alt="The Dynamic Rankers Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
              <span className="text-xl font-bold">The Dynamic Rankers</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
              Elevating your digital presence through innovative web solutions, 
              strategic marketing, and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 dark:bg-gray-700 hover:bg-blue-600 p-2 rounded-full transition-colors duration-300">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/the-dynamic-rankers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.instagram.com/thedynamicrankers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-300">Website Development</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">SEO Services</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">Search Engine Marketing</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">Social Media Marketing</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">Customer Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">Portfolio</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">Career</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-sm sm:text-base text-gray-400">eric@thedynamicrankers.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-sm sm:text-base text-gray-400">+1 (346) 556-1173</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-sm sm:text-base text-gray-400">234 Westheimer Rd, Apt 101, Houston, TX 77077</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm sm:text-base text-gray-400">
            © {2023} The Dynamic Rankers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;