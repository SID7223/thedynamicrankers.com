import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isContactPage =
    typeof window !== 'undefined' &&
    window.location.pathname === '/contact';

  const encode = (data: Record<string, string>) =>
    new URLSearchParams(data).toString();

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
    } catch {
      setErrorMessage(
        'Something went wrong. Please try again or email us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Email Us
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    eric@thedynamicrankers.com
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Call Us
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    +1 (713) 555-0199
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Visit Us
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    327 Lancaster St. Houston, TX 77026
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="bg-gray-50 sm:bg-white dark:bg-gray-700 border border-gray-200 sm:border-transparent rounded-xl shadow-md sm:shadow-lg p-4 sm:p-8"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div className="hidden">
                <label>
                  Don&apos;t fill this out: <input name="bot-field" />
                </label>
              </div>

              {(isSubmitted || errorMessage) && (
                <div
                  className={`mb-6 rounded-lg border px-4 py-3 ${
                    isSubmitted
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {isSubmitted
                    ? 'Thanks! Our support team will contact you soon.'
                    : errorMessage}
                </div>
              )}

              <input
                name="name"
                required
                placeholder="Your Name"
                className="w-full mb-4 px-4 py-3 border rounded-lg"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="w-full mb-4 px-4 py-3 border rounded-lg"
              />
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Tell us about your project..."
                className="w-full mb-6 px-4 py-3 border rounded-lg"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Sending…' : 'Send Message'}</span>
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
