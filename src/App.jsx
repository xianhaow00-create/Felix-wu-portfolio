import { useEffect } from 'react';
import './App.css';
import { Navigation } from './components/Navigation.jsx';
import { Hero } from './components/Hero.jsx';
import { Marquee } from './components/Marquee.jsx';
import { About } from './components/About.jsx';
import { Projects } from './components/Projects.jsx';
import { PortfolioInterlude } from './components/PortfolioInterlude.jsx';
import { EditorialMarquee } from './components/EditorialMarquee.jsx';
import { Experience } from './components/Experience.jsx';
import { Skills } from './components/Skills.jsx';
import { Contact } from './components/Contact.jsx';
import { Cursor } from './components/Cursor.jsx';

export default function App() {
  // Reveal-on-scroll using IntersectionObserver
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Smooth-scroll anchor handling — accounts for sticky nav
  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="app">
      <Cursor />
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <EditorialMarquee />
        <PortfolioInterlude />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}
