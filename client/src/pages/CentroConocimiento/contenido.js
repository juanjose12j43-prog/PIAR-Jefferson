// Contenido curado del Centro de conocimiento.
// Editar aquí los textos sin tocar los componentes.

// ----- Pestaña "Conceptos clave" -----
export const CONCEPTOS = [
  {
    titulo: '¿Qué es el PIAR?',
    texto:
      'El Plan Individual de Ajustes Razonables (PIAR) es la herramienta definida por el Decreto 1421 de 2017 para garantizar los procesos de enseñanza y aprendizaje de los estudiantes con discapacidad. Parte de una valoración pedagógica y social, y documenta los ajustes razonables que la institución se compromete a implementar para eliminar las barreras del entorno.',
    fuente: 'Decreto 1421 de 2017',
  },
  {
    titulo: 'Los anexos del PIAR',
    texto:
      'El PIAR se materializa en documentos concretos: la caracterización del estudiante (información general, contexto y barreras identificadas), los ajustes razonables por área (qué se ajusta, cómo y con qué criterios de seguimiento) y las actas de acuerdo con las familias (compromisos de institución, familia y estudiante). Cada uno tiene un momento del año escolar y unos participantes definidos.',
    fuente: 'Decreto 1421 de 2017',
  },
  {
    titulo: 'Diversidad no es lo mismo que inclusión',
    texto:
      'La diversidad es un hecho: toda aula es diversa en capacidades, culturas, ritmos e intereses. La inclusión es una decisión: transformar el entorno para que esa diversidad participe y aprenda en igualdad de condiciones. El enfoque inclusivo desplaza la pregunta de "¿qué le pasa al estudiante?" a "¿qué barreras del entorno impiden su participación?".',
    fuente: 'Ley Estatutaria 1618 de 2013',
  },
  {
    titulo: '¿Qué es el DUA?',
    texto:
      'El Diseño Universal para el Aprendizaje (DUA) propone diseñar las clases desde el inicio para todos: múltiples formas de representar la información, múltiples formas de acción y expresión, y múltiples formas de motivación y compromiso. Cuando el aula se diseña universalmente, se reducen los ajustes individuales necesarios.',
    fuente: 'Decreto 1421 de 2017 (enfoque transversal)',
  },
  {
    titulo: '¿Quiénes participan?',
    texto:
      'La inclusión es corresponsabilidad: directivos que lideran, docentes que implementan los ajustes en el aula, orientación escolar que acompaña el proceso, familias que aportan información y compromisos, y el propio estudiante como protagonista. El PIAR se construye y se revisa entre todos.',
    fuente: 'Decreto 1421 de 2017',
  },
];

