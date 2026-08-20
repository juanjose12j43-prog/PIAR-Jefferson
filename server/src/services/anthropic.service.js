// Wrapper del SDK de Anthropic: informe ejecutivo (Fase 1),
// asistente de anexos (Fase 2) y wiki conversacional (Fase 3).
// La API key vive únicamente en el backend (variable de entorno ANTHROPIC_API_KEY).
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Modelo Claude Sonnet vigente (más reciente que Sonnet 4.6, mismo costo/tier)
const MODEL = 'claude-sonnet-5';

function construirPrompt(resumen) {
  const { kpis, distribucionPorGrado, distribucionPorBarrera, estadoSeguimientos, alertas } = resumen;

  const distGrado = distribucionPorGrado.map((d) => `Grado ${d.grado}: ${d.total}`).join(', ');
  const distBarrera = distribucionPorBarrera.map((d) => `${d.tipo}: ${d.total}`).join(', ');
  const alertasPiar = alertas.piar.map((a) => `${a.estudiante} (grado ${a.grado}) - revisión ${a.vencido ? 'vencida' : 'próxima'} el ${a.fecha}`).join('; ') || 'Ninguna';
  const alertasAnexos = alertas.anexos.map((a) => `${a.estudiante} (grado ${a.grado}) - ${a.tipo_anexo} ${a.vencido ? 'vencido' : 'vence pronto'} el ${a.fecha}`).join('; ') || 'Ninguna';

  return `Eres un asistente experto en gestión educativa e inclusión escolar en Colombia, con dominio del marco normativo (Decreto 1421 de 2017, Ley Estatutaria 1618 de 2013).

Redacta un INFORME EJECUTIVO INSTITUCIONAL DE INCLUSIÓN, en lenguaje formal, apto para presentar a la Secretaría de Educación o a la junta directiva de la institución. El informe debe basarse estrictamente en los siguientes datos actuales del tablero institucional:

DATOS GENERALES
- Total de PIAR activos: ${kpis.totalPiarActivos}
- Total de estudiantes con PIAR: ${kpis.totalEstudiantes}
- Anexos pendientes o en borrador: ${kpis.anexosPendientes}
- PIAR con revisión próxima a vencer (15 días) o vencida: ${kpis.alertasVencimiento}

DISTRIBUCIÓN POR GRADO
${distGrado}

DISTRIBUCIÓN POR TIPO DE BARRERA/DISCAPACIDAD
${distBarrera}

ESTADO DE SEGUIMIENTOS
- Al día: ${estadoSeguimientos.porcentajeAlDia}%
- Atrasados: ${estadoSeguimientos.porcentajeAtrasado}%

ALERTAS DE PIAR (revisiones vencidas o próximas)
${alertasPiar}

ALERTAS DE ANEXOS (vencidos o próximos a vencer)
${alertasAnexos}

Estructura el informe con: 1) Resumen ejecutivo, 2) Estado general de la gestión de inclusión, 3) Análisis de la distribución de estudiantes y barreras, 4) Alertas y riesgos de cumplimiento normativo, 5) Recomendaciones concretas para la institución. No inventes datos que no estén en la información suministrada. Responde únicamente con el texto del informe, sin comentarios adicionales.`;
}

export async function generarReporteEjecutivo(resumen) {
  const prompt = construirPrompt(resumen);

  const respuesta = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
  return bloqueTexto ? bloqueTexto.text : '';
}

// ---------------------------------------------------------------------------
// Fase 2: Asistente de anexos
// ---------------------------------------------------------------------------

// Rol compartido por los prompts del módulo de anexos
const ROL_INCLUSION = `Eres especialista en educación inclusiva en Colombia, con dominio del Decreto 1421 de 2017, la Ley Estatutaria 1618 de 2013 y el Diseño Universal para el Aprendizaje (DUA). Redactas documentos institucionales del PIAR con lenguaje técnico-pedagógico formal, usando términos como "barreras para el aprendizaje y la participación", "ajustes razonables" y "valoración pedagógica".`;

// Estructura de secciones esperada para cada tipo de anexo, alineada con las
// secciones del formato oficial del PIAR (MEN, V14, Decreto 1421 de 2017).
// Las secciones se marcan con "## " para que el servicio DOCX las ubique en
// el lugar correspondiente del formato al exportar a Word.
const ESTRUCTURAS_ANEXO = {
  caracterizacion: `## 1) Información general del estudiante
## 2) Entorno Salud
## 3) Entorno Hogar
## 4) Entorno Educativo`,
  ajustes: `## Características del estudiante
## Área o asignatura
## Objetivos / propósitos del grado (EBC y DBA)
## Barreras que se evidencian en el contexto
## Ajustes razonables (apoyos y estrategias)
## Evaluación y seguimiento de los ajustes
## Recomendaciones para el Plan de Mejoramiento Institucional`,
  acta_familia: `## Participantes
## Compromisos de la institución
## Compromisos de la familia
## Compromisos del estudiante
## Actividades de apoyo en casa
## Fecha del próximo seguimiento`,
};

