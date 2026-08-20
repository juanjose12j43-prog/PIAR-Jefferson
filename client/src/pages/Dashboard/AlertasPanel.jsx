export default function AlertasPanel({ alertas }) {
  const items = [
    ...alertas.piar.map((a) => ({
      texto: `PIAR de ${a.estudiante} (grado ${a.grado}°) - revisión`,
      fecha: a.fecha,
      vencido: a.vencido,
    })),
    ...alertas.anexos.map((a) => ({
      texto: `${a.tipo_anexo} de ${a.estudiante} (grado ${a.grado}°)`,
      fecha: a.fecha,
      vencido: a.vencido,
    })),
  ].sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <div className="card alertas-panel">
      <h3 className="card-title">Alertas: revisiones y anexos próximos a vencer</h3>
      {items.length === 0 ? (
        <p className="alerta-empty">No hay alertas pendientes en los próximos 15 días.</p>
      ) : (
        items.map((item, i) => (
          <div className="alerta-item" key={i}>
            <span>{item.texto}</span>
            <span>
              <span className={`alerta-tag ${item.vencido ? 'vencido' : 'proximo'}`}>
                {item.vencido ? 'Vencido' : 'Próximo'}
              </span>{' '}
              <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>{item.fecha}</span>
            </span>
          </div>
        ))
      )}
    </div>
  );
}
