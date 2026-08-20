import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GradoChart({ datos }) {
  const datosFormateados = datos.map((d) => ({ grado: `${d.grado}°`, total: d.total }));

  return (
    <div className="card">
      <h3 className="card-title" id="titulo-grafico-grado">
        Distribución de PIAR por grado
      </h3>

      {/* Ver nota en BarreraChart: el SVG queda fuera del árbol de
          accesibilidad y la tabla equivalente lo sustituye. */}
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={datosFormateados} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6dedd" />
            <XAxis dataKey="grado" tick={{ fontSize: 13, fill: '#6b5c5d' }} />
            <YAxis
              allowDecimals={false}
              domain={[0, 'dataMax']}
              tick={{ fontSize: 13, fill: '#6b5c5d' }}
            />
            <Tooltip />
            <Bar dataKey="total" fill="#b21e28" radius={[4, 4, 0, 0]} name="PIAR activos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only" aria-labelledby="titulo-grafico-grado">
        <caption>PIAR activos por grado</caption>
        <thead>
          <tr>
            <th scope="col">Grado</th>
            <th scope="col">PIAR activos</th>
          </tr>
        </thead>
        <tbody>
          {datosFormateados.map((d) => (
            <tr key={d.grado}>
              <th scope="row">{d.grado}</th>
              <td>{d.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
