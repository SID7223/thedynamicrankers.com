import React from 'react';
import { Link } from 'react-router-dom';

const CRMFooter = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/the copy copy.png"
                alt="The Dynamic Rankers Logo"
                className="w-8 h-8 object-contain"
              />
              <div>
                <span className="text-lg font-bold">The Dynamic Rankers</span>
                <div className="text-sm text-blue-400">CRM Solutions</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Transforming customer relationships through intelligent CRM solutions
              that drive business growth and operational efficiency.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">CRM Solutions</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/crm#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="/crm#industries" className="hover:text-white transition-colors">Industries</a></li>
              <li><a href="/crm#testimonials" className="hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="/crm#demo" className="hover:text-white transition-colors">Request Demo</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Main Website</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/our-services" className="hover:text-white transition-colors">All Services</Link></li>
              <li><Link to="/digital-marketing" className="hover:text-white transition-colors">Digital Marketing</Link></li>
              <li><Link to="/book-a-call-meeting" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 The Dynamic Rankers. All rights reserved. | CRM Solutions Division
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CRMFooter;
