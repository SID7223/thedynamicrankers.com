import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

const BusinessGrowth = () => {
  const growthData = [
    { month: 'Month 1', value: 0 },
    { month: 'Month 2', value: 15 },
    { month: 'Month 3', value: 25 },
    { month: 'Month 4', value: 45 },
    { month: 'Month 5', value: 65 },
    { month: 'Month 6', value: 80 },
    { month: 'Month 7', value: 80 }
  ];

  // Create SVG path for the line
  const createPath = () => {
    const width = 100;
    const height = 100;
    // Only use first 7 data points (index 0-6) to stop at M7
    const points = growthData.slice(0, 7).map((data, index) => {
      const x = (index / 6) * (width * 0.875); // 7/8 of the width to stop at M7
      const y = height - data.value;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Our proven strategies help businesses achieve 200-400% revenue growth within the first year."
    },
    {
      icon: Users,
      title: "Expand Customer Base",
      description: "Reach new audiences and convert more visitors into loyal customers through targeted marketing."
    },
    {
      icon: DollarSign,
      title: "Maximize ROI",
      description: "Every dollar invested in our services generates an average return of $4-6 in increased revenue."
    },
    {
      icon: Target,
      title: "Dominate Your Market",
      description: "Outrank competitors and establish your brand as the industry leader in your niche."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 px-2">
            How We Help Grow Your Business
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Partner with us and watch your business transform. Our data-driven approach 
            delivers measurable results that accelerate your growth trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Growth Chart */}
          <div className="bg-gray-50 sm:bg-white dark:bg-gray-800 border border-gray-200 sm:border-transparent rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Average Business Growth Timeline
            </h3>
            
            <div className="relative h-48 sm:h-80 p-2 sm:p-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2 sm:pr-4">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-6 sm:ml-12 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[0, 20, 40, 60, 80, 100].map((value) => (
                    <div
                      key={value}
                      className="absolute w-full border-t border-gray-200 dark:border-gray-600"
                      style={{ bottom: `${value}%` }}
                    ></div>
                  ))}
                </div>
                
                {/* Line Graph */}
                <div className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Line path */}
                    <path
                      d={createPath()}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-blue-500 dark:text-purple-400 transition-colors duration-300"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        strokeDasharray: '1000',
                        strokeDashoffset: '1000',
                        animation: 'drawLineEased 15s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
                        animationDelay: '0s',
                        animationIterationCount: 'infinite',
                        animationDirection: 'normal',
                        animationFillMode: 'forwards'
                      }}
                    />
                  </svg>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-2">
                  {[
                    { month: 'Month 1' },
                    { month: 'Month 2' },
                    { month: 'Month 3' },
                    { month: 'Month 4' },
                    { month: 'Month 5' },
                    { month: 'Month 6' },
                    { month: 'Month 7' },
                    { month: 'Month 8' }
                  ].map((data, index) => (
                    <span key={index} className="text-xs text-gray-600 dark:text-gray-400 text-center" style={{ fontSize: '10px' }}>
                      {data.month.replace('Month ', 'M')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                * Results based on average client performance over 6 months
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="bg-gray-50 sm:bg-white dark:bg-gray-800 border border-gray-200 sm:border-transparent rounded-xl shadow-md sm:shadow-lg p-4 sm:p-8 border-l-4 border-blue-500">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Transform Your Business Today
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Don't let your competitors get ahead. Our comprehensive digital solutions 
                are designed to accelerate your business growth and establish your market dominance.
              </p>
              
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link 
                  to="/book-a-call-meeting"
                  className="inline-block w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                >
                  Start Growing Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGrowth;
