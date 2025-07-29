import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Your Website Name</title>
        <meta name="description" content="Read our privacy policy." />
        <meta property="og:title" content="Privacy Policy - Your Website Name" />
        <meta property="og:description" content="Read our privacy policy." />
        <meta property="og:type" content="website" />
        {/* Add more meta tags as needed */}
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Privacy Policy
        </motion.h1>

        <motion.div 
          className="prose dark:prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Introduction</h2>
          <p>
            This Privacy Policy describes how we collect, use, and disclose your personal information when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect personal information that you provide to us, such as your name, email address, and other contact information when you:
          </p>
          <ul>
            <li>Fill out a form on our website</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us with inquiries</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>
            We may use your personal information to:
          </p>
          <ul>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you newsletters and marketing communications (if you have opted in)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Disclosure of Your Information</h2>
          <p>
            We may share your personal information with third parties in the following circumstances:
          </p>
          <ul>
            <li>With your consent</li>
            <li>With service providers who help us operate our website and provide services</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, update, and delete your personal information. You may also have the right to object to or restrict the processing of your personal information.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default PrivacyPolicy;