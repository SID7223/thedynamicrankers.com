import React from 'react';
import { Calendar, Phone, Send } from 'lucide-react';

const BookACall: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full mr-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              Book a Call
            </h1>
          </div>
          <p className="text-base sm:text-xl text-gray-600 dark:text-white max-w-3xl mx-auto px-4">
            Ready to transform your business? Schedule a free consultation call with our experts and discover how we can help you achieve your goals.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
            {/* Benefits Cards */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center border border-gray-200 dark:border-gray-600">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Free Consultation</h3>
              <p className="text-sm text-gray-600 dark:text-white">No commitment, just valuable insights for your business</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center border border-gray-200 dark:border-gray-600">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-gray-600 dark:text-white">Choose a time that works best for your schedule</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center border border-gray-200 dark:border-gray-600">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600 dark:text-white">We'll get back to you within 24 hours</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-600">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Schedule Your Free Consultation
            </h2>
            
            <form 
              name="book-a-call" 
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              action="/success" 
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="book-a-call" />
              <div hidden>
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="serviceOfInterest" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Service of Interest *
                  </label>
                  <select
                    name="serviceOfInterest"
                    id="serviceOfInterest"
                    required
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Select a Service</option>
                    <option value="ai-solutions">AI Solutions</option>
                    <option value="content-creation">Content Creation</option>
                    <option value="website-development">Website Development</option>
                    <option value="customer-support">Customer Support</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="seo-services">SEO Services</option>
                    <option value="search-engine-marketing">Search Engine Marketing</option>
                    <option value="social-media-marketing">Social Media Marketing</option>
                    <option value="all-services">All Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Tell us about your project *
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="Describe your business goals, challenges, and how we can help you succeed..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Project Timeline
                </label>
                <select
                  name="timeline"
                  id="timeline"
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="3-months">Within 3 months</option>
                  <option value="6-months">Within 6 months</option>
                  <option value="planning">Just planning ahead</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Free Consultation</span>
                <Send className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                By submitting this form, you agree to receive communications from us. We respect your privacy and will never share your information.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookACall;
