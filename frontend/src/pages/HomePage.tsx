import React from 'react';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import logo from '/Users/cristobal/Documents/LectorMat/frontend/src/assets/logo.jpeg';

const HomePage: React.FC = () => {
  const setCareer = useProgressStore((s) => s.setCareer);
  const career = useProgressStore((s) => s.selectedCareer);

  const handleStart = () => {
    if (!career) setCareer('Técnico en Electricidad', 'Electricidad');
  };

  return (
    <div className="page-hero">
      <div className="hero-badge">
        <GraduationCap size={28} />
        <span>Nivelación Matemática Técnico-Profesional</span>
      </div>

      <div className="flex items-center justify-center w-full mb-4">
        <img src={logo} alt="LectorMat" className="h-60 w-60 object-contain opacity-90" />
      </div>

      <h1 className="hero-title">
        Bienvenido a <span className="brand">LectorMat</span>
      </h1>

      <p className="hero-subtitle">
        Diagnostica tu nivel, fortalece tus habilidades matemáticas y avanza
        con confianza en tu carrera técnica.
      </p>

      <div className="hero-actions">
        <Link to="/dashboard" className="btn-primary" onClick={handleStart}>
          <span>Comenzar ahora</span>
          <ArrowRight size={18} />
        </Link>
        <Link to="/unit/3" className="btn-secondary">
          <BookOpen size={18} />
          <span>Ver Unidad 3</span>
        </Link>
      </div>

      {/* Feature cards */}
      <div className="feature-grid">
        {[
          { title: 'Pre-Módulo', desc: 'Diagnóstico inicial de conocimientos previos', icon: '🎯' },
          { title: 'Unidades 1 – 4', desc: 'Contenidos progresivos por área técnica', icon: '📐' },
          { title: 'Progreso en tiempo real', desc: 'Visualiza tu avance en cada sesión', icon: '📊' },
        ].map((f) => (
          <div className="feature-card" key={f.title}>
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
