import { HITOS, HILO_NARRATIVO } from './contenido.js';

// Línea de tiempo dual: marco global (izquierda) ↔ marco colombiano (derecha),
// con una espina cronológica central. Incluye la sección de referentes
// internacionales de la educación inclusiva en diálogo con la normativa nacional.
export default function LineaTiempo() {
  return (
    <div>
      <div className="timeline-encabezados">
        <span className="timeline-encabezado global">Marco global</span>
        <span />
        <span className="timeline-encabezado colombia">Marco colombiano</span>
      </div>

      <div className="timeline">
        {HITOS.map((h) => (
          <div className={`timeline-fila ${h.lado}`} key={h.id}>
            {/* Columna izquierda: hitos globales */}
            <div className="timeline-celda izquierda">
              {h.lado === 'global' && <TarjetaHito hito={h} />}
            </div>

            {/* Espina central con el año */}
            <div className="timeline-espina">
              <span className={`timeline-anio ${h.destacado ? 'destacado' : ''}`}>{h.anio}</span>
            </div>

            {/* Columna derecha: hitos colombianos */}
            <div className="timeline-celda derecha">
              {h.lado === 'colombia' && <TarjetaHito hito={h} />}
            </div>
          </div>
        ))}
      </div>

      {/* Franja narrativa: el hilo histórico Salamanca → Cali → Foros */}
      <div className="hilo-narrativo">
        <h3 className="hilo-titulo">{HILO_NARRATIVO.titulo}</h3>
        <div className="hilo-pasos">
          {HILO_NARRATIVO.pasos.map((p, i) => (
            <div className="hilo-paso" key={p.anio}>
              <span className="hilo-anio">{p.anio}</span>
              <p className="hilo-texto">{p.texto}</p>
              {i < HILO_NARRATIVO.pasos.length - 1 && <span className="hilo-flecha">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tarjeta de un hito (global o colombiano)
function TarjetaHito({ hito }) {
  return (
    <article className={`hito-card ${hito.lado}${hito.destacado ? ' destacado' : ''}`}>
      {hito.insignia && <span className="hito-insignia">{hito.insignia}</span>}
      <h4 className="hito-titulo">{hito.titulo}</h4>
      <p className="hito-entidad">{hito.entidad}</p>
      <p className="hito-texto">{hito.texto}</p>
      {hito.conexion && (
        <span className={`hito-conexion ${hito.lado}`}>
          {hito.lado === 'global' ? '⟶ ' : '⟵ '}
          {hito.etiquetaConexion}
        </span>
      )}
    </article>
  );
}
