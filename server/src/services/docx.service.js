// Generación del archivo Word (.docx) de los anexos del PIAR replicando el
// formato oficial del MEN (V14 del 16/02/2018, Decreto 1421 de 2017):
// membrete institucional, secciones, tablas y pie de página del formato,
// con los campos diligenciados a partir de los datos del sistema y el
// contenido generado/editado por el docente.
import fs from 'node:fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Footer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';

// Membrete oficial extraído del formato (Mineducación · Gobierno de Colombia)
const MEMBRETE_PNG = fs.readFileSync(new URL('../assets/membrete-men.png', import.meta.url));

const GRIS_ETIQUETA = 'EEF1F5';
const AZUL_TITULO = '1F3864';
const BORDE = { style: BorderStyle.SINGLE, size: 4, color: 'B7BEC8' };
const BORDES_CELDA = { top: BORDE, bottom: BORDE, left: BORDE, right: BORDE };

// ---------------------------------------------------------------------------
// Utilidades de texto
// ---------------------------------------------------------------------------

// Normaliza para comparar títulos de sección (sin tildes, minúsculas)
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Divide el contenido del borrador en secciones marcadas con "## "
function parseSecciones(contenido) {
  const secciones = [];
  let actual = null;
  for (const linea of contenido.split('\n')) {
    const texto = linea.trim();
    if (texto.startsWith('## ')) {
      actual = { titulo: texto.replace('## ', ''), lineas: [] };
      secciones.push(actual);
    } else if (texto && actual) {
      actual.lineas.push(texto);
    }
  }
  return secciones;
}

// Busca una sección cuyo título contenga la palabra clave
function seccion(secciones, palabraClave) {
  return secciones.find((s) => normalizar(s.titulo).includes(normalizar(palabraClave)));
}

// Convierte las líneas de una sección en párrafos Word (con viñetas si aplica)
function parrafosDe(sec, tamano = 20) {
  if (!sec || sec.lineas.length === 0) {
    return [parrafo('[Por completar por el docente]', { italica: true, tamano })];
  }
  return sec.lineas.map((linea) => {
    if (linea.startsWith('- ') || linea.startsWith('* ')) {
      return new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 40 },
        children: [new TextRun({ text: linea.slice(2), size: tamano })],
      });
    }
    return parrafo(linea, { tamano, justificado: true });
  });
}

function textoPlanoDe(sec) {
  return sec && sec.lineas.length > 0 ? sec.lineas.join('\n') : '[Por completar]';
}

// ---------------------------------------------------------------------------
// Piezas visuales del formato
// ---------------------------------------------------------------------------

function parrafo(texto, { negrita = false, italica = false, tamano = 20, color, centrado = false, justificado = false, despues = 100 } = {}) {
  return new Paragraph({
    alignment: centrado ? AlignmentType.CENTER : justificado ? AlignmentType.JUSTIFIED : undefined,
    spacing: { after: despues },
    children: [new TextRun({ text: texto, bold: negrita, italics: italica, size: tamano, color })],
  });
}

// Membrete: logos oficiales + rótulo PIAR · Decreto 1421/2017
function membrete() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new ImageRun({
          data: MEMBRETE_PNG,
          type: 'png',
          transformation: { width: 620, height: 89 },
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 160 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: AZUL_TITULO } },
      children: [
        new TextRun({ text: 'PIAR ', bold: true, size: 22, color: AZUL_TITULO }),
        new TextRun({ text: '· Decreto 1421/2017', size: 18, color: '555555' }),
      ],
    }),
  ];
}

// Pie de página del formato oficial
function pieOficial() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'V14.16/02/2018 — Ministerio de Educación Nacional · Viceministerio de Educación Preescolar, Básica y Media — Decreto 1421 de 2017',
            size: 14,
            color: '777777',
          }),
        ],
      }),
    ],
  });
}

// Barra de título de sección, como en el formato (fondo gris, mayúsculas)
function barraSeccion(titulo) {
  return new Paragraph({
    shading: { fill: GRIS_ETIQUETA },
    border: {
      top: BORDE, bottom: BORDE, left: BORDE, right: BORDE,
    },
    spacing: { before: 220, after: 120 },
    children: [new TextRun({ text: `  ${titulo.toUpperCase()}`, bold: true, size: 20 })],
  });
}

