import { useState } from 'react';

// Preguntas guiadas por tipo de anexo. Las respuestas se consolidan en un
// texto estructurado que viaja al mismo endpoint que la entrada libre.
const PREGUNTAS = {
  caracterizacion: [
    { id: 'contexto', label: '¿Cómo es el contexto familiar y escolar del estudiante?' },
    { id: 'situacion', label: 'Describe la situación actual del estudiante en el aula' },
    { id: 'barreras', label: '¿Qué barreras para el aprendizaje y la participación has observado?' },
    { id: 'fortalezas', label: '¿Cuáles son las fortalezas e intereses del estudiante?' },
  ],
  ajustes: [
    { id: 'area', label: '¿Para qué área o asignatura son los ajustes?' },
    { id: 'objetivo', label: '¿Qué objetivo de aprendizaje se busca alcanzar?' },
    { id: 'barreras', label: '¿Qué barreras presenta el estudiante en esa área?' },
    { id: 'estrategias', label: '¿Qué estrategias o apoyos ya has intentado o propones?' },
  ],
  acta_familia: [
    { id: 'participantes', label: '¿Quiénes participan en la reunión?' },
    { id: 'proposito', label: '¿Cuál es la situación o propósito del encuentro?' },
    { id: 'acuerdos', label: '¿Qué acuerdos o compromisos se plantearon?' },
    { id: 'seguimiento', label: '¿Cuándo será el próximo seguimiento?' },
  ],
};

export default function FormularioGuiado({ tipoAnexo, onEnviar, cargando }) {
  const preguntas = PREGUNTAS[tipoAnexo] || [];
  const [respuestas, setRespuestas] = useState({});

  const completo = preguntas.some((p) => (respuestas[p.id] || '').trim());

  function manejarEnviar() {
    // Consolida las respuestas en un texto estructurado para el prompt
    const datos = preguntas
      .filter((p) => (respuestas[p.id] || '').trim())
      .map((p) => `${p.label}\n${respuestas[p.id].trim()}`)
      .join('\n\n');
    onEnviar(datos);
  }

  return (
    <div>
      {preguntas.map((p) => (
        <div key={p.id} className="campo-formulario">
          {/* htmlFor + id: sin esta pareja el lector de pantalla anuncia el
              campo como "cuadro de texto" sin decir de qué. */}
          <label className="campo-label" htmlFor={`campo-${p.id}`}>
            {p.label}
          </label>
          <textarea
            id={`campo-${p.id}`}
            className="textarea-entrada"
            rows={3}
            value={respuestas[p.id] || ''}
            onChange={(e) => setRespuestas({ ...respuestas, [p.id]: e.target.value })}
          />
        </div>
      ))}
      <button className="btn-primary" onClick={manejarEnviar} disabled={cargando || !completo}>
        {cargando ? 'Generando borrador…' : 'Generar borrador'}
      </button>
    </div>
  );
}
