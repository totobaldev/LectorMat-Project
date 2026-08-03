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

const Require: React.FC<{
  role: 'student' | 'teacher';
  children: React.ReactNode;
}> = ({ role, children }) => {
  const current = useProgressStore((s) => s.role);
  if (current !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const isAuthenticated = useProgressStore((s) => s.isAuthenticated);
  const role            = useProgressStore((s) => s.role);

  // 1. Not authenticated or no role chosen → Role & Credentials Gateway
  if (!isAuthenticated || !role) return <RoleSelection />;

  // 3. Role chosen → routed area
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Teacher ─────────────────────────────────────────────── */}
        {role === 'teacher' && (
          <Route path="*" element={
            <Require role="teacher"><TeacherPanel /></Require>
          } />
        )}

        {/* ── Student ─────────────────────────────────────────────── */}
        {role === 'student' && (
          <Route element={<Require role="student"><MainLayout /></Require>}>
            <Route index path="/"               element={<HomePage />} />
            <Route path="/dashboard"            element={<DashboardPage />} />
            <Route path="/pre"                  element={<PreModule />} />
            <Route path="/feedback"             element={<Feedback />} />
            {/* U1 */}
            <Route path="/unit/1/module/1"      element={<U1M1 />} />
            <Route path="/unit/1/module/2"      element={<U1M2 />} />
            <Route path="/unit/1/module/3"      element={<U1M3 />} />
            <Route path="/unit/1/module/4"      element={<U1M4 />} />
            {/* U2 */}
            <Route path="/unit/2/module/1"      element={<U2M1 />} />
            <Route path="/unit/2/module/2"      element={<U2M2 />} />
            <Route path="/unit/2/module/3"      element={<U2M3 />} />
            {/* U3 */}
            <Route path="/unit/3/module/1"      element={<U3M1 />} />
            <Route path="/unit/3/module/2"      element={<U3M2 />} />
            <Route path="/unit/3/module/3"      element={<U3M3 />} />
            {/* U4 */}
            <Route path="/unit/4/module/1"      element={<U4M1 />} />
            <Route path="/unit/4/module/2"      element={<U4M2 />} />
            <Route path="/unit/4/module/3"      element={<U4M3 />} />
            {/* Fallback */}
            <Route path="*"                     element={<Navigate to="/" replace />} />
          </Route>
        )}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