// Instrucciones adicionales propias de cada tipo de anexo
const INSTRUCCIONES_EXTRA = {
  caracterizacion:
    '- Ubica la información aportada en el entorno que corresponda (salud, hogar o educativo). Los datos administrativos que no fueron suministrados (documentos, direcciones, EPS, nombres de familiares) se dejan como [Por completar por el docente].',
  ajustes:
    '- En "Área o asignatura" escribe únicamente el nombre del área.\n- En "Objetivos / propósitos del grado" recuerda que son los del grado según los EBC y los DBA: no se rebaja la meta, se ajustan los apoyos.\n- En "Barreras que se evidencian en el contexto" describe obstáculos del entorno (metodologías, materiales, actitudes), no del estudiante.\n- En "Evaluación y seguimiento" alinea el seguimiento con el SIEE (mínimo 3 veces al año).',
  acta_familia:
    '- En "Actividades de apoyo en casa" escribe cada actividad en una línea propia con el formato: Nombre de la actividad | Descripción de la estrategia | Frecuencia (D diaria, S semanal o P permanente).',
};

// Nombres formales de cada anexo (se usan también en el DOCX)
export const NOMBRES_ANEXO = {
  caracterizacion: 'Anexo de caracterización del estudiante',
  ajustes: 'Anexo de ajustes razonables por área',
  acta_familia: 'Acta de acuerdo y seguimiento con la familia',
};

// Mapa inverso: nombre formal guardado en BD → clave del tipo de anexo
export const CLAVE_POR_NOMBRE = Object.fromEntries(
  Object.entries(NOMBRES_ANEXO).map(([clave, nombre]) => [nombre, clave])
);

// Recomienda qué anexo diligenciar a partir de una descripción breve.
// Devuelve JSON estructurado para renderizar como tarjeta en el frontend.
export async function recomendarAnexo(contexto) {
  const prompt = `${ROL_INCLUSION}

Un docente describe la siguiente situación de un estudiante:

"${contexto}"

Indica qué anexo del PIAR corresponde diligenciar. Las opciones son:
- "caracterizacion": ${NOMBRES_ANEXO.caracterizacion} (nuevo ingreso o primera identificación de la situación)
- "ajustes": ${NOMBRES_ANEXO.ajustes} (estudiante ya caracterizado que requiere ajustes en una o varias áreas)
- "acta_familia": ${NOMBRES_ANEXO.acta_familia} (acuerdos o seguimiento con la familia, incluido cierre de año)

Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional ni marcas de código, con esta forma:
{
  "anexo": "caracterizacion" | "ajustes" | "acta_familia",
  "nombreAnexo": "nombre formal del anexo",
  "momento": "en qué momento del año escolar debe diligenciarse",
  "participantes": "quiénes deben participar según el Decreto 1421 de 2017",
  "justificacion": "explicación breve y clara de por qué corresponde ese anexo"
}`;

  const respuesta = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const texto = respuesta.content.find((b) => b.type === 'text')?.text ?? '';
  // El prompt pide JSON puro, pero se tolera que venga envuelto en ```json ... ```
  const limpio = texto.replace(/```json\s*|```/g, '').trim();
  return JSON.parse(limpio);
}

// ---------------------------------------------------------------------------
// Fase 3: Wiki conversacional del Centro de conocimiento
// ---------------------------------------------------------------------------

