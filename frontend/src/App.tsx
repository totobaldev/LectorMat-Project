import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import UnitPage from './pages/UnitPage';
import U3Module2 from './pages/units/U3/Module2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/unit/:id" element={<UnitPage />} />
          {/* ── Unidad 3 – Módulos específicos ── */}
          <Route path="/unit/3/module/2" element={<U3Module2 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
