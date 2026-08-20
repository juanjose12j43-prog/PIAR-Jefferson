import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CentroConocimiento from './pages/CentroConocimiento/CentroConocimiento.jsx';
import AsistenteAnexos from './pages/AsistenteAnexos/AsistenteAnexos.jsx';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/centro-conocimiento" element={<CentroConocimiento />} />
        <Route path="/asistente-anexos" element={<AsistenteAnexos />} />
      </Routes>
    </AppLayout>
  );
}
