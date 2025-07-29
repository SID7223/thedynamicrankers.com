import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
const PrivacyPolicy: React.FC = () => {
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'disclosure', title: 'Disclosure of Your Information' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'changes', title: 'Changes to This Privacy Policy' },
    { id: 'contact', title: 'Contact Us' }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - The Dynamic Rankers</title>
        <meta name="description" content="Read our privacy policy." />
        <meta property="og:title" content="Privacy Policy - The Dynamic Rankers" />
        <meta property="og:description" content="Read our privacy policy." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          <div className="max-w-6xl mx-auto p-8">
            <motion.h1 
              className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Privacy Policy
            </motion.h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Table of Contents */}
              <motion.div 
                className="lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-fit lg:sticky lg:top-24"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Table of Contents</h2>
                <nav>
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a 
                          href={`#${section.id}`}
                          className="block py-2 px-3 rounded-md hover:bg-purple-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
              
              {/* Main Content */}
              <motion.div 
                className="lg:w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="prose dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-a:text-purple-600 dark:prose-a:text-purple-400">
                  
                  <section id="introduction" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Introduction</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      This Privacy Policy describes how we collect, use, and disclose your personal information when you visit our website. 
                      By using our website, you agree to the collection and use of information in accordance with this policy.
                    </p>
                  </section>
                  
                  <section id="information-collected" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Information We Collect</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      We may collect personal information that you provide to us, such as your name, email address, and other contact information when you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                      <li>Fill out a form on our website</li>
                      <li>Subscribe to our newsletter</li>
                      <li>Contact us with inquiries</li>
                      <li>Create an account on our website</li>
                    </ul>
                  </section>
                  
                  <section id="how-we-use" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">How We Use Your Information</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      We may use your personal information to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                      <li>Respond to your inquiries and provide customer support</li>
                      <li>Send you newsletters and marketing communications (if you have opted in)</li>
                      <li>Improve our website and services</li>
                      <li>Comply with legal obligations</li>
                      <li>Analyze usage patterns to enhance user experience</li>
                    </ul>
                  </section>
                  
                  <section id="disclosure" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Disclosure of Your Information</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      We may share your personal information with third parties in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                      <li>With your consent</li>
                      <li>With service providers who help us operate our website and provide services</li>
                      <li>To comply with legal obligations</li>
                      <li>In connection with a business transfer or merger</li>
                    </ul>
                  </section>
                  
                  <section id="data-security" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Data Security</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. 
                      These measures include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                      <li>Encryption of sensitive data</li>
                      <li>Regular security assessments</li>
                      <li>Employee training on data protection</li>
                      <li>Secure storage of information</li>
                    </ul>
                  </section>
                  
                  <section id="your-rights" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Your Rights</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      You have the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                      <li>Access your personal information</li>
                      <li>Update or correct your information</li>
                      <li>Delete your information</li>
                      <li>Object to or restrict the processing of your personal information</li>
                      <li>Withdraw consent at any time</li>
                    </ul>
                  </section>
                  
                  <section id="changes" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Changes to This Privacy Policy</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                      <li>Posting the new Privacy Policy on this page</li>
                      <li>Sending you an email notification</li>
                      <li>Displaying a prominent notice on our website</li>
                    </ul>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      You are advised to review this Privacy Policy periodically for any changes.
                    </p>
                  </section>
                  
                  <section id="contact" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Contact Us</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Email: eric@thedynamicrankers.com</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Phone: +1 (346) 556-1173</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Address: 234 Westheimer Rd, Apt 101, Houston, TX 77077</p>
                    </div>
                  </section>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default PrivacyPolicy;
