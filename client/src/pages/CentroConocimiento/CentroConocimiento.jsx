import { useState } from 'react';
import Conceptos from './Conceptos.jsx';
import DocumentoPiar from './DocumentoPiar.jsx';
import LineaTiempo from './LineaTiempo.jsx';
import WikiIA from './WikiIA.jsx';

// Pantalla principal del Centro de conocimiento:
// conceptos, anatomía del documento PIAR, línea de tiempo y wiki IA
export default function CentroConocimiento() {
  const [pestana, setPestana] = useState('conceptos'); // 'conceptos' | 'documento' | 'timeline' | 'wiki'

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Centro de conocimiento</h1>
          <p className="dashboard-subtitle">
            Fundamentos de la educación inclusiva: del marco global al colombiano
          </p>
        </div>
      </div>

      <div className="pestanas">
        <button
          className={`pestana${pestana === 'conceptos' ? ' active' : ''}`}
          onClick={() => setPestana('conceptos')}
        >
          Conceptos clave
        </button>
        <button
          className={`pestana${pestana === 'documento' ? ' active' : ''}`}
          onClick={() => setPestana('documento')}
        >
          El documento PIAR
        </button>
        <button
          className={`pestana${pestana === 'timeline' ? ' active' : ''}`}
          onClick={() => setPestana('timeline')}
        >
          Línea de tiempo normativa
        </button>
        <button
          className={`pestana${pestana === 'wiki' ? ' active' : ''}`}
          onClick={() => setPestana('wiki')}
        >
          Wiki con IA
        </button>
      </div>

      {pestana === 'conceptos' && <Conceptos />}
      {pestana === 'documento' && <DocumentoPiar />}
      {pestana === 'timeline' && <LineaTiempo />}
      {pestana === 'wiki' && <WikiIA />}
    </div>
  );
}
