import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
const VideoEditingServices = () => {
  return (
    <>
      <Helmet>
        <title>Video Editing Services | The Dynamic Rankers</title>
        <meta name="description" content="Explore The Dynamic Rankers' take on Video Editing Services with expert insight, visual clarity, and SEO-optimized strategy." />
        <meta name="keywords" content="video editing, motion graphics, color grading, The Dynamic Rankers" />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Video Editing Services
          </h1>
          
          <div className="mb-8">
            <picture>
              <source
                srcSet="
                  https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop&fm=webp 400w,
                  https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop&fm=webp 800w,
                  https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp 1200w
                "
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                type="image/webp"
              />
              <img 
                src="https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop&fm=webp"
                alt="The Dynamic Rankers – Video Editing Services"
                title="Video Editing Services | The Dynamic Rankers"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                loading="lazy"
                width="1200"
                height="600"
              />
            </picture>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Dynamic Rankers creates stunning video content with Apple-level production quality and Google-optimized 
              distribution strategies. Our professional editing services transform raw footage into compelling reels, 
              ads, and brand videos that dominate social media and drive digital marketing success.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Professional Video Production
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Social Media Reels
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create viral-worthy reels optimized for Instagram, TikTok, and YouTube Shorts 
                  with Dynamic editing that captures attention and drives engagement.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Brand Video Polish
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Transform corporate content into compelling brand stories with Apple-inspired 
                  aesthetics that elevate your digital marketing presence across all platforms.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Advanced Editing Techniques
            </h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Professional <Link to="/definitions/motion-graphics" className="text-orange-600 hover:text-orange-800 underline">Motion Graphics</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white">Add dynamic animations and visual effects that enhance your digital marketing message across Google and social media platforms</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Expert <Link to="/definitions/color-grading" className="text-orange-600 hover:text-orange-800 underline">Color Grading</Link>:</strong> 
                  <span className="text-gray-600 dark:text-white">Achieve cinematic quality with Rankers-level color correction that makes your content stand out on every platform</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Audio Enhancement:</strong> <span className="text-gray-600 dark:text-white">Crystal-clear sound design and music integration that keeps viewers engaged throughout your marketing content</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Multi-Platform Optimization:</strong> <span className="text-gray-600 dark:text-white">AI-powered formatting for optimal performance across YouTube, Instagram, TikTok, and other social channels</span>
                </div>
              </li>
            </ul>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Bring Your Vision to Life</h3>
              <p className="mb-4">
                Transform your raw footage into professional video content that captivates audiences 
                and drives results across all your digital marketing channels.
              </p>
              <Link 
                to="/book-a-call-meeting"
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Start Video Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default VideoEditingServices;
