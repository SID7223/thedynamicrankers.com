import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  // Background mouse movement animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bgRef.current) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        bgRef.current.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us - Your Website Name</title>
        <meta name="description" content="Learn more about our company and mission." />
        <meta property="og:title" content="About Us - Your Website Name" />
        <meta property="og:description" content="Learn more about our company and mission." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div
        ref={bgRef}
        className="min-h-screen bg-[url('https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg')] bg-cover bg-center dark:from-black dark:to-gray-900 transition-colors duration-300"
        style={{
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(255,255,255,0.8)',
        }}
      >
        <main className="pt-20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-8">
            <motion.h1
              className="text-4xl font-bold text-center mb-8 text-black dark:text-gray-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Us
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <motion.div
                className="md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src="https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
                  alt="Our Building"
                  className="rounded-lg shadow-xl w-full border border-gray-200 dark:border-gray-700"
                />
              </motion.div>

              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-100">Our Mission</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  We are a dedicated team of professionals who are passionate about what they do. Our mission is to deliver
                  high-quality solutions tailored to your needs, driven by creativity, innovation, and a commitment to
                  excellence.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-100">Our Team</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Meet our dedicated team of professionals who are passionate about what they do. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit.
                </p>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AboutUs;
