import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechStart Solutions",
      text: "The Dynamic Rankers transformed our online presence completely. Our website traffic increased by 300% and our search rankings improved dramatically.",
      rating: 5
    },
    {
      name: "Michael Chen",
      company: "E-Commerce Plus",
      text: "Their SEO and SEM strategies helped us achieve a 250% ROI on our digital marketing investment. Highly professional team!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      company: "Local Business Hub",
      text: "Outstanding social media marketing services. Our engagement rates doubled and we gained thousands of new followers.",
      rating: 5
    },
    {
      name: "David Thompson",
      company: "Service Pro Inc",
      text: "The customer support solutions they implemented have significantly improved our client satisfaction rates. Excellent work!",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-pulse transform scale-100"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-pulse delay-1000 transform scale-100"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 px-2">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto px-4">
            Don't just take our word for it. Here's what our satisfied clients have to say about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 sm:p-8 hover:bg-opacity-20 transition-all duration-300">
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300 mb-3 sm:mb-4" />
              
              <p className="text-white text-base sm:text-lg mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-blue-200 text-xs sm:text-sm">{testimonial.company}</p>
                </div>
                
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/contact"
            className="inline-block bg-white text-blue-900 hover:bg-blue-50 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
          >
            View More Reviews
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;