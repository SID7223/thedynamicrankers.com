import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import BookCall from './pages/BookCall';

function App() {
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const x = `${(e.clientX / window.innerWidth) * 100}%`;
      const y = `${(e.clientY / window.innerHeight) * 100}%`;
      document.documentElement.style.setProperty('--x', x);
      document.documentElement.style.setProperty('--y', y);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <div className="relative min-h-screen transition-colors duration-700 bg-[radial-gradient(circle_at_var(--x,_--y),theme(colors.zinc.100),theme(colors.zinc.300))] dark:bg-[radial-gradient(circle_at_var(--x,_--y),theme(colors.zinc.900),theme(colors.zinc.800))]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/our-services" element={<Services />} />
        <Route path="/book-a-call" element={<BookCall />} />
      </Routes>
    </div>
  );
}

export default App;
