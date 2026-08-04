import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useProgressStore } from './store/useProgressStore';

// ── Auth / shared ─────────────────────────────────────────────────────────────
import Login         from './pages/shared/Login';
import RoleSelection from './pages/shared/RoleSelection';
import TeacherPanel  from './pages/shared/TeacherPanel';

// ── Student layout ────────────────────────────────────────────────────────────
import MainLayout    from './components/layout/MainLayout';

// ── Pages ─────────────────────────────────────────────────────────────────────
import HomePage      from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PreModule     from './pages/PreModule';
import Feedback      from './pages/Feedback';
import CoursesPage   from './pages/CoursesPage';

// ── U1 ────────────────────────────────────────────────────────────────────────
import U1M1 from './pages/units/U1/Module1';
import U1M2 from './pages/units/U1/Module2';
import U1M3 from './pages/units/U1/Module3';
import U1M4 from './pages/units/U1/Module4';

// ── U2 ────────────────────────────────────────────────────────────────────────
import U2M1 from './pages/units/U2/Module1';
import U2M2 from './pages/units/U2/Module2';
import U2M3 from './pages/units/U2/Module3';

// ── U3 ────────────────────────────────────────────────────────────────────────
import U3M1 from './pages/units/U3/Module1';
import U3M2 from './pages/units/U3/Module2'; // custom DecisionTree — preserved
import U3M3 from './pages/units/U3/Module3';

// ── U4 ────────────────────────────────────────────────────────────────────────
import U4M1 from './pages/units/U4/Module1';
import U4M2 from './pages/units/U4/Module2';
import U4M3 from './pages/units/U4/Module3';

// ─── Protected wrappers ───────────────────────────────────────────────────────

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useProgressStore((s) => s.isAuthenticated);
  const isTeacherUnlocked = useProgressStore((s) => s.isTeacherUnlocked);
  if (!isAuthenticated && !isTeacherUnlocked) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Login Page */}
        <Route path="/login" element={<RoleSelection />} />

        {/* Main Application Layout */}
        <Route element={<MainLayout />}>
          <Route index path="/"               element={<HomePage />} />
          <Route path="/courses"              element={<RequireAuth><CoursesPage /></RequireAuth>} />
          <Route path="/dashboard"            element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/pre"                  element={<RequireAuth><PreModule /></RequireAuth>} />
          <Route path="/feedback"             element={<RequireAuth><Feedback /></RequireAuth>} />
          
          {/* U1 */}
          <Route path="/unit/1/module/1"      element={<RequireAuth><U1M1 /></RequireAuth>} />
          <Route path="/unit/1/module/2"      element={<RequireAuth><U1M2 /></RequireAuth>} />
          <Route path="/unit/1/module/3"      element={<RequireAuth><U1M3 /></RequireAuth>} />
          <Route path="/unit/1/module/4"      element={<U1M4 />} /> {/* PIN gated internally, no role check */}
          
          {/* U2 */}
          <Route path="/unit/2/module/1"      element={<RequireAuth><U2M1 /></RequireAuth>} />
          <Route path="/unit/2/module/2"      element={<RequireAuth><U2M2 /></RequireAuth>} />
          <Route path="/unit/2/module/3"      element={<RequireAuth><U2M3 /></RequireAuth>} />
          
          {/* U3 */}
          <Route path="/unit/3/module/1"      element={<RequireAuth><U3M1 /></RequireAuth>} />
          <Route path="/unit/3/module/2"      element={<RequireAuth><U3M2 /></RequireAuth>} />
          <Route path="/unit/3/module/3"      element={<RequireAuth><U3M3 /></RequireAuth>} />
          
          {/* U4 */}
          <Route path="/unit/4/module/1"      element={<RequireAuth><U4M1 /></RequireAuth>} />
          <Route path="/unit/4/module/2"      element={<RequireAuth><U4M2 /></RequireAuth>} />
          <Route path="/unit/4/module/3"      element={<RequireAuth><U4M3 /></RequireAuth>} />
          
          {/* Fallback */}
          <Route path="*"                     element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
