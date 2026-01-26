import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isContactPage = typeof window !== 'undefined' && window.location.pathname === '/contact';

  const encode = (data: Record<string, string>) => new URLSearchParams(data).toString();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...data }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          {/* Only show heading if not on contact page (to avoid duplicate H1/H2) */}
          {!isContactPage && (
            <>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 px-2">
                Get In Touch
              </h2>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                Ready to take your business to the next level? Contact us today for a free consultation.
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-3 rounded-full">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Email Us</h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">eric@thedynamicrankers.com</p>
                </div>
              </div>
@@ -50,58 +87,88 @@ const Contact = () => {
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Visit Us</h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">327 Lancaster St. Houston, TX 77026</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Business Hours</h4>
              <div className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div>
            <form 
              name="contact" 
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              action="/thank-you"
              onSubmit={handleSubmit}
              className="bg-gray-50 sm:bg-white dark:bg-gray-700 border border-gray-200 sm:border-transparent rounded-xl shadow-md sm:shadow-lg p-4 sm:p-8"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div className="hidden">
                <label>
                  Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
                </label>
              </div>

              {(isSubmitted || errorMessage) && (
                <div
                  className={`mb-6 rounded-lg border px-4 py-3 text-sm sm:text-base ${
                    isSubmitted
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {isSubmitted
                        ? 'Thanks! Our support team will contact you soon.'
                        : errorMessage}
                    </span>
                    {isSubmitted && (
                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="inline-flex items-center justify-center rounded-md border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
@@ -124,38 +191,39 @@ const Contact = () => {
                  <option value="seo">Search Engine Optimization (SEO)</option>
                  <option value="sem">Search Engine Marketing (SEM)</option>
                  <option value="social-media">Social Media Marketing</option>
                  <option value="customer-support">Customer Support</option>
                  <option value="all-services">All Services</option>
                </select>
              </div>

              <div className="mt-6">
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
