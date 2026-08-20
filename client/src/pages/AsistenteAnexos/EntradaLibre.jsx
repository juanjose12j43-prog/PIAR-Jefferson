import { useState } from 'react';

// Entrada en lenguaje natural: el docente describe la situación con sus palabras.
// NOTA (fase de pulido): aquí se conectará el dictado por voz (Web Speech API),
// escribiendo la transcripción en este mismo textarea.
export default function EntradaLibre({ onEnviar, cargando }) {
  const [texto, setTexto] = useState('');

  return (
    <div>
      <p className="texto-ayuda">
        Describe la situación del estudiante con tus propias palabras, como se la contarías a un
        colega. El asistente la convertirá en el lenguaje institucional formal del anexo.
      </p>
      <textarea
        className="textarea-entrada"
        rows={8}
        placeholder="Ej.: Mateo se distrae mucho en clase de matemáticas, le cuesta terminar las guías largas, pero cuando trabajamos con material concreto participa muy bien. La mamá me contó que en casa…"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button
        className="btn-primary"
        onClick={() => onEnviar(texto.trim())}
        disabled={cargando || !texto.trim()}
      >
        {cargando ? 'Generando borrador…' : 'Generar borrador'}
      </button>
    </div>
  );
}
