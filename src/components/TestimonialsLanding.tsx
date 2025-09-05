import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowRight, CheckCircle } from 'lucide-react';

const TestimonialsLanding = () => {
  const testimonials = [
    {
      name: "Mike Rodriguez",
      company: "Pro Chicago Painters",
      website: "prochicagopainters.com",
      text: "The Dynamic Rankers transformed our online presence completely. Our website traffic increased by 400% and we're now ranking #1 for 'Chicago painters' on Google. The ROI has been incredible!",
      rating: 5,
      results: "+400% Website Traffic",
      industry: "Home Services",
      image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&fm=webp"
    },
    {
      name: "Sarah Johnson",
      company: "Champion Roofing",
      website: "championroofing.com",
      text: "Working with The Dynamic Rankers was a game-changer. Our lead generation increased by 350% and our social media engagement skyrocketed. They truly understand the roofing industry!",
      rating: 5,
      results: "+350% Lead Generation",
      industry: "Construction",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&fm=webp"
    },
    {
      name: "David Chen",
      company: "GoLoadUp Baltimore",
      website: "goloadup.com/baltimore",
      text: "The SEO and local marketing strategies from The Dynamic Rankers helped us dominate the Baltimore market. We went from page 3 to #1 for 'junk removal Baltimore' in just 4 months!",
      rating: 5,
      results: "#1 Local Rankings",
      industry: "Waste Management",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&fm=webp"
    }
  ];

  const stats = [
    { number: "300%", label: "Average Traffic Increase" },
    { number: "4-6x", label: "Return on Investment" },
    { number: "90%", label: "Client Retention Rate" },
    { number: "24hrs", label: "Response Time" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            Real Results from Real Businesses
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Don't just take our word for it. See how The Dynamic Rankers has transformed businesses 
            across different industries with proven digital marketing strategies.
          </p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-600">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.number}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-blue-500 mb-4" />
              
              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Results Badge */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                {testimonial.results}
              </div>

              {/* Client Info */}
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{testimonial.website}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {testimonial.industry}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16 border border-gray-200 dark:border-gray-600">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Industry Success Stories
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏠</span>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Home Services</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Painting, roofing, and home improvement companies see average 300% traffic increases
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚛</span>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Service Industries</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Junk removal, cleaning, and logistics companies dominate local search results
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">💼</span>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Professional Services</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Consultants, agencies, and B2B services achieve 4-6x ROI on marketing spend
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Join Our Success Stories?
          </h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            These results aren't accidents—they're the outcome of proven strategies, 
            dedicated execution, and partnership with businesses that are serious about growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/book-a-call-meeting"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <span>Get Your Free Strategy Session</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/our-services"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>View All Services</span>
            </Link>
          </div>
          
          <p className="text-sm text-blue-100 mt-6">
            🔥 Limited Time: Free comprehensive digital marketing audit for new clients
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Trusted by businesses across the USA
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Pro Chicago Painters
            </div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Champion Roofing
            </div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              GoLoadUp Baltimore
            </div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              + 50 More Businesses
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsLanding;