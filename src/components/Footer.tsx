import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = 2023;
  const location = useLocation();

  // Helper function to check if link is active
  const isActiveLink = (path: string) => location.pathname === path;

  // Link component with active state styling
  const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link 
      to={to}
      className={`text-sm sm:text-base transition-colors duration-300 ${
        isActiveLink(to)
          ? 'text-blue-400 font-semibold' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <footer className="bg-gray-900 dark:bg-black text-white pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/the copy copy.png" 
                alt="The Dynamic Rankers Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
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
              <li><FooterLink to="/website-development">Website Development</FooterLink></li>
              <li><FooterLink to="/seo-services">SEO Services</FooterLink></li>
              <li><FooterLink to="/search-engine-marketing">Search Engine Marketing</FooterLink></li>
              <li><FooterLink to="/social-media-marketing">Social Media Marketing</FooterLink></li>
              <li><FooterLink to="/customer-support">Customer Support</FooterLink></li>
              <li><FooterLink to="/our-services">Our Services</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><FooterLink to="/about-us">About Us</FooterLink></li>
              <li><FooterLink to="/portfolio">Portfolio</FooterLink></li>
              <li><FooterLink to="/blog">Blog</FooterLink></li>
              <li><FooterLink to="/career">Career</FooterLink></li>
              <li><FooterLink to="/privacy-policy">Privacy Policy</FooterLink></li>
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
                <span className="text-sm sm:text-base text-gray-400">327 Lancaster St. Houston, TX 77026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm sm:text-base text-gray-400">
            © {currentYear} The Dynamic Rankers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