// ----- Pestaña "El documento PIAR": facsímil anotado del formato oficial -----
// Reproduce la estructura del formato oficial del MEN (versión V14 del
// 16/02/2018, Decreto 1421 de 2017), sección por sección, con anotaciones
// que explican los aspectos más importantes de cada parte.
export const FORMATO_PIAR = {
  fuente: 'Formato oficial · Ministerio de Educación Nacional · V14 (16/02/2018) · Decreto 1421 de 2017',
  intro:
    'Este es el formato oficial del PIAR tal como lo publica el Ministerio de Educación Nacional. Recorre sus tres anexos sección por sección: a la izquierda, la estructura real del documento; al margen, la explicación de por qué cada parte importa.',
  anexos: [
    {
      rotulo: 'Anexo 1',
      titulo: 'Información general del estudiante',
      subtitulo: 'Información para la matrícula',
      resumen:
        'Se diligencia al momento de la matrícula. Recoge el contexto completo del estudiante en cuatro entornos: identidad, salud, hogar y trayectoria educativa.',
      bloques: [
        {
          tipo: 'campos',
          titulo: 'Encabezado del formato',
          campos: [
            'Fecha y lugar de diligenciamiento',
            'Nombre de la persona que diligencia',
            'Rol que desempeña en la SE o la IE',
          ],
          explicacion: {
            titulo: 'Trazabilidad desde la primera línea',
            texto:
              'El formato exige registrar quién lo diligencia y en calidad de qué. El PIAR no es anónimo: cada aporte tiene un responsable identificable.',
          },
        },
        {
          tipo: 'campos',
          titulo: '1) Información general del estudiante',
          campos: [
            'Nombres y apellidos',
            'Lugar y fecha de nacimiento · Edad',
            'Tipo y n.º de identificación (TI / CC / RC / otro)',
            'Departamento, municipio y dirección de vivienda',
            'Teléfono · Correo electrónico',
            '¿Está en centro de protección? ¿Dónde?',
            'Grado al que aspira ingresar',
            '¿Se reconoce o pertenece a un grupo étnico? ¿Cuál?',
            '¿Se reconoce como víctima del conflicto armado? ¿Cuenta con registro?',
          ],
          nota: 'El formato indica: si el estudiante no tiene registro civil, debe iniciarse la gestión con la familia y la Registraduría.',
          explicacion: {
            titulo: 'Mirada interseccional',
            texto:
              'El formato pregunta por pertenencia étnica, conflicto armado y protección porque las exclusiones suelen acumularse. Y la falta de documento de identidad no frena la matrícula: activa una gestión con la Registraduría.',
          },
        },
        {
          tipo: 'campos',
          titulo: '2) Entorno Salud',
          campos: [
            'Afiliación al sistema de salud · EPS (contributivo / subsidiado)',
            'Lugar de atención en caso de emergencia',
            '¿Está siendo atendido por el sector salud? Frecuencia',
            '¿Tiene diagnóstico médico? ¿Cuál?',
            '¿Asiste a terapias? Cuáles y con qué frecuencia',
            '¿Recibe tratamiento médico? ¿Consume medicamentos? Horario',
            'Productos de apoyo: sillas de ruedas, bastones, tableros de comunicación, audífonos…',
          ],
          explicacion: {
            titulo: 'El diagnóstico orienta, no condiciona',
            texto:
              'La información de salud sirve para articular escuela y sector salud: terapias que coinciden con la jornada, medicamentos que se toman en horario de clases, productos de apoyo que el aula debe acoger. Tener o no diagnóstico no es requisito para recibir apoyos.',
          },
        },
        {
          tipo: 'campos',
          titulo: '3) Entorno Hogar',
          campos: [
            'Nombre y ocupación de la madre y del padre',
            'Nivel educativo alcanzado (prim. / bto. / téc. / tecn. / univ.)',
            'Cuidador: parentesco, nivel educativo, teléfono y correo',
            'N.º de hermanos y lugar que ocupa',
            '¿Quiénes apoyan la crianza? · Personas con quien vive',
            '¿Está bajo protección? · ¿La familia recibe algún subsidio?',
          ],
          explicacion: {
            titulo: 'La red real de apoyo',
            texto:
              'Conocer quién acompaña de verdad al estudiante (y con qué recursos y escolaridad) permite que los compromisos del Anexo 3 sean realistas y no de papel.',
          },
        },
        {
          tipo: 'campos',
          titulo: '4) Entorno Educativo',
          campos: [
            '¿Estuvo vinculado a otra institución o modalidad? ¿Cuáles?',
            'Último grado cursado · ¿Aprobó? · Motivos del cambio',
            '¿Se recibe informe pedagógico cualitativo o PIAR previo? ¿De qué institución?',
            '¿Asiste a programas complementarios? (deportes, danzas, música, pintura…)',
            'Institución educativa y sede en la que se matricula',
            'Medio de transporte y distancia hogar–institución (tiempo)',
          ],
          explicacion: {
            titulo: 'No empezar de cero',
            texto:
              'Pedir el informe pedagógico o el PIAR anterior protege la continuidad del proceso. Y la pregunta por transporte y distancia reconoce que las barreras también son logísticas, no solo pedagógicas.',
          },
        },
        {
          tipo: 'firmas',
          titulo: 'Firmas',
          campos: ['Nombre y firma · Área (tres espacios)'],
        },
      ],
    },
    {
      rotulo: 'Anexo 2',
      titulo: 'Plan Individual de Ajustes Razonables',
      subtitulo: 'Valoración pedagógica y ajustes por trimestre',
      destacado: true,
      etiquetaDestacado: 'El corazón del PIAR',
      resumen:
        'Lo elaboran los docentes. Describe al estudiante desde sus fortalezas y define, área por área y trimestre por trimestre, los ajustes razonables y su evaluación.',
      bloques: [
        {
          tipo: 'campos',
          titulo: 'Encabezado y datos del estudiante',
          campos: [
            'Fecha de elaboración',
            'Institución educativa · Sede · Jornada',
            'Docentes que elaboran y cargo',
            'Nombre, documento, edad y grado del estudiante',
          ],
          explicacion: {
            titulo: 'Los autores son los docentes',
            texto:
              'El formato pide "docentes que elaboran y cargo": el PIAR no es un documento que orientación redacta sola; es una construcción pedagógica de quienes están en el aula.',
          },
        },
        {
          tipo: 'campos',
          titulo: '1. Características del estudiante',
          campos: [
            'Descripción general con énfasis en gustos e intereses, y expectativas del estudiante y su familia',
            'Descripción en términos de lo que hace, puede hacer o en qué requiere apoyo',
            'Habilidades, competencias y aprendizajes con los que cuenta para el grado matriculado',
          ],
          explicacion: {
            titulo: 'Fortalezas primero',
            texto:
              'El formato ordena empezar por gustos, intereses y lo que el estudiante puede hacer. La valoración pedagógica parte de capacidades, no de un listado de déficits.',
          },
        },
        {
          tipo: 'tabla-ajustes',
          titulo: '2. Ajustes razonables — una tabla por trimestre',
          columnas: [
            'Áreas / aprendizajes',
            'Objetivos / propósitos del grado (EBC y DBA)',
            'Barreras que se evidencian en el contexto',
            'Ajustes razonables (apoyos / estrategias)',
            'Evaluación de los ajustes',
          ],
          filas: ['Matemáticas', 'Ciencias', 'Lenguaje', 'Otras: convivencia · socialización · participación · autonomía · autocontrol'],
          notas: [
            'La tabla se diligencia para el primer, el segundo y el tercer trimestre.',
            'La evaluación exige seguimiento mínimo 3 veces al año, según la periodicidad del SIEE.',
            'En educación inicial y preescolar, los propósitos siguen las bases curriculares y los DBA de transición.',
          ],
          explicaciones: [
            {
              titulo: 'La meta no se rebaja',
              texto:
                'Los objetivos son los de todo el grado, definidos por los Estándares Básicos de Competencias (EBC) y los Derechos Básicos de Aprendizaje (DBA). Lo que se ajusta es el camino — apoyos y estrategias —, no el punto de llegada.',
            },
            {
              titulo: 'Las barreras están en el contexto',
              texto:
                'La columna dice "barreras que se evidencian en el contexto": el formato mismo obliga a buscar el obstáculo en el entorno (metodologías, materiales, actitudes), no en el estudiante.',
            },
            {
              titulo: 'Amarrado a la evaluación institucional',
              texto:
                'El seguimiento de los ajustes se hace mínimo tres veces al año y se alinea con el SIEE: el PIAR no corre por fuera del sistema de evaluación del colegio, corre dentro de él.',
            },
          ],
        },
        {
          tipo: 'campos',
          titulo: '7) Recomendaciones para el Plan de Mejoramiento Institucional',
          campos: [
            'Familia, cuidadores o con quienes vive — acciones y estrategias',
            'Docentes — acciones y estrategias',
            'Directivos — acciones y estrategias',
            'Administrativos — acciones y estrategias',
            'Pares (sus compañeros) — acciones y estrategias',
          ],
          explicacion: {
            titulo: 'De lo individual a lo institucional',
            texto:
              'Cada PIAR deja recomendaciones al Plan de Mejoramiento Institucional: lo aprendido con un estudiante transforma la escuela entera. Y la fila de "pares" reconoce que los compañeros también construyen (o derriban) barreras.',
          },
        },
        {
          tipo: 'firmas',
          titulo: 'Firmas de quienes realizan la valoración',
          campos: ['Docentes, coordinadores, docente de apoyo u otro profesional · cada docente valora su área'],
        },
      ],
    },
    {
      rotulo: 'Anexo 3',
      titulo: 'Acta de Acuerdo',
      subtitulo: 'Compromisos de institución, familia y estudiante',
      resumen:
        'Convierte la valoración y los ajustes en un pacto firmado. Define qué garantiza el colegio, qué asume la familia (con actividades concretas en casa) y qué se compromete el propio estudiante.',
      bloques: [
        {
          tipo: 'campos',
          titulo: 'Encabezado',
          campos: [
            'Fecha · Institución educativa y sede',
            'Nombre, documento, edad y grado del estudiante',
            'Nombres del equipo directivo y de docentes',
            'Nombres de la familia del estudiante y parentesco',
          ],
        },
        {
          tipo: 'texto',
          titulo: 'Marco del acuerdo',
          parrafo:
            'El acta abre recordando la definición de educación inclusiva del Decreto 1421 de 2017 — un proceso permanente que reconoce y responde a la diversidad de los estudiantes en un ambiente común, sin discriminación — y subraya que la inclusión solo es posible cuando se unen colegio, estudiante y familia. Por eso el acuerdo se formaliza con firmas.',
          explicacion: {
            titulo: 'De documento técnico a pacto',
            texto:
              'Este anexo cambia el género del documento: ya no describe ni planifica — compromete. Lo que era valoración pedagógica se vuelve palabra firmada entre las partes.',
          },
        },
        {
          tipo: 'campos',
          titulo: 'Compromisos',
          campos: [
            'El establecimiento educativo: la valoración realizada y los ajustes razonables definidos',
            'La familia: cumplir y firmar los compromisos señalados en el PIAR y en las actas',
            'Compromisos específicos de aula que requieran ampliación o detalle adicional',
          ],
        },
        {
          tipo: 'tabla-casa',
          titulo: 'Actividades de apoyo en casa',
          columnas: ['Nombre de la actividad', 'Descripción de la estrategia', 'Frecuencia: D diaria · S semanal · P permanente'],
          explicacion: {
            titulo: 'Compromisos verificables',
            texto:
              'La tabla obliga a pasar de "la familia apoyará" a actividades con nombre, estrategia y frecuencia marcada (diaria, semanal o permanente). Un compromiso con frecuencia se puede verificar en el siguiente seguimiento.',
          },
        },
        {
          tipo: 'firmas',
          titulo: 'Firma de los actores comprometidos',
          campos: ['Estudiante', 'Acudiente / familia', 'Docentes', 'Directivo docente'],
          explicacion: {
            titulo: 'La firma que más importa',
            texto:
              'El primer espacio de firma es del estudiante. El formato lo trata como protagonista de su proceso, no como beneficiario pasivo de decisiones ajenas.',
          },
        },
      ],
    },
  ],
};