function celda(texto, { etiqueta = false, ancho, italica = false } = {}) {
  return new TableCell({
    width: ancho ? { size: ancho, type: WidthType.PERCENTAGE } : undefined,
    shading: etiqueta ? { fill: GRIS_ETIQUETA } : undefined,
    borders: BORDES_CELDA,
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: [
      new Paragraph({
        children: [new TextRun({ text: texto, bold: etiqueta, italics: italica, size: 19 })],
      }),
    ],
  });
}

// Tabla de pares etiqueta/valor (dos columnas)
function tablaCampos(pares) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: pares.map(
      ([etiqueta, valor]) =>
        new TableRow({
          children: [
            celda(etiqueta, { etiqueta: true, ancho: 38 }),
            celda(valor || '[Por completar]', { ancho: 62, italica: !valor }),
          ],
        })
    ),
  });
}

// Bloque de firmas con línea y rótulo
function firmas(rotulos) {
  const filas = [
    new TableRow({
      children: rotulos.map(
        () =>
          new TableCell({
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            margins: { top: 340, bottom: 20, left: 110, right: 110 },
            children: [
              new Paragraph({
                border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '555555' } },
                children: [new TextRun({ text: ' ' })],
              }),
            ],
          })
      ),
    }),
    new TableRow({
      children: rotulos.map(
        (r) =>
          new TableCell({
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            margins: { left: 110, right: 110 },
            children: [parrafo(r, { tamano: 17, color: '555555' })],
          })
      ),
    }),
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
    rows: filas,
  });
}

function tituloAnexo(lineas) {
  return lineas.map((l, i) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: i === lineas.length - 1 ? 220 : 40 },
      children: [
        new TextRun({ text: l, bold: i === 0, size: i === 0 ? 26 : 19, color: i === 0 ? AZUL_TITULO : '555555' }),
      ],
    })
  );
}

const fechaHoy = () =>
  new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

// ---------------------------------------------------------------------------
// Anexo 1 — Información general del estudiante (para la matrícula)
// ---------------------------------------------------------------------------

function construirAnexo1({ estudiante, grado, tipoBarrera, secciones }) {
  const hijos = [
    ...membrete(),
    ...tituloAnexo(['INFORMACIÓN GENERAL DEL ESTUDIANTE', '(Información para la matrícula – Anexo 1 PIAR)']),
    tablaCampos([
      ['Fecha y lugar de diligenciamiento', fechaHoy()],
      ['Nombre de la persona que diligencia', ''],
      ['Rol que desempeña en la SE o la IE', ''],
      ['Código del estudiante (dato anonimizado)', estudiante],
      ['Grado al que aspira ingresar', `${grado}°`],
      ['Tipo de barrera registrada', tipoBarrera],
    ]),
  ];

  // Las cuatro secciones del formato, con el contenido redactado por la IA/docente
  const mapa = [
    ['informacion general', '1) Información general del estudiante'],
    ['salud', '2) Entorno Salud'],
    ['hogar', '3) Entorno Hogar'],
    ['educativo', '4) Entorno Educativo'],
  ];
  for (const [clave, tituloOficial] of mapa) {
    hijos.push(barraSeccion(tituloOficial));
    hijos.push(...parrafosDe(seccion(secciones, clave)));
  }

  hijos.push(new Paragraph({ spacing: { before: 200 }, children: [] }));
  hijos.push(firmas(['Nombre y firma — Área', 'Nombre y firma — Área', 'Nombre y firma — Área']));
  return hijos;
}

// ---------------------------------------------------------------------------
// Anexo 2 — Plan Individual de Ajustes Razonables (valoración y ajustes)
// ---------------------------------------------------------------------------

