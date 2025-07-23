import React from 'react';
import { X, Check } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    description: string;
    features: string[];
    detailedInfo: {
      overview: string;
      benefits: string[];
      process: string[];
      pricing: string;
      timeline: string;
    };
  } | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
  React.useEffect(() => {
    if (isOpen) {
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white bg-opacity-20 dark:bg-gray-900 dark:bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] mx-4 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold pr-4">{service.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100 mt-2 text-sm sm:text-base md:text-lg">{service.description}</p>
        </div>
        <div 
          className="p-4 sm:p-6 md:p-8 pr-2 sm:pr-4 space-y-6 sm:space-y-8 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(59, 130, 246, 0.5) transparent',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="max-h-[60vh] overflow-y-auto space-y-6 sm:space-y-8 pr-2 sm:pr-4" style={{
            scrollbarColor: 'rgba(59, 130, 246, 0.5) transparent',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}>
          {/* Overview */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white dark:text-gray-100 mb-4 border-l-4 border-blue-400 pl-4">Overview</h3>
            <div className="bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-500 ease-out hover:shadow-xl hover:scale-[1.02] hover:bg-opacity-100">
              <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed">{service.detailedInfo.overview}</p>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white dark:text-gray-100 mb-4 border-l-4 border-purple-400 pl-4">Key Benefits</h3>
            <div className="bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-500 ease-out hover:shadow-xl hover:scale-[1.02] hover:bg-opacity-100">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {service.detailedInfo.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1 mt-1 flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">{benefit}</span>
                </div>
              ))}
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white dark:text-gray-100 mb-4 border-l-4 border-blue-400 pl-4">Our Process</h3>
            <div className="bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-500 ease-out hover:shadow-xl hover:scale-[1.02] hover:bg-opacity-100">
              <div className="space-y-4">
              {service.detailedInfo.process.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 transform transition-all duration-300 ease-out hover:translate-x-2 hover:scale-105">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg flex-shrink-0 transition-all duration-300 ease-out hover:shadow-xl hover:scale-110">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 flex-1 font-medium leading-relaxed text-sm sm:text-base">{step}</p>
                </div>
              ))}
              </div>
            </div>
          </div>

          {/* Pricing & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-500 ease-out hover:shadow-2xl hover:scale-105 hover:bg-opacity-100 hover:-translate-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                Investment
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">{service.detailedInfo.pricing}</p>
            </div>
            <div className="bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-500 ease-out hover:shadow-2xl hover:scale-105 hover:bg-opacity-100 hover:-translate-y-2 delay-75">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                Timeline
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">{service.detailedInfo.timeline}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pb-6 sm:pb-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-2xl"
            >
              Get Started Now
            </button>
            <button 
              onClick={onClose}
              className="w-full sm:w-auto bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm border-2 border-white border-opacity-50 text-white hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-1 active:scale-95"
            >
              Contact Us
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;