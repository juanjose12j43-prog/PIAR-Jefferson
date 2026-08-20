import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import KpiCards from './KpiCards.jsx';
import GradoChart from './GradoChart.jsx';
import BarreraChart from './BarreraChart.jsx';
import SeguimientoStatus from './SeguimientoStatus.jsx';
import AlertasPanel from './AlertasPanel.jsx';
import ReporteEjecutivo from './ReporteEjecutivo.jsx';
import VideoPortada from './VideoPortada.jsx';

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .obtenerResumenDashboard()
      .then(setResumen)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="placeholder-page">
        <h1>Tablero institucional</h1>
        <p className="reporte-error">Error al cargar el tablero: {error}</p>
      </div>
    );
  }

  if (!resumen) {
    return <p className="loading-text">Cargando tablero institucional…</p>;
  }

  return (
    <div>
      <VideoPortada />

      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tablero institucional de inclusión</h1>
          <p className="dashboard-subtitle">
            Vista general de la gestión de PIAR, anexos y seguimientos en la institución
          </p>
        </div>
      </div>

      <KpiCards kpis={resumen.kpis} />

      <div className="dashboard-grid">
        <GradoChart datos={resumen.distribucionPorGrado} />
        <BarreraChart datos={resumen.distribucionPorBarrera} />
        <SeguimientoStatus estado={resumen.estadoSeguimientos} />
        <ReporteEjecutivo />
      </div>

      <AlertasPanel alertas={resumen.alertas} />
    </div>
  );
}
