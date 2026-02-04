import React from "react";

export default function MessagePage() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-xl">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
          Send a Message
        </h1>

        <form
          name="message"
          method="POST"
          action="/api/contact"
          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg p-6"
        >
          {/* redirect after successful submission */}
          <input type="hidden" name="redirect" value="/thank-you" />

          {/* honeypot field for spam protection */}
          <p className="hidden">
            <label>
              Don&apos;t fill this out: <input name="bot-field" />
            </label>
          </p>

          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">
            Name
          </label>
          <input
            name="name"
            required
            className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full mb-6 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
