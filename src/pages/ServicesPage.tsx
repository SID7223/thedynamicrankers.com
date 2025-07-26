import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Services from '../components/Services';
import Footer from '../components/Footer';
import DarkModeToggle from '../components/DarkModeToggle';
import AIAssistant from '../components/AIAssistant';

const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - The Dynamic Rankers | Digital Marketing & Web Development</title>
        <meta name="description" content="Comprehensive digital marketing services including website development, SEO, SEM, social media marketing, and customer support. Get higher rankings and more traffic." />
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <DarkModeToggle />
        
        <main className="pt-20">
          <Services />
        </main>
        
        <Footer />
        <AIAssistant />
      </div>
    </>
  );
};

export default ServicesPage;