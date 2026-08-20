import { CONCEPTOS } from './contenido.js';
import { IconoFuente } from '../../components/Iconos.jsx';

// Tarjetas de conceptos clave del Centro de conocimiento
export default function Conceptos() {
  return (
    <div className="conceptos-grid">
      {CONCEPTOS.map((c) => (
        <article className="card concepto-card" key={c.titulo}>
          <h3 className="concepto-titulo">{c.titulo}</h3>
          <p className="concepto-texto">{c.texto}</p>
          <p className="concepto-fuente">
            <IconoFuente size={13} /> {c.fuente}
          </p>
        </article>
      ))}
    </div>
  );
}
