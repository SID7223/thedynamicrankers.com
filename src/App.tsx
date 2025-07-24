import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Page components that combine sections
const HomePage = () => (
  <>
    <Hero />
    <Services />
    <BusinessGrowth />
    <About />
    <Testimonials />
    <Contact />
  </>
);

const ServicesPage = () => (
  <div className="pt-20">
    <Services />
    <BusinessGrowth />
  </div>
);

const AboutPage = () => (
  <div className="pt-20">
    <About />
  </div>
);

const TestimonialsPage = () => (
  <div className="pt-20">
    <Testimonials />
  </div>
);

const ContactPage = () => (
  <div className="pt-20">
    <Contact />
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <DarkModeToggle />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;