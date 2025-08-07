import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SidebarNavProps {
  title: string;
  basePath: string;
  links: Array<{
    path: string;
    title: string;
    description: string;
  }>;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ title, basePath, links }) => {
  const location = useLocation();

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Explore our comprehensive solutions
        </p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link, index) => {
            const fullPath = `${basePath}/${link.path}`;
            const isActive = location.pathname === fullPath;
            
            return (
              <li key={index}>
                <Link
                  to={fullPath}
                  className={`block p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{link.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {link.description}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarNav;