// (Estructura anterior conservada para la vista de anatomía resumida)
export const ANATOMIA_PIAR = {
  intro:
    'El PIAR es un solo expediente que se construye por partes. Cada anexo responde una pregunta distinta: ¿quién es el estudiante?, ¿qué ajustes necesita en el aula?, ¿qué se compromete a hacer cada actor? Este es el recorrido por el documento completo.',
  anexos: [
    {
      numero: '1',
      titulo: 'Información general del estudiante',
      pregunta: '¿Quién es el estudiante y cuál es su contexto?',
      proposito:
        'Reúne el contexto integral del estudiante para comprender su situación antes de tomar cualquier decisión pedagógica. Sin esta base, los ajustes serían suposiciones.',
      quien: 'Docente de aula, con orientación escolar y la familia',
      cuando: 'En la matrícula o al inicio del año escolar',
      secciones: [
        {
          nombre: 'Identificación y datos de matrícula',
          para: 'Ubica al estudiante en la institución: grado, jornada, sede y datos de contacto de sus cuidadores.',
        },
        {
          nombre: 'Entorno familiar y social',
          para: 'Describe con quién vive y quién acompaña el proceso educativo en casa: la red de apoyo real del estudiante.',
        },
        {
          nombre: 'Salud y atención',
          para: 'Registra diagnósticos, terapias y atenciones en salud que inciden en el aprendizaje, para articular escuela y sector salud.',
        },
        {
          nombre: 'Trayectoria educativa',
          para: 'Recoge la historia escolar previa: instituciones, apoyos recibidos y experiencias, para no empezar de cero cada año.',
        },
      ],
    },
    {
      numero: '2',
      titulo: 'Valoración pedagógica y ajustes razonables',
      pregunta: '¿Qué necesita el estudiante para aprender y participar?',
      destacado: true,
      etiquetaDestacado: 'El corazón del PIAR',
      proposito:
        'Traduce la comprensión del estudiante en decisiones pedagógicas concretas, área por área. Aquí es donde el documento se convierte en práctica de aula.',
      quien: 'Docentes de cada área, con acompañamiento de orientación',
      cuando: 'Durante el primer trimestre; se revisa en cada período académico',
      secciones: [
        {
          nombre: 'Características, gustos e intereses',
          para: 'Parte de las fortalezas del estudiante, no del déficit: qué lo motiva y en qué se destaca es la palanca de los ajustes.',
        },
        {
          nombre: 'Barreras para el aprendizaje y la participación',
          para: 'Identifica los obstáculos del entorno (no del estudiante) que limitan su acceso, participación o progreso.',
        },
        {
          nombre: 'Ajustes razonables por área',
          para: 'Define objetivos, metodologías, materiales y formas de evaluación ajustadas en cada asignatura: el compromiso pedagógico concreto.',
        },
        {
          nombre: 'Apoyos y estrategias DUA',
          para: 'Aplica el Diseño Universal para el Aprendizaje: múltiples formas de presentar la información, de expresar lo aprendido y de motivar.',
        },
        {
          nombre: 'Seguimiento de los ajustes',
          para: 'Establece criterios y fechas para verificar si los ajustes están funcionando y corregir el rumbo a tiempo.',
        },
      ],
    },
    {
      numero: '3',
      titulo: 'Acta de acuerdo',
      pregunta: '¿Qué se compromete a hacer cada actor?',
      proposito:
        'Formaliza la corresponsabilidad. La inclusión no depende de un solo docente: el acta deja por escrito qué aporta la institución, qué aporta la familia y qué asume el propio estudiante.',
      quien: 'Directivos, docentes, orientación, familia y estudiante',
      cuando: 'Al consolidar el PIAR y en cada revisión o cierre de año',
      secciones: [
        {
          nombre: 'Participantes de la reunión',
          para: 'Deja constancia de quiénes construyeron los acuerdos: legitimidad del proceso.',
        },
        {
          nombre: 'Compromisos de la institución',
          para: 'Qué ajustes, apoyos y recursos garantiza el colegio, con responsables definidos.',
        },
        {
          nombre: 'Compromisos de la familia',
          para: 'Cómo acompaña el hogar el proceso: rutinas, terapias, comunicación con la escuela.',
        },
        {
          nombre: 'Compromisos del estudiante',
          para: 'Reconoce al estudiante como protagonista de su proceso, con acuerdos a su medida.',
        },
        {
          nombre: 'Firmas y fecha de seguimiento',
          para: 'Convierte el acta en un acuerdo verificable: quién firma y cuándo se vuelve a revisar.',
        },
      ],
    },
  ],
  cierre:
    'El PIAR no es un archivo que se diligencia una vez y se guarda: es un documento vivo. Se revisa en cada período, se ajusta cuando los apoyos no funcionan y cierra el año con un balance que se convierte en el punto de partida del año siguiente.',
};