// System prompt de la wiki: marco normativo colombiano + referentes
// internacionales verificados. La IA debe citar la fuente en cada respuesta.
const SYSTEM_WIKI = `Eres la wiki conversacional del Centro de conocimiento de un aplicativo de gestión de la inclusión educativa en Colombia. Respondes preguntas de docentes, orientadores y directivos sobre educación inclusiva, siempre con fundamento normativo y citando la fuente (norma, artículo o documento).

MARCO NORMATIVO COLOMBIANO QUE DOMINAS
- Constitución Política de 1991, artículo 67: la educación como derecho de la persona y servicio público con función social.
- Ley 115 de 1994 (Ley General de Educación).
- Ley 1346 de 2009: incorpora al derecho interno colombiano la Convención sobre los Derechos de las Personas con Discapacidad de la ONU.
- Ley Estatutaria 1618 de 2013: garantiza el pleno ejercicio de los derechos de las personas con discapacidad.
- Decreto 1421 de 2017: reglamenta la atención educativa a la población con discapacidad en el marco de la educación inclusiva. Define el PIAR (Plan Individual de Ajustes Razonables), sus anexos, los ajustes razonables y los actores del proceso.
- Diseño Universal para el Aprendizaje (DUA) como enfoque pedagógico transversal.

REFERENTES INTERNACIONALES QUE DOMINAS (datos verificados; no alteres fechas ni cifras)
- Declaración de Salamanca (UNESCO, 1994): adoptada en la Conferencia Mundial sobre Necesidades Educativas Especiales (Salamanca, España, 7–10 de junio de 1994), con representantes de 92 gobiernos y 25 organizaciones internacionales. Estableció el principio fundamental de la inclusión: todos los niños deben aprender juntos siempre que sea posible, y la escuela debe adaptarse a la diversidad de sus estudiantes. Impulso fundacional de la educación inclusiva mundial.
- Convención sobre los Derechos de las Personas con Discapacidad (ONU, 2006): consagra el derecho a la educación inclusiva en su artículo 24; introduce los conceptos de ajustes razonables y diseño universal. Colombia la incorporó mediante la Ley 1346 de 2009.
- Objetivos de Desarrollo Sostenible (Agenda 2030, ONU): el ODS 4 (Educación de calidad) busca garantizar una educación inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje permanente para todos; el ODS 10 (Reducción de las desigualdades) busca reducir la desigualdad, incluida la potenciación y promoción de la inclusión social de todas las personas independientemente de su condición. La educación inclusiva es una vía directa para cumplir ambos.
- Foro Internacional sobre Inclusión y Equidad en la Educación — Compromiso de Cali (UNESCO, 2019): organizado por la UNESCO con el Ministerio de Educación de Colombia y la ciudad de Cali, del 11 al 13 de septiembre de 2019, bajo el lema "Todas y todos los estudiantes cuentan". Conmemoró los 25 años de la Declaración de Salamanca y culminó con el Compromiso de Cali, que fija prioridades para cumplir el ODS 4 hacia 2030.
- Foro Mundial de Escuelas Inclusivas (UNESCO e IFIP, desde 2019): encuentro anual organizado por la UNESCO junto con el International Forums of Inclusion Practitioners (IFIP), que reúne a profesionales de todo el mundo para intercambiar prácticas innovadoras y fortalecer sinergias entre escuelas y comunidades a escala local, regional y global.

INSTRUCCIONES
- Cuando la pregunta lo permita, conecta el marco global con el colombiano (ej.: CDPD art. 24 → Ley 1346 de 2009; Salamanca 1994 → Compromiso de Cali 2019).
- Responde en español, con tono profesional y cercano, en extensión moderada (párrafos breves; usa listas cuando aporten claridad).
- No inventes normas, artículos, fechas ni cifras. Si no estás seguro de un dato, dilo explícitamente.
- Si la pregunta no trata de inclusión ni de educación, redirige con amabilidad hacia los temas del Centro de conocimiento.`;

// Responde una pregunta de la wiki manteniendo el historial de la conversación.
// `mensajes` llega como [{ role: 'user' | 'assistant', content: string }, ...]
export async function responderWiki(mensajes) {
  const respuesta = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: SYSTEM_WIKI,
    messages: mensajes,
  });

  const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
  return bloqueTexto ? bloqueTexto.text : '';
}

// Genera el borrador de un anexo en lenguaje institucional formal.
// `datos` es el aporte del docente: texto libre o respuestas del formulario guiado.
export async function generarBorradorAnexo({ estudiante, tipoAnexo, datos }) {
  const estructura = ESTRUCTURAS_ANEXO[tipoAnexo];
  if (!estructura) {
    throw new Error(`Tipo de anexo no soportado: ${tipoAnexo}`);
  }

  const prompt = `${ROL_INCLUSION}

Redacta el borrador del documento "${NOMBRES_ANEXO[tipoAnexo]}" del PIAR para el siguiente estudiante:

DATOS DEL ESTUDIANTE (registrados en el sistema)
- Código del estudiante (identificador anonimizado por protección de datos): ${estudiante.nombre}
- Grado: ${estudiante.grado}°
- Tipo de barrera registrada: ${estudiante.tipo_barrera}

Nota de salvaguarda: el sistema no maneja nombres propios. Refiérete al estudiante como "el estudiante" o por su código; nunca inventes un nombre.

INFORMACIÓN APORTADA POR EL DOCENTE
${datos}

INSTRUCCIONES DE REDACCIÓN
- Usa exactamente esta estructura de secciones, cada una iniciando con "## " (dos numerales y un espacio). Corresponde a las secciones del formato oficial del PIAR (MEN, Decreto 1421 de 2017):
${estructura}
${INSTRUCCIONES_EXTRA[tipoAnexo] || ''}
- Bajo cada sección redacta párrafos en lenguaje institucional formal colombiano.
- Fundamenta los ajustes y recomendaciones en el Decreto 1421 de 2017 y en principios DUA cuando aplique.
- No inventes datos personales, diagnósticos médicos ni información que no esté en lo suministrado. Donde falte información escribe exactamente: [Por completar por el docente]
- Empieza directamente con la primera sección "## ": no agregues título general, encabezado con datos del estudiante ni comentarios antes o después del contenido.`;

  const respuesta = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const bloqueTexto = respuesta.content.find((b) => b.type === 'text');
  return bloqueTexto ? bloqueTexto.text : '';
}
