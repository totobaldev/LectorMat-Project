import React, { useState } from 'react';
import { useFrontProps } from '../hooks/useFrontProps';

import { MessageSquare, Star, Send, Check } from 'lucide-react';

export default function Feedback() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ easiest: '', hardest: '', improvements: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist feedback to your backend here
    setSubmitted(true);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-rose-50 to-orange-50 p-6 sm:p-8 rounded-[2rem] border border-rose-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tu opinión</h1>
          <p className="text-rose-600 font-medium">Ayúdanos a mejorar contándonos qué te pareció la aplicación.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-40 transform translate-x-1/3 -translate-y-1/3"></div>
      </header>

      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {submitted ? (
          <div className="text-center py-12 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-emerald-200">
              <Check className="w-12 h-12" strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">¡Gracias por tu opinión!</h2>
            <p className="text-lg text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">Tus comentarios nos ayudarán a seguir mejorando para entregar la mejor experiencia educativa.</p>
            <button 
              onClick={() => setScreen('home')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
            <div className="bg-amber-100 border-2 border-amber-300 p-6 sm:p-8 rounded-3xl shadow-lg shadow-amber-100/50">
              <label className="block text-xl font-black text-amber-900 mb-6">¿Qué tal te pareció la aplicación del 1 al 5?</label>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] flex items-center justify-center transition-all duration-300 cursor-pointer ${rating >= star ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-orange-300/50 scale-110 border-none' : 'bg-white text-slate-300 border-2 border-amber-200 hover:bg-amber-50 hover:scale-105'}`}
                  >
                    <Star className={`w-8 h-8 sm:w-10 sm:h-10 ${rating >= star ? 'fill-white' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-100 border-2 border-emerald-300 p-6 sm:p-8 rounded-3xl shadow-lg shadow-emerald-100/50">
              <label className="block text-xl font-black text-emerald-900 mb-4">¿Qué fue lo que más te gustó o se te hizo más fácil?</label>
              <textarea
                value={form.easiest}
                onChange={e => setForm(f => ({ ...f, easiest: e.target.value }))}
                className="w-full bg-white border-2 border-emerald-200 rounded-2xl p-5 sm:p-6 text-lg text-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 focus:border-emerald-500 transition-all font-sans resize-none h-32 shadow-inner placeholder:text-emerald-300"
                placeholder="Me pareció muy visual la forma de..."
              />
            </div>

            <div className="bg-indigo-100 border-2 border-indigo-300 p-6 sm:p-8 rounded-3xl shadow-lg shadow-indigo-100/50">
              <label className="block text-xl font-black text-indigo-900 mb-4">¿Qué fue lo más confuso o difícil de entender?</label>
              <textarea
                value={form.hardest}
                onChange={e => setForm(f => ({ ...f, hardest: e.target.value }))}
                className="w-full bg-white border-2 border-indigo-200 rounded-2xl p-5 sm:p-6 text-lg text-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-500 transition-all font-sans resize-none h-32 shadow-inner placeholder:text-indigo-300"
                placeholder="Me confundí en la parte de completar..."
              />
            </div>

            <div className="bg-rose-100 border-2 border-rose-300 p-6 sm:p-8 rounded-3xl shadow-lg shadow-rose-100/50">
              <label className="block text-xl font-black text-rose-900 mb-4">¿Qué mejoras concretas le harías a la aplicación?</label>
              <textarea
                value={form.improvements}
                onChange={e => setForm(f => ({ ...f, improvements: e.target.value }))}
                className="w-full bg-white border-2 border-rose-200 rounded-2xl p-5 sm:p-6 text-lg text-rose-900 focus:outline-none focus:ring-4 focus:ring-rose-400/30 focus:border-rose-500 transition-all font-sans resize-none h-32 shadow-inner placeholder:text-rose-300"
                placeholder="Sería genial si tuviera una opción para..."
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-white font-extrabold py-5 rounded-2xl transition-all shadow-lg shadow-rose-500/30 hover:-translate-y-1 cursor-pointer mt-4"
            >
              <Send className="w-6 h-6" />
              <span className="text-xl">Enviar comentarios</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