// ----- Pestaña "Línea de tiempo": hitos globales y colombianos -----
// lado: 'global' | 'colombia'
// conexion: id del hito con el que dialoga (dibuja el vínculo visual)
export const HITOS = [
  {
    id: 'constitucion-1991',
    lado: 'colombia',
    anio: '1991',
    titulo: 'Constitución Política de Colombia',
    entidad: 'Asamblea Nacional Constituyente',
    texto:
      'El artículo 67 consagra la educación como un derecho de la persona y un servicio público con función social. Es el fundamento constitucional de todo el marco de inclusión educativa.',
  },
  {
    id: 'salamanca-1994',
    lado: 'global',
    anio: '1994',
    titulo: 'Declaración de Salamanca',
    entidad: 'UNESCO',
    texto:
      'Adoptada en la Conferencia Mundial sobre Necesidades Educativas Especiales (Salamanca, España, 7–10 de junio de 1994), con representantes de 92 gobiernos y 25 organizaciones internacionales. Estableció el principio fundamental de la inclusión: todos los niños deben aprender juntos siempre que sea posible, y la escuela debe adaptarse a la diversidad de sus estudiantes. Es considerada el impulso fundacional de la educación inclusiva a nivel mundial.',
    destacado: false,
  },
  {
    id: 'ley115-1994',
    lado: 'colombia',
    anio: '1994',
    titulo: 'Ley 115 — Ley General de Educación',
    entidad: 'Congreso de Colombia',
    texto:
      'Organiza el servicio público educativo y establece la atención educativa a las personas con limitaciones o capacidades excepcionales como parte integrante del servicio.',
  },
  {
    id: 'cdpd-2006',
    lado: 'global',
    anio: '2006',
    titulo: 'Convención sobre los Derechos de las Personas con Discapacidad',
    entidad: 'ONU',
    texto:
      'Tratado internacional que consagra el derecho a la educación inclusiva (artículo 24). Introduce conceptos clave como los ajustes razonables y el diseño universal.',
    conexion: 'ley1346-2009',
    etiquetaConexion: 'Colombia la incorpora con la Ley 1346 de 2009',
  },
  {
    id: 'ley1346-2009',
    lado: 'colombia',
    anio: '2009',
    titulo: 'Ley 1346',
    entidad: 'Congreso de Colombia',
    texto:
      'Incorpora al derecho interno colombiano la Convención sobre los Derechos de las Personas con Discapacidad de la ONU (2006), incluido su artículo 24 sobre educación inclusiva.',
  },
  {
    id: 'ley1618-2013',
    lado: 'colombia',
    anio: '2013',
    titulo: 'Ley Estatutaria 1618',
    entidad: 'Congreso de Colombia',
    texto:
      'Garantiza el pleno ejercicio de los derechos de las personas con discapacidad mediante medidas de inclusión, acciones afirmativas y ajustes razonables.',
  },
  {
    id: 'ods-2015',
    lado: 'global',
    anio: '2015',
    titulo: 'Agenda 2030: ODS 4 y ODS 10',
    entidad: 'ONU',
    texto:
      'El ODS 4 (Educación de calidad) busca garantizar una educación inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje permanente para todos. El ODS 10 (Reducción de las desigualdades) busca reducir la desigualdad, incluida la potenciación y promoción de la inclusión social de todas las personas independientemente de su condición. La educación inclusiva es una vía directa para cumplir ambos objetivos.',
  },
  {
    id: 'decreto1421-2017',
    lado: 'colombia',
    anio: '2017',
    titulo: 'Decreto 1421 — nace el PIAR',
    entidad: 'Ministerio de Educación Nacional',
    texto:
      'Reglamenta la atención educativa a la población con discapacidad en el marco de la educación inclusiva. Define el PIAR, sus anexos, los ajustes razonables y las responsabilidades de cada actor. Es la norma que estructura este aplicativo.',
    destacado: true,
  },
  {
    id: 'cali-2019',
    lado: 'global',
    anio: '2019',
    titulo: 'Compromiso de Cali',
    entidad: 'UNESCO · Ministerio de Educación de Colombia · Cali',
    texto:
      'El Foro Internacional sobre Inclusión y Equidad en la Educación se celebró en Cali, Colombia, del 11 al 13 de septiembre de 2019, bajo el lema "Todas y todos los estudiantes cuentan". Conmemoró los 25 años de la Declaración de Salamanca y culminó con el Compromiso de Cali, documento que fija prioridades para cumplir el ODS 4 hacia 2030.',
    destacado: true,
    insignia: 'Ocurrió en Cali, Colombia',
    conexion: 'salamanca-1994',
    etiquetaConexion: '25 años después de Salamanca',
  },
  {
    id: 'foro-mundial-2019',
    lado: 'global',
    anio: '2019–hoy',
    titulo: 'Foro Mundial de Escuelas Inclusivas',
    entidad: 'UNESCO e IFIP',
    texto:
      'Encuentro anual organizado por la UNESCO junto con el International Forums of Inclusion Practitioners (IFIP), que reúne a profesionales de todo el mundo para intercambiar prácticas innovadoras en educación inclusiva y fortalecer sinergias entre escuelas y comunidades a escala local, regional y global.',
  },
];

// Franja narrativa del hilo histórico global ↔ Colombia
export const HILO_NARRATIVO = {
  titulo: 'El hilo que une el mundo con Colombia',
  pasos: [
    { anio: '1994', texto: 'La Declaración de Salamanca sienta el principio: todos los niños aprenden juntos.' },
    { anio: '2019', texto: 'Su 25.º aniversario se conmemora precisamente en Cali, Colombia, de donde surge el Compromiso de Cali.' },
    { anio: 'Desde entonces', texto: 'Cada año, el Foro Mundial de Escuelas Inclusivas mantiene viva esa conversación global.' },
  ],
};
