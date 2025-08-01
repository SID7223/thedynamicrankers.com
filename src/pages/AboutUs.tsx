import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const AboutUs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgGradient = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(
      600px circle at ${x}px ${y}px,
      rgba(255,255,255,0.1),
      transparent 80%
    )`
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (bounds) {
        mouseX.set(e.clientX - bounds.left);
        mouseY.set(e.clientY - bounds.top);
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
    }
    return () => el?.removeEventListener('mousemove', handleMouseMove);
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

      <motion.div
        ref={containerRef}
        style={{ backgroundImage: bgGradient }}
        className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-800 transition-colors duration-300"
      >
        <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
          <div className="max-w-5xl w-full text-center space-y-10">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Us
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src="https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg"
                  alt="Company Building"
                  className="rounded-xl shadow-xl w-full grayscale dark:grayscale-0 dark:brightness-75 dark:contrast-125 transition-all duration-500"
                />
              </motion.div>

              <motion.div
                className="md:w-1/2 text-left space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Our Mission</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We are a dedicated team of professionals passionate about delivering high-quality solutions tailored to your needs — driven by creativity, innovation, and a commitment to excellence.
                </p>

                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Our Team</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Meet the people who make it all happen. We come from diverse backgrounds, united by a shared vision to empower growth and value.
                </p>
              </motion.div>
            </div>
          </div>
        </main>
      </motion.div>
    </>
  );
};

export default AboutUs;
