import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import FormularioGuiado from './FormularioGuiado.jsx';
import EntradaLibre from './EntradaLibre.jsx';
import EditorBorrador from './EditorBorrador.jsx';
import { IconoLapiz, IconoLista } from '../../components/Iconos.jsx';

const TIPOS_ANEXO = [
  { valor: 'caracterizacion', nombre: 'Caracterización del estudiante' },
  { valor: 'ajustes', nombre: 'Ajustes razonables por área' },
  { valor: 'acta_familia', nombre: 'Acta de acuerdo con la familia' },
];

// Flujo del generador: estudiante + tipo de anexo → modalidad de entrada →
// borrador generado por IA → editor con guardado y exportación a Word.
export default function GeneradorAnexo() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteId, setEstudianteId] = useState('');
  const [tipoAnexo, setTipoAnexo] = useState('caracterizacion');
  const [modalidad, setModalidad] = useState('libre'); // 'libre' | 'guiado'
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  // Cuando hay borrador se muestra el editor a pantalla completa
  const [resultado, setResultado] = useState(null); // { borrador, piarId }

  useEffect(() => {
    api.listarEstudiantes().then(setEstudiantes).catch((err) => setError(err.message));
  }, []);

  async function manejarGenerar(datos) {
    setCargando(true);
    setError(null);
    try {
      const res = await api.generarAnexo(Number(estudianteId), tipoAnexo, datos);
      setResultado(res);
    } catch (err) {
      setError(err.message || 'No fue posible generar el borrador.');
    } finally {
      setCargando(false);
    }
  }

  if (resultado) {
    return (
      <div className="card">
        <h3 className="card-title">Borrador generado</h3>
        <EditorBorrador
          borradorInicial={resultado.borrador}
          piarId={resultado.piarId}
          tipoAnexo={tipoAnexo}
          onVolver={() => setResultado(null)}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-title">Generar un anexo</h3>

      {/* Paso 1: estudiante y tipo de anexo */}
      <div className="selector-fila">
        <div className="campo-formulario">
          <label className="campo-label" htmlFor="select-estudiante">
            Estudiante (código anonimizado)
          </label>
          <select
            id="select-estudiante"
            className="select-entrada"
            value={estudianteId}
            onChange={(e) => setEstudianteId(e.target.value)}
          >
            <option value="">Selecciona un estudiante…</option>
            {estudiantes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} — {e.grado}° ({e.tipo_barrera})
              </option>
            ))}
          </select>
        </div>
        <div className="campo-formulario">
          <label className="campo-label" htmlFor="select-tipo-anexo">
            Tipo de anexo
          </label>
          <select
            id="select-tipo-anexo"
            className="select-entrada"
            value={tipoAnexo}
            onChange={(e) => setTipoAnexo(e.target.value)}
          >
            {TIPOS_ANEXO.map((t) => (
              <option key={t.valor} value={t.valor}>{t.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Paso 2: modalidad de entrada */}
      {estudianteId && (
        <>
          <div className="modalidad-tabs">
            <button
              className={`modalidad-tab${modalidad === 'libre' ? ' active' : ''}`}
              onClick={() => setModalidad('libre')}
            >
              <IconoLapiz size={15} /> Descripción libre
            </button>
            <button
              className={`modalidad-tab${modalidad === 'guiado' ? ' active' : ''}`}
              onClick={() => setModalidad('guiado')}
            >
              <IconoLista size={15} /> Formulario guiado
            </button>
          </div>

          {modalidad === 'libre' ? (
            <EntradaLibre onEnviar={manejarGenerar} cargando={cargando} />
          ) : (
            <FormularioGuiado tipoAnexo={tipoAnexo} onEnviar={manejarGenerar} cargando={cargando} />
          )}
        </>
      )}

      {error && <p className="reporte-error">{error}</p>}
    </div>
  );
}
