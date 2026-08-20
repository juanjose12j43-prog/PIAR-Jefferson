import { useState } from 'react';
import { api } from '../../api/client.js';

export default function ReporteEjecutivo() {
  const [cargando, setCargando] = useState(false);
  const [informe, setInforme] = useState(null);
  const [error, setError] = useState(null);

  async function manejarGenerar() {
    setCargando(true);
    setError(null);
    setInforme(null);
    try {
      const { informe } = await api.generarReporteEjecutivo();
      setInforme(informe);
    } catch (err) {
      setError(err.message || 'No fue posible generar el informe.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="card reporte-section">
      <h3 className="card-title">Generar reporte ejecutivo</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: -8, marginBottom: 16 }}>
        Redacta automáticamente un informe institucional de inclusión con los datos actuales del
        tablero, listo para presentar a Secretaría de Educación o junta directiva.
      </p>
      <button className="btn-primary" onClick={manejarGenerar} disabled={cargando}>
        {cargando ? 'Generando informe…' : 'Generar reporte ejecutivo'}
      </button>
      {error && <p className="reporte-error">{error}</p>}
      {informe && <div className="reporte-output">{informe}</div>}
    </div>
  );
}
