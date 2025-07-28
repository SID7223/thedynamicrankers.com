import React from 'react';

const BookACall: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Book a Call</h1>
      <p className="text-gray-600 dark:text-white mb-8">
        Interested in learning more about how we can help your business grow? Fill out the form below to schedule a free consultation call.
      </p>
      <form name="book-a-call" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="book-a-call" />
        <div hidden>
          <label>
            Don’t fill this out if you’re human: <input name="bot-field" />
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Name:
          </label>
          <input type="text" name="name" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Email:
          </label>
          <input type="email" name="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Phone (Optional):
          </label>
          <input type="tel" name="phone" id="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="serviceOfInterest" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Service of Interest:
          </label>
          <select name="serviceOfInterest" id="serviceOfInterest" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
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
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Message:
          </label>
          <textarea name="message" id="message" rows={4} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Book Call
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookACall;
