import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SEOServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>SEO Services | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' SEO Services with performance visuals and clean design." />
        <meta name="keywords" content="SEO services, technical audit, backlinks, content optimization, The Dynamic Rankers" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                SEO Services
              </h1>
              <p className="text-lg sm:text-xl text-purple-100 max-w-3xl mx-auto mb-8">
                Dynamic Rankers delivers comprehensive SEO solutions with technical audits and content optimization. 
                Our AI-powered strategies boost Google rankings through strategic digital marketing approaches.
              </p>
            </div>
          </section>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <picture>
                  <source
                    srcSet="
                      https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                      https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                      https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                    "
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                    type="image/webp"
                  />
                  <img 
                    src="https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                    alt="The Dynamic Rankers – SEO Services"
                    title="SEO Services | The Dynamic Rankers"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                    width="1200"
                    height="600"
                  />
                </picture>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                  Comprehensive SEO Solutions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Technical SEO Audits
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Comprehensive technical analysis identifying optimization opportunities with 
                      <Link to="/definitions/meta-structure" className="text-purple-600 hover:text-purple-800 underline"> meta structure</Link> improvements 
                      and Apple-level attention to detail.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Strategic Backlink Building
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      High-quality backlink campaigns that boost domain authority and improve 
                      Google search rankings through proven digital marketing strategies.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Content Optimization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      AI-powered content optimization that enhances keyword targeting while 
                      maintaining natural readability across all social media platforms.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Page Indexing Excellence
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Strategic <Link to="/definitions/page-indexing" className="text-purple-600 hover:text-purple-800 underline">page indexing</Link> 
                      optimization ensuring maximum visibility in Google search results and improved rankings.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Our SEO Process
                </h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">SEO Audit & Analysis</h4>
                      <p className="text-gray-600 dark:text-gray-300">Complete website analysis identifying technical issues and optimization opportunities.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Keyword Research & Strategy</h4>
                      <p className="text-gray-600 dark:text-gray-300">Data-driven keyword research targeting high-value search terms in your industry.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">On-Page Optimization</h4>
                      <p className="text-gray-600 dark:text-gray-300">Optimizing content, meta tags, and technical elements for maximum search visibility.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Monitoring & Reporting</h4>
                      <p className="text-gray-600 dark:text-gray-300">Continuous monitoring with detailed reports showing ranking improvements and traffic growth.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">SEO Results You Can Expect</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">300%</div>
                      <p className="text-gray-600 dark:text-gray-300">Average organic traffic increase</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">90%</div>
                      <p className="text-gray-600 dark:text-gray-300">Clients see first-page rankings</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">6 Months</div>
                      <p className="text-gray-600 dark:text-gray-300">Average time to significant results</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Dominate Google Search Results</h3>
                  <p className="mb-6">
                    Let Dynamic Rankers transform your SEO strategy with proven techniques that deliver 
                    measurable results. Our comprehensive approach ensures long-term success in digital marketing.
                  </p>
                  <Link 
                    to="/book-a-call-meeting" 
                    className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get SEO Audit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SEOServicesPage;
