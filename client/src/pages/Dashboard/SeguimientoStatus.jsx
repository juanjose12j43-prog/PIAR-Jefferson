export default function SeguimientoStatus({ estado }) {
  return (
    <div className="card">
      <h3 className="card-title">Estado de seguimientos</h3>

      {/* role="img" con aria-label: la barra se anuncia como una sola imagen
          con su descripción, en vez de leerse como dos divs vacíos. */}
      <div
        className="seguimiento-bar"
        role="img"
        aria-label={`Seguimientos al día: ${estado.porcentajeAlDia} por ciento. Atrasados: ${estado.porcentajeAtrasado} por ciento.`}
      >
        <div
          className="seguimiento-bar-al-dia"
          style={{ width: `${estado.porcentajeAlDia}%` }}
        />
        <div
          className="seguimiento-bar-atrasado"
          style={{ width: `${estado.porcentajeAtrasado}%` }}
        />
      </div>

      {/* Cada estado lleva símbolo además de color: quien no distingue verde
          de rojo sigue pudiendo leer la diferencia. */}
      <div className="seguimiento-legend">
        <span>
          <span className="legend-dot legend-dot-al-dia" aria-hidden="true">
            ✓
          </span>
          Al día ({estado.porcentajeAlDia}%)
        </span>
        <span>
          <span className="legend-dot legend-dot-atrasado" aria-hidden="true">
            ▲
          </span>
          Atrasado ({estado.porcentajeAtrasado}%)
        </span>
      </div>
    </div>
  );
}
