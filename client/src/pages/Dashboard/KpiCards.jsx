export default function KpiCards({ kpis }) {
  const tarjetas = [
    { label: 'PIAR activos', value: kpis.totalPiarActivos, variant: '' },
    { label: 'Estudiantes con PIAR', value: kpis.totalEstudiantes, variant: '' },
    { label: 'Anexos pendientes', value: kpis.anexosPendientes, variant: 'warning' },
    { label: 'Alertas próximas (15 días)', value: kpis.alertasVencimiento, variant: 'danger' },
  ];

  return (
    <div className="kpi-grid">
      {tarjetas.map((t) => (
        <div key={t.label} className={`kpi-card ${t.variant}`}>
          <div className="kpi-label">{t.label}</div>
          <div className="kpi-value">{t.value}</div>
        </div>
      ))}
    </div>
  );
}
