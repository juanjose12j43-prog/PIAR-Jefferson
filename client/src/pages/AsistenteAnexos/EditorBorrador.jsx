import { useState } from 'react';
import { api } from '../../api/client.js';
import { IconoVolver, IconoDescarga } from '../../components/Iconos.jsx';

// Editor de revisión: el docente ajusta el borrador, lo guarda y lo exporta a Word.
export default function EditorBorrador({ borradorInicial, piarId, tipoAnexo, onVolver }) {
  const [contenido, setContenido] = useState(borradorInicial);
  const [guardando, setGuardando] = useState(false);
  const [anexoId, setAnexoId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  async function manejarGuardar() {
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      const { anexoId } = await api.guardarAnexo(piarId, tipoAnexo, contenido);
      setAnexoId(anexoId);
      setMensaje('Borrador guardado. Ya puedes exportarlo a Word.');
    } catch (err) {
      setError(err.message || 'No fue posible guardar el borrador.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <div className="editor-toolbar">
        <button className="btn-secundario" onClick={onVolver}><IconoVolver size={15} /> Volver</button>
        <div className="editor-acciones">
          <button className="btn-primary" onClick={manejarGuardar} disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar borrador'}
          </button>
          {anexoId && (
            <a className="btn-exportar" href={api.urlExportarAnexo(anexoId)} download>
              <IconoDescarga size={15} /> Exportar a Word
            </a>
          )}
        </div>
      </div>
      <p className="texto-ayuda">
        Revisa y ajusta el borrador antes de exportar. Las líneas que inician con «## » se
        convertirán en títulos de sección en el documento Word.
      </p>
      <textarea
        className="editor-documento"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />
      {mensaje && <p className="mensaje-ok">{mensaje}</p>}
      {error && <p className="reporte-error">{error}</p>}
    </div>
  );
}
