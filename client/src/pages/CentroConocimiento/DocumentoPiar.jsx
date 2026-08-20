import { useState } from 'react';
import { ANATOMIA_PIAR, FORMATO_PIAR } from './contenido.js';

// Pestaña "El documento PIAR".
// Vista principal: facsímil anotado del formato oficial del MEN (V14, Decreto
// 1421 de 2017) — reproduce la estructura real del documento y explica al
// margen, con llamados numerados, los aspectos más importantes.
// Vista alternativa: la anatomía resumida de los tres anexos.
export default function DocumentoPiar() {
  const [vista, setVista] = useState('formato'); // 'formato' | 'resumen'

  return (
    <div>
      <div className="fpiar-toggle">
        <button
          className={`modalidad-tab${vista === 'formato' ? ' active' : ''}`}
          onClick={() => setVista('formato')}
        >
          Formato oficial anotado
        </button>
        <button
          className={`modalidad-tab${vista === 'resumen' ? ' active' : ''}`}
          onClick={() => setVista('resumen')}
        >
          Vista resumida
        </button>
      </div>

      {vista === 'formato' ? <FormatoAnotado /> : <AnatomiaResumida />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vista principal: el formato oficial, hoja por hoja, con anotaciones
// ---------------------------------------------------------------------------

function FormatoAnotado() {
  return (
    <div className="fpiar">
      <p className="docpiar-intro">{FORMATO_PIAR.intro}</p>
      <p className="fpiar-fuente">{FORMATO_PIAR.fuente}</p>

      {FORMATO_PIAR.anexos.map((anexo) => (
        <AnexoFacsimil anexo={anexo} key={anexo.rotulo} />
      ))}
    </div>
  );
}

function AnexoFacsimil({ anexo }) {
  // Numeración continua de anotaciones dentro del anexo, calculada de una vez
  // (no durante el render de los hijos, que React puede invocar dos veces en desarrollo)
  let contador = 0;
  const numerosPorBloque = anexo.bloques.map((bloque) => {
    if (bloque.tipo === 'tabla-ajustes') return bloque.explicaciones.map(() => ++contador);
    if (bloque.explicacion) return [++contador];
    return [];
  });

  return (
    <section className="fpiar-anexo">
      <header className={`fpiar-anexo-cabecera${anexo.destacado ? ' destacado' : ''}`}>
        <span className="fpiar-rotulo">{anexo.rotulo}</span>
        <div>
          <div className="docpiar-titulo-fila">
            <h3 className="fpiar-anexo-titulo">{anexo.titulo}</h3>
            {anexo.destacado && <span className="docpiar-etiqueta">{anexo.etiquetaDestacado}</span>}
          </div>
          <p className="fpiar-anexo-subtitulo">{anexo.subtitulo}</p>
          <p className="fpiar-anexo-resumen">{anexo.resumen}</p>
        </div>
      </header>

      <div className="fpiar-hoja-wrapper">
        {/* Membrete de la hoja, como en el formato oficial */}
        <div className="fpiar-fila">
          <div className="fpiar-hoja fpiar-hoja-membrete">
            <span className="fpiar-membrete-marca">PIAR</span>
            <span className="fpiar-membrete-decreto">Decreto 1421/2017</span>
          </div>
          <div />
        </div>

        {anexo.bloques.map((bloque, i) => (
          <Bloque key={bloque.titulo} bloque={bloque} numeros={numerosPorBloque[i]} />
        ))}

        {/* Pie de la hoja, como en el formato oficial */}
        <div className="fpiar-fila">
          <div className="fpiar-hoja fpiar-hoja-pie">
            V14 · 16/02/2018 — Ministerio de Educación Nacional · Viceministerio de Educación
            Preescolar, Básica y Media — Decreto 1421 de 2017
          </div>
          <div />
        </div>
      </div>
    </section>
  );
}

// Un bloque del formato (sección de campos, tabla, texto o firmas) + su anotación.
// `numeros` llega precalculado desde el anexo (varios para la tabla de ajustes).
function Bloque({ bloque, numeros }) {
  return (
    <div className="fpiar-fila">
      <div className="fpiar-hoja">
        <div className="fpiar-seccion-titulo">
          {bloque.titulo}
          {bloque.tipo !== 'tabla-ajustes' && numeros.length > 0 && (
            <span className="fpiar-marcador">{numeros[0]}</span>
          )}
        </div>

        {bloque.tipo === 'campos' && (
          <div className="fpiar-campos">
            {bloque.campos.map((c) => (
              <div className="fpiar-campo" key={c}>
                <span className="fpiar-campo-label">{c}</span>
                <span className="fpiar-campo-linea" />
              </div>
            ))}
          </div>
        )}

        {bloque.tipo === 'texto' && <p className="fpiar-parrafo">{bloque.parrafo}</p>}

        {bloque.tipo === 'tabla-ajustes' && (
          <TablaAjustes bloque={bloque} numeros={numeros} />
        )}

        {bloque.tipo === 'tabla-casa' && (
          <table className="fpiar-tabla">
            <thead>
              <tr>
                {bloque.columnas.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((f) => (
                <tr key={f}>
                  {bloque.columnas.map((col) => (
                    <td key={col}>
                      <span className="fpiar-campo-linea" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {bloque.tipo === 'firmas' && (
          <div className="fpiar-firmas">
            {bloque.campos.map((c) => (
              <div className="fpiar-firma" key={c}>
                <span className="fpiar-firma-linea" />
                <span className="fpiar-firma-label">{c}</span>
              </div>
            ))}
          </div>
        )}

        {bloque.nota && <p className="fpiar-nota">{bloque.nota}</p>}
        {bloque.tipo === 'tabla-ajustes' &&
          bloque.notas.map((n) => (
            <p className="fpiar-nota" key={n}>{n}</p>
          ))}
      </div>

      {/* Anotaciones al margen */}
      <div className="fpiar-anotaciones">
        {bloque.tipo === 'tabla-ajustes'
          ? bloque.explicaciones.map((e, i) => (
              <Anotacion key={e.titulo} numero={numeros[i]} explicacion={e} />
            ))
          : bloque.explicacion && (
              <Anotacion numero={numeros[0]} explicacion={bloque.explicacion} />
            )}
      </div>
    </div>
  );
}

// La tabla de ajustes razonables del Anexo 2, con marcadores en las columnas clave
function TablaAjustes({ bloque, numeros }) {
  // Columnas que llevan marcador: objetivos (1), barreras (2), evaluación (4)
  const marcadorPorColumna = { 1: numeros[0], 2: numeros[1], 4: numeros[2] };

  return (
    <table className="fpiar-tabla fpiar-tabla-ajustes">
      <thead>
        <tr>
          {bloque.columnas.map((col, i) => (
            <th key={col}>
              {col}
              {marcadorPorColumna[i] && (
                <span className="fpiar-marcador">{marcadorPorColumna[i]}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bloque.filas.map((fila) => (
          <tr key={fila}>
            <td className="fpiar-tabla-area">{fila}</td>
            {[1, 2, 3, 4].map((c) => (
              <td key={c}>
                <span className="fpiar-campo-linea" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Anotacion({ numero, explicacion }) {
  return (
    <aside className="fpiar-anotacion">
      <span className="fpiar-anotacion-numero">{numero}</span>
      <div>
        <h4 className="fpiar-anotacion-titulo">{explicacion.titulo}</h4>
        <p className="fpiar-anotacion-texto">{explicacion.texto}</p>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Vista alternativa: anatomía resumida (la versión original de la pestaña)
// ---------------------------------------------------------------------------

function AnatomiaResumida() {
  return (
    <div className="docpiar">
      <p className="docpiar-intro">{ANATOMIA_PIAR.intro}</p>

      <div className="docpiar-flujo">
        {ANATOMIA_PIAR.anexos.map((anexo, i) => (
          <div className="docpiar-bloque" key={anexo.numero}>
            <AnexoResumen anexo={anexo} />
            {i < ANATOMIA_PIAR.anexos.length - 1 && <div className="docpiar-conector" />}
          </div>
        ))}
      </div>

      <div className="docpiar-cierre">
        <span className="docpiar-cierre-etiqueta">Documento vivo</span>
        <p className="docpiar-cierre-texto">{ANATOMIA_PIAR.cierre}</p>
      </div>
    </div>
  );
}

function AnexoResumen({ anexo }) {
  return (
    <article className={`docpiar-anexo${anexo.destacado ? ' destacado' : ''}`}>
      <header className="docpiar-cabecera">
        <span className="docpiar-numero">{anexo.numero}</span>
        <div className="docpiar-cabecera-textos">
          <div className="docpiar-titulo-fila">
            <h3 className="docpiar-titulo">Anexo {anexo.numero} — {anexo.titulo}</h3>
            {anexo.destacado && (
              <span className="docpiar-etiqueta">{anexo.etiquetaDestacado}</span>
            )}
          </div>
          <p className="docpiar-pregunta">{anexo.pregunta}</p>
        </div>
      </header>

      <p className="docpiar-proposito">{anexo.proposito}</p>

      <div className="docpiar-meta">
        <span className="docpiar-chip"><strong>Quién:</strong> {anexo.quien}</span>
        <span className="docpiar-chip"><strong>Cuándo:</strong> {anexo.cuando}</span>
      </div>

      <div className="docpiar-secciones">
        {anexo.secciones.map((s) => (
          <div className="docpiar-seccion" key={s.nombre}>
            <h4 className="docpiar-seccion-nombre">{s.nombre}</h4>
            <p className="docpiar-seccion-para">{s.para}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
