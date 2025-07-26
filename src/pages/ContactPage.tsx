import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import DarkModeToggle from '../components/DarkModeToggle';
import AIAssistant from '../components/AIAssistant';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - The Dynamic Rankers | Get Your Free Consultation</title>
        <meta name="description" content="Ready to grow your business? Contact The Dynamic Rankers for a free consultation. Call +1 (346) 556-1173 or email eric@thedynamicrankers.com" />
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <DarkModeToggle />
        
        <main className="pt-20">
          <Contact />
        </main>
        
        <Footer />
        <AIAssistant />
      </div>
    </>
  );
};

export default ContactPage;