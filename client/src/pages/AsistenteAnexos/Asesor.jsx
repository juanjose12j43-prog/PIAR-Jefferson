import { useState } from 'react';
import { api } from '../../api/client.js';

// Guía estática por momento del año escolar, según el Decreto 1421 de 2017
const GUIA = [
  {
    titulo: 'Nuevo ingreso',
    anexo: 'Anexo de caracterización del estudiante',
    cuando: 'Al inicio del año escolar o al momento de la matrícula del estudiante.',
    quienes: 'Docente de aula, orientación escolar y familia o cuidadores.',
  },
  {
    titulo: 'Estudiante ya caracterizado',
    anexo: 'Anexo de ajustes razonables por área',
    cuando: 'Durante el primer trimestre y cada vez que se identifiquen nuevas barreras.',
    quienes: 'Docentes de cada área, con acompañamiento de orientación escolar.',
  },
  {
    titulo: 'Cierre de año / seguimiento',
    anexo: 'Acta de acuerdo y seguimiento con la familia',
    cuando: 'Al cierre del año escolar y en las reuniones periódicas de seguimiento.',
    quienes: 'Directivo docente, docentes, orientación, familia y estudiante.',
  },
];

export default function Asesor() {
  const [contexto, setContexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [recomendacion, setRecomendacion] = useState(null);
  const [error, setError] = useState(null);

  async function manejarRecomendar() {
    setCargando(true);
    setError(null);
    setRecomendacion(null);
    try {
      const resultado = await api.recomendarAnexo(contexto);
      setRecomendacion(resultado);
    } catch (err) {
      setError(err.message || 'No fue posible obtener la recomendación.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <h3 className="seccion-titulo">¿Qué anexo corresponde, cuándo y con quién?</h3>
      <div className="guia-grid">
        {GUIA.map((g) => (
          <div className="card guia-card" key={g.titulo}>
            <h4 className="guia-card-titulo">{g.titulo}</h4>
            <p className="guia-anexo">{g.anexo}</p>
            <p className="guia-detalle"><strong>Cuándo:</strong> {g.cuando}</p>
            <p className="guia-detalle"><strong>Quiénes:</strong> {g.quienes}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card-title">¿No estás seguro? Describe la situación</h3>
        <p className="texto-ayuda">
          Cuenta brevemente la situación del estudiante y el asistente te indicará qué anexo
          diligenciar, en qué momento y con quiénes, con fundamento en el Decreto 1421 de 2017.
        </p>
        <textarea
          className="textarea-entrada"
          rows={4}
          placeholder="Ej.: Llegó un estudiante nuevo a grado 3° con diagnóstico de TEA y aún no tiene ningún documento del PIAR…"
          value={contexto}
          onChange={(e) => setContexto(e.target.value)}
        />
        <button
          className="btn-primary"
          onClick={manejarRecomendar}
          disabled={cargando || !contexto.trim()}
        >
          {cargando ? 'Consultando…' : 'Recomendar anexo'}
        </button>
        {error && <p className="reporte-error">{error}</p>}
        {recomendacion && (
          <div className="recomendacion-card">
            <span className="recomendacion-badge">Recomendación</span>
            <h4 className="recomendacion-titulo">{recomendacion.nombreAnexo}</h4>
            <p><strong>Cuándo:</strong> {recomendacion.momento}</p>
            <p><strong>Quiénes participan:</strong> {recomendacion.participantes}</p>
            <p><strong>Por qué:</strong> {recomendacion.justificacion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
