import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Paleta encabezada por el rojo institucional y continuada con el resto de
// colores del escudo. El orden alterna claro y oscuro para que dos
// segmentos contiguos sigan siendo distinguibles en escala de grises y
// para quien tiene deficiencia de visión cromática.
const COLORES = ['#b21e28', '#16365c', '#e3a81b', '#6d1218', '#2e70b8', '#43862f', '#6b5c5d'];

export default function BarreraChart({ datos }) {
  const total = datos.reduce((suma, d) => suma + d.total, 0);

  return (
    <div className="card">
      <h3 className="card-title" id="titulo-grafico-barrera">
        Distribución por tipo de barrera
      </h3>

      {/* El gráfico se oculta al lector de pantalla (no sabe leer un SVG de
          recharts) y en su lugar se expone la misma información como texto.
          Sin esto, el dato simplemente no existe para quien no ve. */}
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={datos}
              dataKey="total"
              nameKey="tipo"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ percent }) => `${Math.round(percent * 100)}%`}
            >
              {datos.map((_, index) => (
                <Cell key={index} fill={COLORES[index % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 13 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only" aria-labelledby="titulo-grafico-barrera">
        <caption>Distribución de PIAR activos por tipo de barrera</caption>
        <thead>
          <tr>
            <th scope="col">Tipo de barrera</th>
            <th scope="col">Estudiantes</th>
            <th scope="col">Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.tipo}>
              <th scope="row">{d.tipo}</th>
              <td>{d.total}</td>
              <td>{total ? Math.round((d.total / total) * 100) : 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
