import { useEffect, useRef, useState } from 'react';
import { api } from '../../api/client.js';

// Preguntas de ejemplo para arrancar la conversación en la demo
const SUGERENCIAS = [
  '¿Qué es el PIAR y quiénes participan en su construcción?',
  '¿Qué relación hay entre la Declaración de Salamanca y el Compromiso de Cali?',
  '¿Cómo se conecta la CDPD de la ONU con la normativa colombiana?',
  '¿Qué aporta la educación inclusiva a los ODS 4 y 10?',
];

// Wiki conversacional: chat multi-turno con la IA, con fundamento normativo
export default function WikiIA() {
  // Historial [{ role: 'user' | 'assistant', content }]
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const finRef = useRef(null);

  // Desplaza la vista al último mensaje
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  async function enviar(pregunta) {
    const contenido = (pregunta ?? texto).trim();
    if (!contenido || cargando) return;

    const historial = [...mensajes, { role: 'user', content: contenido }];
    setMensajes(historial);
    setTexto('');
    setCargando(true);
    setError(null);
    try {
      const { respuesta } = await api.preguntarWiki(historial);
      setMensajes([...historial, { role: 'assistant', content: respuesta }]);
    } catch (err) {
      setError(err.message || 'No fue posible obtener la respuesta.');
      // Se conserva la pregunta en el historial para que el usuario pueda reintentar
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="card wiki-card">
      <h3 className="card-title">Wiki de inclusión con IA</h3>
      <p className="texto-ayuda">
        Pregunta lo que necesites sobre inclusión educativa: normativa colombiana, referentes
        internacionales, el PIAR y sus anexos. Cada respuesta cita su fundamento normativo.
      </p>

      <div className="wiki-conversacion">
        {mensajes.length === 0 && (
          <div className="wiki-sugerencias">
            <p className="wiki-sugerencias-titulo">Prueba con una de estas preguntas:</p>
            {SUGERENCIAS.map((s) => (
              <button key={s} className="wiki-sugerencia" onClick={() => enviar(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {mensajes.map((m, i) => (
          <div key={i} className={`wiki-burbuja ${m.role === 'user' ? 'usuario' : 'asistente'}`}>
            {m.content}
          </div>
        ))}

        {cargando && <div className="wiki-burbuja asistente escribiendo">Consultando la normativa…</div>}
        {error && <p className="reporte-error">{error}</p>}
        <div ref={finRef} />
      </div>

      <div className="wiki-entrada">
        <textarea
          className="textarea-entrada wiki-textarea"
          rows={2}
          placeholder="Escribe tu pregunta…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            // Enter envía; Shift+Enter hace salto de línea
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
        />
        <button className="btn-primary" onClick={() => enviar()} disabled={cargando || !texto.trim()}>
          {cargando ? '…' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
