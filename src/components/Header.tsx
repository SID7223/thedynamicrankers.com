import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'home', path: '/' },
    { name: 'services', path: '/services' },
    { name: 'about', path: '/about' },
    { name: 'testimonials', path: '/testimonials' },
    { name: 'contact', path: '/contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white dark:bg-gray-900 shadow-lg py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/the copy.png" 
              alt="The Dynamic Rankers Logo" 
              className={`w-10 h-10 object-contain transition-all duration-300 ${
                isScrolled && !document.documentElement.classList.contains('dark') 
                  ? 'brightness-0' 
                  : ''
              }`}
            />
            <span className={`text-xl font-bold ${
              isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'
            }`}>
              The Dynamic Rankers
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`capitalize font-medium transition-colors duration-200 hover:text-blue-600 ${
                  isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white hover:text-blue-200'
                } ${location.pathname === item.path ? 'text-blue-600' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={`capitalize font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 text-left px-4 py-2 ${
                    location.pathname === item.path ? 'text-blue-600' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;