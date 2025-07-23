import React from 'react';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

const BusinessGrowth = () => {
  const growthData = [
    { month: 'Month 1', value: 20 },
    { month: 'Month 2', value: 35 },
    { month: 'Month 3', value: 55 },
    { month: 'Month 4', value: 75 },
    { month: 'Month 5', value: 90 },
    { month: 'Month 6', value: 100 }
  ];

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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 px-2">
            How We Help Grow Your Business
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Partner with us and watch your business transform. Our data-driven approach 
            delivers measurable results that accelerate your growth trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Growth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Average Business Growth Timeline
            </h3>
            
            <div className="relative h-64 sm:h-80">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 pr-2 sm:pr-4">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-8 sm:ml-12 h-full relative">
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
                
                {/* Bars */}
                <div className="flex items-end justify-between h-full pt-4">
                  {growthData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 mx-0.5 sm:mx-1">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg transition-all duration-1000 ease-out hover:from-blue-600 hover:to-purple-700 relative group"
                        style={{ 
                          height: `${data.value}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      >
                        <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 sm:px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {data.value}%
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center leading-tight">
                        {data.month}
                      </span>
                    </div>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-blue-500">
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
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-white" />
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
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Start Growing Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGrowth;