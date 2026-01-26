import React, { useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const isContactPage =
    typeof window !== 'undefined' &&
    window.location.pathname === '/contact';

  // Load Google reCAPTCHA script for Netlify reCAPTCHA support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('netlify-recaptcha')) return;

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.id = 'netlify-recaptcha';
    document.body.appendChild(script);
  }, []);

  return (
    <section
      id="contact"
      className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          {!isContactPage && (
            <>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 px-2">
                Get In Touch
              </h2>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                Ready to take your business to the next level? Contact us today
                for a free consultation.
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-md">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Email Us</h4>
                  <p className="text-sm">hello@thedynamicrankers.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600 dark:text-white">We'll get back to you within 24 hours</p>
            </div>
          </div>

          {/* Contact Form (Netlify Native) */}
          <div>
            <form
              name="contact"
              method="POST"
              action="/thank-you"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              className="bg-gray-50 sm:bg-white dark:bg-gray-700 border border-gray-200 sm:border-transparent rounded-xl shadow-md sm:shadow-lg p-4 sm:p-8"
            >
              {/* Required Netlify fields */}
              <input type="hidden" name="form-name" value="contact" />
              <div className="hidden">
                <label>
                  Don&apos;t fill this out if you&apos;re human:{' '}
                  <input name="bot-field" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your project..."
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Netlify reCAPTCHA widget for forms that have reCAPTCHA enabled */}
              <div className="mt-4" data-netlify-recaptcha="true" />

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
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