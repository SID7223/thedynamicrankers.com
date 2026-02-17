import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const CRMHeader = () => {
  const [isCrmMenuOpen, setIsCrmMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeCrmMenu = () => {
    setIsCrmMenuOpen(false);
  };

  const navLinks = [
    { label: 'Features', href: '/crm#features', isAnchor: true },
    { label: 'Industries', href: '/crm#industries', isAnchor: true },
    { label: 'Success Stories', href: '/crm#testimonials', isAnchor: true },
    { label: 'All Features', href: '/crm/features' },
    { label: 'Case Studies', href: '/crm/case-studies' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-3'
        : 'bg-white dark:bg-gray-900 py-4 shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4 group" onClick={closeCrmMenu}>
              <div className="squircle w-10 h-10 bg-white dark:bg-black transition-all duration-300 flex-shrink-0 group-hover:scale-110">
                <img
                  src="/the copy copy.png"
                  alt="The Dynamic Rankers Logo"
                  className="w-6 h-6 object-contain transition-all duration-300 brightness-0 dark:brightness-100"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800 dark:text-white block leading-none">The Dynamic Rankers</span>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">CRM Solutions</div>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              link.isAnchor ? (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={index}
                  to={link.href}
                  className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors ${location.pathname === link.href ? 'text-blue-600 dark:text-blue-400' : ''}`}
                >
                  {link.label}
                </Link>
              )
            ))}
            <a href="/crm#demo" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Request Demo</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsCrmMenuOpen(!isCrmMenuOpen)}
          >
            {isCrmMenuOpen ? (
              <X className="w-6 h-6 text-gray-800 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isCrmMenuOpen
            ? 'max-h-screen opacity-100 mt-4'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <nav className="py-2">
              {navLinks.map((link, index) => (
                link.isAnchor ? (
                  <a
                    key={index}
                    href={link.href}
                    onClick={closeCrmMenu}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 font-medium transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={index}
                    to={link.href}
                    onClick={closeCrmMenu}
                    className={`block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 font-medium transition-colors duration-200 ${location.pathname === link.href ? 'text-blue-600 dark:text-blue-400' : ''}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <a
                href="/crm#demo"
                onClick={closeCrmMenu}
                className="block mx-4 my-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                Request Demo
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CRMHeader;
