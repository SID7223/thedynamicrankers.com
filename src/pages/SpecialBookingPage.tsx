import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Calendar, Clock, Phone, Video, CheckCircle } from 'lucide-react';

const SpecialBookingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'call' | 'meeting'>('call');

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgGradient = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(
      600px circle at ${x}px ${y}px,
      rgba(59, 130, 246, 0.15),
      rgba(147, 51, 234, 0.1),
      transparent 80%
    )`
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (bounds) {
        mouseX.set(e.clientX - bounds.left);
        mouseY.set(e.clientY - bounds.top);
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
    }
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <Helmet>
        <title>Special Booking - The Dynamic Rankers</title>
        <meta name="description" content="Exclusive booking page for scheduling consultations with The Dynamic Rankers team." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <motion.div
        ref={containerRef}
        style={{ backgroundImage: bgGradient }}
        className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
      >

        <main className="pt-20">
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                  Exclusive Booking Portal
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Choose your preferred way to connect with our team. We're here to help transform your business.
                </p>
              </div>

              <div className="max-w-6xl mx-auto">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setActiveTab('call')}
                      className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 flex items-center space-x-2 ${
                        activeTab === 'call'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
                      }`}
                    >
                      <Phone className="w-5 h-5" />
                      <span>Schedule a Call</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('meeting')}
                      className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 flex items-center space-x-2 ${
                        activeTab === 'meeting'
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:text-purple-500'
                      }`}
                    >
                      <Video className="w-5 h-5" />
                      <span>Book Google Meeting</span>
                    </button>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Schedule a Call Section - Using book-a-call form */}
                  <div className={`bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 border-2 transition-all duration-300 ${
                    activeTab === 'call' 
                      ? 'border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900' 
                      : 'border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="text-center mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Phone className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Schedule a Phone Call
                      </h2>
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg inline-flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">Available: 7 AM CST to 5 PM CST</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Direct phone consultation</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Immediate answers to your questions</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Personalized strategy discussion</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>No screen sharing required</span>
                      </div>
                    </div>

                    {/* This matches the book-a-call form in index.html */}
                    <form 
                      name="book-a-call" 
                      method="POST"
                      data-netlify="true"
                      netlify-honeypot="bot-field"
                      action="/success"
                      className="space-y-4"
                    >
                      <input type="hidden" name="form-name" value="book-a-call" />
                      <div style={{display: "none"}}>
                        <input name="bot-field" />
                      </div>

                      <div>
                        <label htmlFor="call_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="call_name"
                          required
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="call_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="call_email"
                          required
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="call_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="call_phone"
                          required
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label htmlFor="call_service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Service of Interest *
                        </label>
                        <select
                          name="serviceOfInterest"
                          id="call_service"
                          required
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        >
                          <option value="">Select a Service</option>
                          <option value="ai-solutions">AI Solutions</option>
                          <option value="content-creation">Content Creation</option>
                          <option value="create-website">Create Website</option>
                          <option value="customer-support">Customer Support</option>
                          <option value="digital-marketing">Digital Marketing</option>
                          <option value="our-services">Our Services</option>
                          <option value="seo-services">SEO Services</option>
                          <option value="search-engine-marketing">Search Engine Marketing</option>
                          <option value="social-media-marketing">Social Media Marketing</option>
                          <option value="website-development">Website Development</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="call_message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tell us about your project *
                        </label>
                        <textarea
                          name="message"
                          id="call_message"
                          required
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                          placeholder="Describe your business goals and how we can help..."
                        ></textarea>
                      </div>

                      <div>
                        <label htmlFor="call_timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project Timeline
                        </label>
                        <select
                          name="timeline"
                          id="call_timeline"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
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
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Schedule Phone Call</span>
                      </button>
                    </form>
                  </div>

                  {/* Book Google Meeting Section */}
                  <div className={`bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 border-2 transition-all duration-300 ${
                    activeTab === 'meeting' 
                      ? 'border-purple-500 ring-4 ring-purple-100 dark:ring-purple-900' 
                      : 'border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="text-center mb-6">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Video className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Book Google Meeting
                      </h2>
                      <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-lg inline-flex items-center space-x-2">
                        <Video className="w-4 h-4" />
                        <span className="font-semibold">Video Consultation</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Screen sharing capabilities</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Visual presentation of strategies</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Record session for reference</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Interactive collaboration</span>
                      </div>
                    </div>

                    {/* This exactly matches the google-meeting-request form in index.html */}
                    <form 
                      name="google-meeting-request" 
                      method="POST"
                      data-netlify="true"
                      data-netlify-honeypot="bot-field"
                      action="/success"
                      className="space-y-4"
                    >
                      <input type="hidden" name="form-name" value="google-meeting-request" />
                      <div style={{display: "none"}}>
                        <input name="bot-field" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="meeting_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="meeting_name"
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <label htmlFor="meeting_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="meeting_email"
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="meeting_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="meeting_phone"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <label htmlFor="meeting_service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Service of Interest *
                          </label>
                          <select
                            name="serviceOfInterest"
                            id="meeting_service"
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
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
                        <label htmlFor="meeting_company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="meeting_company"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          placeholder="Your company name"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="meeting_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Preferred Date *
                          </label>
                          <input
                            type="date"
                            name="preferredDate"
                            id="meeting_date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label htmlFor="meeting_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Preferred Time (CST) *
                          </label>
                          <input
                            type="time"
                            name="preferredTime"
                            id="meeting_time"
                            required
                            min="07:00"
                            max="17:00"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="meeting_timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project Timeline
                        </label>
                        <select
                          name="timeline"
                          id="meeting_timeline"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                        >
                          <option value="">Select timeline</option>
                          <option value="asap">ASAP</option>
                          <option value="1-month">Within 1 month</option>
                          <option value="3-months">Within 3 months</option>
                          <option value="6-months">Within 6 months</option>
                          <option value="planning">Just planning ahead</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="meeting_message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tell us about your project *
                        </label>
                        <textarea
                          name="message"
                          id="meeting_message"
                          required
                          rows={4}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 resize-none"
                          placeholder="Describe your business goals, challenges, and how we can help you succeed..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <Video className="w-5 h-5" />
                        <span>Schedule Google Meeting</span>
                      </button>

                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        By submitting this form, you agree to receive communications from us. We respect your privacy and will never share your information.
                      </p>
                    </form>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 border border-gray-200 dark:border-gray-500">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Why Choose The Dynamic Rankers?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">100+</div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Successful Projects</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Support Available</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">4-6x</div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Average ROI</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Need immediate assistance? Call us directly:
                  </p>
                  <a 
                    href="tel:+13465561173"
                    className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    +1 (346) 556-1173
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Monday - Friday: 7 AM - 5 PM CST
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </motion.div>
    </>
  );
};

export default SpecialBookingPage;
