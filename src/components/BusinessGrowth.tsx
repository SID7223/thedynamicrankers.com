import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

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
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-[#02030b] dark:from-transparent dark:to-transparent transition-colors duration-300">
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
          {/* Enhanced Growth Chart using Recharts */}
          <div className="bg-gray-50 sm:bg-white dark:bg-gray-800 border border-gray-200 sm:border-transparent rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Average Business Growth Timeline
            </h3>
            
            <div className="h-48 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#60A5FA' }}
                    cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
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