function construirAnexo2({ estudiante, grado, tipoBarrera, secciones }) {
  const area = textoPlanoDe(seccion(secciones, 'area o asignatura')).split('\n')[0];

  const encabezadosTabla = [
    'ÁREAS / APRENDIZAJES',
    'OBJETIVOS / PROPÓSITOS (EBC y DBA)',
    'BARRERAS QUE SE EVIDENCIAN EN EL CONTEXTO',
    'AJUSTES RAZONABLES (Apoyos / estrategias)',
    'EVALUACIÓN DE LOS AJUSTES',
  ];
  const anchos = [14, 21, 21, 22, 22];

  const celdaTabla = (texto, { encabezado = false, ancho } = {}) =>
    new TableCell({
      width: { size: ancho, type: WidthType.PERCENTAGE },
      shading: encabezado ? { fill: GRIS_ETIQUETA } : undefined,
      borders: BORDES_CELDA,
      margins: { top: 70, bottom: 70, left: 90, right: 90 },
      children: texto.split('\n').map((l) =>
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: l.replace(/^[-*] /, '• '), bold: encabezado, size: encabezado ? 16 : 17 })],
        })
      ),
    });

  const hijos = [
    ...membrete(),
    ...tituloAnexo(['PLAN INDIVIDUAL DE AJUSTES RAZONABLES – PIAR –', 'ANEXO 2']),
    tablaCampos([
      ['Fecha de elaboración', fechaHoy()],
      ['Institución educativa · Sede · Jornada', ''],
      ['Docentes que elaboran y cargo', ''],
      ['Código del estudiante (dato anonimizado)', estudiante],
      ['Grado', `${grado}°`],
      ['Tipo de barrera registrada', tipoBarrera],
    ]),
    barraSeccion('1. Características del estudiante'),
    ...parrafosDe(seccion(secciones, 'caracteristicas')),
    barraSeccion('2. Ajustes razonables'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: encabezadosTabla.map((t, i) => celdaTabla(t, { encabezado: true, ancho: anchos[i] })),
        }),
        new TableRow({
          children: [
            celdaTabla(area, { ancho: anchos[0] }),
            celdaTabla(textoPlanoDe(seccion(secciones, 'objetivos')), { ancho: anchos[1] }),
            celdaTabla(textoPlanoDe(seccion(secciones, 'barreras')), { ancho: anchos[2] }),
            celdaTabla(textoPlanoDe(seccion(secciones, 'apoyos')), { ancho: anchos[3] }),
            celdaTabla(textoPlanoDe(seccion(secciones, 'evaluacion')), { ancho: anchos[4] }),
          ],
        }),
      ],
    }),
    parrafo(
      'Nota: los objetivos/propósitos corresponden a los de todo el grado, de acuerdo con los EBC y los DBA. La evaluación de los ajustes se realiza mínimo 3 veces en el año, según la periodicidad establecida en el SIEE.',
      { italica: true, tamano: 16, color: '777777', despues: 160 }
    ),
    barraSeccion('Recomendaciones para el Plan de Mejoramiento Institucional'),
    ...parrafosDe(seccion(secciones, 'recomendaciones')),
    new Paragraph({ spacing: { before: 200 }, children: [] }),
    firmas(['Nombre y firma — Área', 'Nombre y firma — Área', 'Nombre y firma — Área']),
  ];
  return hijos;
}

// ---------------------------------------------------------------------------
// Anexo 3 — Acta de Acuerdo
// ---------------------------------------------------------------------------

