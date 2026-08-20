import { useState } from 'react';
import Asesor from './Asesor.jsx';
import GeneradorAnexo from './GeneradorAnexo.jsx';

// Pantalla principal del Asistente de anexos: pestaña Asesor + pestaña Generador
export default function AsistenteAnexos() {
  const [pestana, setPestana] = useState('asesor'); // 'asesor' | 'generar'

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Asistente de anexos del PIAR</h1>
          <p className="dashboard-subtitle">
            Orientación sobre qué anexo diligenciar y generación asistida del documento
          </p>
        </div>
      </div>

      <div className="pestanas">
        <button
          className={`pestana${pestana === 'asesor' ? ' active' : ''}`}
          onClick={() => setPestana('asesor')}
        >
          Asesor
        </button>
        <button
          className={`pestana${pestana === 'generar' ? ' active' : ''}`}
          onClick={() => setPestana('generar')}
        >
          Generar anexo
        </button>
      </div>

      {pestana === 'asesor' ? <Asesor /> : <GeneradorAnexo />}
    </div>
  );
}
