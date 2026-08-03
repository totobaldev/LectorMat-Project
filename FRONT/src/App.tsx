import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import PreModule from './components/PreModule';
import Module1 from './components/Module1';
import Module2 from './components/Module2';
import Module3 from './components/Module3';
import Module4 from './components/Module4';
import U2Module1 from './components/U2Module1';
import U2Module2 from './components/U2Module2';
import U2Module3 from './components/U2Module3';
import U3Module1 from './components/U3Module1';
import U3Module2 from './components/U3Module2';
import U3Module3 from './components/U3Module3';
import U4Module1 from './components/U4Module1';
import U4Module2 from './components/U4Module2';
import U4Module3 from './components/U4Module3';
import Feedback from './components/Feedback';
import { Screen, ProgressState } from './types';

import DashboardModule from './components/Dashboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [progress, setProgress] = useState<ProgressState>({
    preSpecialty: null,
    career: null,
    subject: null,
    m1SlotsPlaced: 0,
    m1Completed: false,
    m2NodesVisited: 0,
    m2Completed: false,
    m3CompletedLevels: 0,
    m3Completed: false,
    u2m1SlotsPlaced: 0,
    u2m1Completed: false,
    u2m2NodesVisited: 0,
    u2m2Completed: false,
    u2m3CompletedLevels: 0,
    u2m3Completed: false,
    u3m1SlotsPlaced: 0,
    u3m1Completed: false,
    u3m2NodesVisited: 0,
    u3m2Completed: false,
    u3m3CompletedLevels: 0,
    u3m3Completed: false,
    u4m1SlotsPlaced: 0,
    u4m1Completed: false,
    u4m2NodesVisited: 0,
    u4m2Completed: false,
    u4m3CompletedLevels: 0,
    u4m3Completed: false,
  });

  const [isTeacher, setIsTeacher] = useState(false);

  const updateProgress = React.useCallback((updates: Partial<ProgressState>) => {
    setProgress(prev => {
      let changed = false;
      for (const key in updates) {
        if (prev[key as keyof ProgressState] !== updates[key as keyof ProgressState]) {
          changed = true;
          break;
        }
      }
      if (!changed) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  const sharedProps = {
    currentScreen: screen,
    setScreen,
    progress,
    updateProgress,
    isTeacher,
    setIsTeacher,
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50/50 font-sans text-slate-900 selection:bg-indigo-200 selection:text-indigo-900">
      <Sidebar {...sharedProps} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/40 via-slate-50/40 to-slate-100/40">
        <div className="absolute inset-0">
          {screen !== 'home' && screen !== 'dashboard' && screen !== 'feedback' && progress.career && progress.subject && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-8 w-full animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    🎓
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Carrera
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {progress.career}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                    📚
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Asignatura
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {progress.subject}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {screen === 'home' && <Home {...sharedProps} />}
          {screen === 'dashboard' && <DashboardModule {...sharedProps} />}
          {screen === 'pre_m1' && <PreModule {...sharedProps} />}
          {screen === 'm1' && <Module1 {...sharedProps} />}
          {screen === 'm2' && <Module2 {...sharedProps} />}
          {screen === 'm3' && <Module3 {...sharedProps} />}
          {screen === 'm4' && <Module4 {...sharedProps} />}
          {screen === 'u2m1' && <U2Module1 {...sharedProps} />}
          {screen === 'u2m2' && <U2Module2 {...sharedProps} />}
          {screen === 'u2m3' && <U2Module3 {...sharedProps} />}
          {screen === 'u3m1' && <U3Module1 {...sharedProps} />}
          {screen === 'u3m2' && <U3Module2 {...sharedProps} />}
          {screen === 'u3m3' && <U3Module3 {...sharedProps} />}
          {screen === 'u4m1' && <U4Module1 {...sharedProps} />}
          {screen === 'u4m2' && <U4Module2 {...sharedProps} />}
          {screen === 'u4m3' && <U4Module3 {...sharedProps} />}
          {screen === 'feedback' && <Feedback {...sharedProps} />}
        </div>
      </main>
    </div>
  );
}
