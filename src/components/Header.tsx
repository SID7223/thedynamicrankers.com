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
    { name: 'contact', path: '/contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white dark:bg-gray-900 shadow-lg py-3 sm:py-4' 
        : 'bg-gradient-to-b from-black/20 via-black/10 to-transparent sm:bg-transparent py-4 sm:py-6 -translate-y-full opacity-0 pointer-events-none'
    }`} style={{
      transform: isScrolled ? 'translateY(0)' : 'translateY(-100%)',
      opacity: isScrolled ? 1 : 0
    }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/the copy.png" 
              alt="The Dynamic Rankers Logo" 
              className={`w-8 h-8 sm:w-10 sm:h-10 object-contain transition-all duration-300 ${
                isScrolled && !document.documentElement.classList.contains('dark') 
                  ? 'brightness-0' 
                  : ''
              }`}
            />
            <span className={`text-xl font-bold ${
              isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'
            }`}>
              <span className="text-base sm:text-xl">The Dynamic Rankers</span>
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`capitalize font-medium text-sm sm:text-base transition-colors duration-200 hover:text-blue-600 ${
                  isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white hover:text-blue-200'
                } ${location.pathname === item.path ? 'text-blue-600' : ''}`}
              >
                {item.name}
              </Link>
            ))}
            </nav>
            
            {/* Menu Button */}
            <div className="hidden md:flex">
              <button
                className="gradient-border-button hover:scale-105 active:scale-95"
              >
                <span className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white hover:text-white'
                } gradient-border-button-inner`}>
                  Menu
                </span>
              </button>
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`w-5 h-5 sm:w-6 sm:h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`w-5 h-5 sm:w-6 sm:h-6 ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 sm:mt-4 py-3 sm:py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={`capitalize font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 text-left px-3 sm:px-4 py-2 ${
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