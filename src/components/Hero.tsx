import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    setMousePos({
      x: (clientX - left) / width,
      y: (clientY - top) / height,
    });
  };

  const backgroundGradient = {
    light: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, #ffffff, #000000)`,
    dark: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, #000000, #c0c0c0)`
  };

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
        onMouseMove={handleMouseMove}
        className="min-h-screen transition-colors duration-300 dark:text-white"
        style={{
          background: backgroundGradient.light,
        }}
      >
        <main className="pt-20">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <motion.h1
              className="text-5xl font-bold text-center mb-10 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Us
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center justify-center md:space-x-10">
              <motion.div
                className="md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src="https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg"
                  alt="About Building"
                  className="rounded-xl shadow-2xl object-cover w-full h-auto max-h-[400px] grayscale dark:invert"
                />
              </motion.div>

              <motion.div
                className="md:w-1/2 text-left"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  We are a dedicated team of professionals who are passionate about what they do. Our mission is to deliver high-quality solutions tailored to your needs, driven by creativity, innovation, and a commitment to excellence.
                </p>

                <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">Our Team</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Meet our dedicated team of professionals who are passionate about their work. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
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