function construirAnexo3({ estudiante, grado, secciones }) {
  // Tabla de actividades en casa: cada línea "Actividad | Estrategia | Frecuencia"
  const actividades = (seccion(secciones, 'actividades')?.lineas || [])
    .map((l) => l.replace(/^[-*] /, '').split('|').map((p) => p.trim()))
    .filter((partes) => partes[0]);

  const filasActividades = actividades.length > 0
    ? actividades.map(
        (p) =>
          new TableRow({
            children: [
              celda(p[0] || '', { ancho: 26 }),
              celda(p[1] || '', { ancho: 50 }),
              celda(p[2] || '', { ancho: 24 }),
            ],
          })
      )
    : [new TableRow({ children: [celda('[Por completar]', { ancho: 26, italica: true }), celda('', { ancho: 50 }), celda('', { ancho: 24 })] })];

  const hijos = [
    ...membrete(),
    ...tituloAnexo(['ACTA DE ACUERDO', 'Plan Individual de Ajustes Razonables – PIAR – Anexo 3']),
    tablaCampos([
      ['Fecha', fechaHoy()],
      ['Institución educativa y sede', ''],
      ['Código del estudiante (dato anonimizado)', estudiante],
      ['Grado', `${grado}°`],
    ]),
    barraSeccion('Participantes'),
    ...parrafosDe(seccion(secciones, 'participantes')),
    // Marco del acuerdo según el Decreto 1421 de 2017 (síntesis)
    parrafo(
      'En el marco del Decreto 1421 de 2017, la educación inclusiva es un proceso permanente que reconoce, valora y responde a la diversidad de los estudiantes para promover su desarrollo, aprendizaje y participación en un ambiente común, sin discriminación. La inclusión solo es posible cuando se unen los esfuerzos de la institución, el estudiante y la familia; por ello los compromisos de la presente acta se formalizan con las firmas de los actores.',
      { italica: true, tamano: 18, justificado: true, despues: 160 }
    ),
    barraSeccion('Compromisos de la institución'),
    ...parrafosDe(seccion(secciones, 'institucion')),
    barraSeccion('Compromisos de la familia'),
    ...parrafosDe(seccion(secciones, 'familia')),
    barraSeccion('Compromisos del estudiante'),
    ...parrafosDe(seccion(secciones, 'estudiante')),
    barraSeccion('Actividades de apoyo en casa'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            celda('Nombre de la actividad', { etiqueta: true, ancho: 26 }),
            celda('Descripción de la estrategia', { etiqueta: true, ancho: 50 }),
            celda('Frecuencia (D / S / P)', { etiqueta: true, ancho: 24 }),
          ],
        }),
        ...filasActividades,
      ],
    }),
    parrafo('Frecuencia: D = diaria · S = semanal · P = permanente', { italica: true, tamano: 16, color: '777777' }),
    barraSeccion('Fecha del próximo seguimiento'),
    ...parrafosDe(seccion(secciones, 'seguimiento')),
    new Paragraph({ spacing: { before: 160 }, children: [] }),
    barraSeccion('Firma de los actores comprometidos'),
    firmas(['Estudiante', 'Acudiente / familia']),
    firmas(['Docentes', 'Directivo docente']),
  ];
  return hijos;
}

// ---------------------------------------------------------------------------
// Diseño genérico (anexos guardados con tipos anteriores u otros)
// ---------------------------------------------------------------------------

function construirGenerico({ tituloAnexo: titulo, estudiante, grado, tipoBarrera, contenido }) {
  const hijos = [
    ...membrete(),
    ...tituloAnexo([titulo.toUpperCase()]),
    tablaCampos([
      ['Código del estudiante (dato anonimizado)', estudiante],
      ['Grado', `${grado}°`],
      ['Tipo de barrera registrada', tipoBarrera],
      ['Fecha de elaboración', fechaHoy()],
    ]),
    new Paragraph({ spacing: { after: 160 }, children: [] }),
  ];
  for (const sec of parseSecciones(contenido)) {
    hijos.push(barraSeccion(sec.titulo));
    hijos.push(...parrafosDe(sec));
  }
  hijos.push(new Paragraph({ spacing: { before: 200 }, children: [] }));
  hijos.push(firmas(['Docente responsable', 'Orientación escolar']));
  return hijos;
}

// ---------------------------------------------------------------------------
// Punto de entrada
// ---------------------------------------------------------------------------

// Genera el buffer del .docx de un anexo con el formato oficial.
// `tipoClave` es 'caracterizacion' | 'ajustes' | 'acta_familia' | null (genérico).
export async function generarDocxAnexo({ tipoClave, tituloAnexo, estudiante, grado, tipoBarrera, contenido }) {
  const secciones = parseSecciones(contenido);
  const datos = { tituloAnexo, estudiante, grado, tipoBarrera, contenido, secciones };

  let hijos;
  switch (tipoClave) {
    case 'caracterizacion':
      hijos = construirAnexo1(datos);
      break;
    case 'ajustes':
      hijos = construirAnexo2(datos);
      break;
    case 'acta_familia':
      hijos = construirAnexo3(datos);
      break;
    default:
      hijos = construirGenerico(datos);
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 20 } },
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 700, bottom: 700, left: 850, right: 850 } },
        },
        footers: { default: pieOficial() },
        children: hijos,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
