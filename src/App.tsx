import React from 'react';
import Header from './components/Header';
import DarkModeToggle from './components/DarkModeToggle';
import Hero from './components/Hero';
import Services from './components/Services';
import BusinessGrowth from './components/BusinessGrowth';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <DarkModeToggle />
      <Hero />
      <Services />
      <BusinessGrowth />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
      <AIAssistant />
    </div>
  );
}

export default App;