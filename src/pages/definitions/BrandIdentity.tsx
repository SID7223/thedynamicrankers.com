import React from 'react';
import { Helmet } from 'react-helmet-async';

const BrandIdentity = () => {
  return (
    <>
      <Helmet>
        <title>Brand Identity Definition | The Dynamic Rankers</title>
        <meta name="description" content="Learn about brand identity and how it shapes customer perception with The Dynamic Rankers' strategic insights." />
        <meta name="keywords" content="brand identity, brand design, visual identity, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Brand Identity
          </h1>
          
          <div className="mb-8">
            <picture>
              <source
                srcSet="
                  https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                  https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                  https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                "
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                type="image/webp"
              />
              <img 
                src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                alt="The Dynamic Rankers – Brand Identity"
                title="Brand Identity | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Brand identity encompasses the visual and conceptual elements that distinguish
              your business from competitors and create memorable customer experiences. 
              The Dynamic Rankers develops comprehensive brand identities that resonate 
              across all digital marketing channels and social media platforms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Core Brand Elements
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Visual Identity System
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Logo design, color palettes, typography, and imagery that create 
                  consistent visual recognition across all touchpoints.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Brand Voice & Messaging
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Consistent tone, personality, and communication style that reflects 
                  your brand values and connects with your target audience.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Brand Guidelines & Standards
                </h3>
                <p className="text-gray-700 dark:text-white">
                  Comprehensive documentation ensuring consistent brand application 
                  across all marketing materials and digital platforms.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why It Matters in Digital Marketing
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              A strong brand identity is essential for digital marketing success because it
              creates instant recognition and builds trust with your audience. The Dynamic 
              Rankers understands that consistent brand identity across Google search results, 
              social media platforms, and all digital touchpoints reinforces credibility and 
              drives customer loyalty. With Apple-level attention to detail, we ensure your 
              brand makes a lasting impression that translates into measurable business growth.
            </p>
            
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Build Your Brand Legacy</h3>
              <p>
                Create a distinctive brand identity that captures attention, builds trust, 
                and drives long-term customer relationships across all digital channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandIdentity;