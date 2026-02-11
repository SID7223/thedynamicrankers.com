import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<{ [key: string]: boolean }>({});
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
    setActiveDropdown(null);
    setMobileDropdowns({});
  };

  const toggleMobileDropdown = (key: string) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuItems = [
    {
      name: 'home',
      path: '/',
      label: 'Home'
    },
    {
      name: 'digital-marketing',
      path: '/digital-marketing',
      label: 'Digital Marketing',
      subItems: [
        { path: '/digital-marketing/digital-marketing-solution', label: 'Digital Marketing Solution' },
        { path: '/digital-marketing/scope-of-digital-marketing', label: 'Scope of Digital Marketing' },
        { path: '/digital-marketing/what-is-digital-marketing', label: 'What is Digital Marketing' },
        { path: '/digital-marketing/digital-growth-impact', label: 'How it Affects Your Growth' }
      ]
    },
    {
      name: 'ai-solutions',
      path: '/ai-solutions',
      label: 'AI Solutions',
      subItems: [
        { path: '/ai-solutions/ai-web-automation', label: 'AI Web Automation' },
        { path: '/ai-solutions/ai-content-tools', label: 'AI Content Tools' },
        { path: '/ai-solutions/ai-marketing-insights', label: 'AI Marketing Insights' },
        { path: '/ai-solutions/ai-seo-enhancement', label: 'AI SEO Enhancement' }
      ]
    },
    {
      name: 'create-website',
      path: '/create-website',
      label: 'Create Your Website',
      subItems: [
        { path: '/create-website/design-your-site', label: 'Design Your Site' },
        { path: '/create-website/custom-coding-options', label: 'Custom Coding Options' },
        { path: '/create-website/seo-foundation-setup', label: 'SEO Foundation Setup' },
        { path: '/create-website/us-based-deployment', label: 'US-Based Deployment' }
      ]
    },
    {
      name: 'content-creation',
      path: '/content-creation',
      label: 'Content Creation',
      subItems: [
        { path: '/content-creation/copywriting-services', label: 'Copywriting Services' },
        { path: '/content-creation/video-editing-services', label: 'Video Editing Services' },
        { path: '/content-creation/blog-article-planning', label: 'Blog Article Planning' },
        { path: '/content-creation/social-post-design', label: 'Social Post Design' }
      ]
    },
    {
      name: 'crm',
      path: '/crm',
      label: 'CRM Solutions'
    }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-1.5 sm:py-2'
        : 'bg-transparent py-3 sm:py-3'
    }`} style={{
      transform: 'translateY(0)',
      opacity: 1,
      pointerEvents: 'auto'
    }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4 group" onClick={closeMenu}>
            <div className="squircle w-8 h-8 sm:w-9 sm:h-9 bg-white dark:bg-black transition-all duration-300 flex-shrink-0 group-hover:scale-110">
              <img
                src="/the copy copy.png"
                alt="The Dynamic Rankers Logo"
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain transition-all duration-300 brightness-0 dark:brightness-100"
              />
            </div>
            <span className="text-base sm:text-lg font-bold text-black dark:text-white transition-colors duration-300 whitespace-nowrap">
              The Dynamic Rankers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.subItems && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-gray-700 dark:text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 ${location.pathname.startsWith(item.path) && item.path !== '/' ? 'text-blue-600 bg-blue-50 dark:bg-gray-800' : ''}`}
                >
                  <span>{item.label}</span>
                  {item.subItems && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`} />
                  )}
                </Link>

                {/* Desktop Dropdown */}
                {item.subItems && (
                  <div className={`absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 transform origin-top ${
                    activeDropdown === item.name 
                      ? 'opacity-100 scale-y-100 translate-y-0' 
                      : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
                  }`}>
                    <div className="py-2">
                      {item.subItems.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.path}
                          className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={closeMenu}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 text-gray-800 dark:text-white`} />
            ) : (
              <Menu className={`w-6 h-6 text-gray-800 dark:text-white`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 mt-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <nav className="py-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.path}
                      onClick={item.subItems ? undefined : closeMenu}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        location.pathname.startsWith(item.path) && item.path !== '/' 
                          ? 'text-blue-600 bg-blue-50 dark:bg-gray-700' 
                          : 'text-gray-700 dark:text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.subItems && (
                      <button
                        onClick={() => toggleMobileDropdown(item.name)}
                        className="px-4 py-3 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          mobileDropdowns[item.name] ? 'rotate-180' : ''
                        }`} />
                      </button>
                    )}
                  </div>

                  {/* Mobile Dropdown */}
                  {item.subItems && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileDropdowns[item.name] 
                        ? 'max-h-64 opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}>
                      <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                        {item.subItems.map((subItem, index) => (
                          <Link
                            key={index}
                            to={subItem.path}
                            className="block px-8 py-3 text-sm text-gray-600 dark:text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-200"
                            onClick={closeMenu}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
