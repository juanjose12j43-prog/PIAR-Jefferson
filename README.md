# Aplicativo de gestión del PIAR

Prototipo de demostración para la gestión institucional de la inclusión educativa, alineado al
Decreto 1421 de 2017 y la Ley Estatutaria 1618 de 2013. Esta fase entrega el andamiaje completo del
proyecto y el **Tablero institucional de inclusión** como primera pantalla funcional.

## Estructura del proyecto

```
App PIAR/
├── client/     React + Vite (frontend)
└── server/     Node + Express + SQLite (backend)
```

- **client/**: interfaz de usuario (Sidebar, Tablero, gráficos con recharts).
- **server/**: API REST, base de datos SQLite (better-sqlite3) y la integración con Claude
  (Anthropic API) para el reporte ejecutivo.

## Requisitos previos

- Node.js 18 o superior
- Una API key de Anthropic (solo necesaria para el botón "Generar reporte ejecutivo")

## Instalación

### 1. Backend

```bash
cd server
npm install
```

Crea el archivo `.env` a partir de `.env.example` y coloca ahí tu API key (nunca la escribas
directamente en el código):

```bash
cp .env.example .env
```

Edita `.env`:

```
PORT=4000
ANTHROPIC_API_KEY=tu-api-key-aquí
```

Carga los datos ficticios de demostración (12 estudiantes con distintas barreras, PIAR en
distintos estados, seguimientos al día y atrasados):

```bash
npm run seed
```

Levanta el servidor:

```bash
npm run dev
```

El backend queda disponible en `http://localhost:4000`.

### 2. Frontend

En otra terminal:

```bash
cd client
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173` (Vite hace proxy de `/api` hacia el
backend en el puerto 4000).

Abre `http://localhost:5173` en el navegador para ver el Tablero institucional.

## Funcionalidad — Fase 3: Centro de conocimiento

- **Conceptos clave**: tarjetas curadas sobre el PIAR, sus anexos, la diferencia entre diversidad
  e inclusión, el DUA y los actores del proceso, cada una con su fuente normativa. Los textos
  viven en `client/src/pages/CentroConocimiento/contenido.js` para editarlos sin tocar componentes.
- **Línea de tiempo normativa**: línea de tiempo dual con espina cronológica central que muestra
  el diálogo entre el **marco global** (Declaración de Salamanca 1994, CDPD de la ONU 2006,
  ODS 4 y 10 de la Agenda 2030, Compromiso de Cali 2019, Foro Mundial de Escuelas Inclusivas) y
  el **marco colombiano** (Constitución de 1991, Ley 115 de 1994, Ley 1346 de 2009, Ley 1618 de
  2013, Decreto 1421 de 2017). Incluye la sección "Referentes internacionales de la educación
  inclusiva" con conectores visuales (CDPD → Ley 1346; Salamanca → Compromiso de Cali) y una
  franja narrativa con el hilo histórico que pasa por Cali, Colombia.
- **Wiki con IA**: chat conversacional multi-turno que responde preguntas sobre inclusión
  educativa citando el fundamento normativo, y conecta el marco colombiano con el internacional.
  Incluye preguntas sugeridas para arrancar la conversación.

## Funcionalidad — Fase 2: Asistente de anexos

- **Asesor "qué, cuándo y cómo"**: guía por momento del año escolar (nuevo ingreso / ya
  caracterizado / cierre de año) según el Decreto 1421 de 2017, más un recomendador con IA: el
  docente describe la situación y recibe el anexo pertinente con momento, participantes y
  justificación.
- **Generación guiada del anexo**: se selecciona un estudiante (del seed) y el tipo de anexo
  (caracterización, ajustes razonables o acta con familia), y se aporta la información por
  **descripción libre** en lenguaje natural o por **formulario guiado**. La IA redacta el borrador
  en lenguaje institucional formal (barreras para el aprendizaje y la participación, ajustes
  razonables, DUA), sin inventar datos: lo faltante queda como `[Por completar por el docente]`.
- **Editor de revisión**: el borrador se muestra en un editor tipo documento donde el docente lo
  ajusta y lo guarda en la tabla `anexos` (estado `borrador`).
- **Exportación a Word con el formato oficial**: el `.docx` descargado replica el formato oficial
  del PIAR (MEN, V14 del 16/02/2018, Decreto 1421 de 2017): membrete institucional con los logos
  de Mineducación y Gobierno de Colombia (extraídos del formato original en
  `server/src/assets/membrete-men.png`), títulos y secciones oficiales, tablas del formato (la de
  ajustes razonables por área con sus 5 columnas; la de actividades de apoyo en casa con
  frecuencia D/S/P), campos administrativos como "[Por completar]", espacios de firmas y el pie de
  página oficial del MEN. El contenido generado por la IA se ubica automáticamente en la sección
  del formato que corresponde.
- El dictado por voz quedó preparado conceptualmente (ver comentario en
  `client/src/pages/AsistenteAnexos/EntradaLibre.jsx`); se añadirá en la fase de pulido.

## Funcionalidad — Fase 1: Tablero institucional

- **Tablero institucional**: KPIs, distribución de PIAR por grado (barras), distribución por tipo
  de barrera (circular), % de seguimientos al día vs. atrasados, y panel de alertas de
  vencimientos próximos.
- **Generar reporte ejecutivo**: botón que envía los datos actuales del tablero a Claude
  (`claude-sonnet-5`) y redacta un informe institucional formal, apto para Secretaría de Educación
  o junta directiva. Requiere una API key válida en `.env`.
- **Navegación**: los tres módulos (Tablero, Centro de conocimiento y Asistente de anexos) están
  completos y enlazados en el sidebar.

## Notas sobre el esquema de datos

- `grado` usa la nomenclatura nacional colombiana (1° a 11°). En instituciones con bachillerato
  internacional (hasta 12°), el grado IB "N" equivale al grado nacional "N-1" (ej. IB 6° = nacional
  5°) — ver comentario en `server/src/db/schema.sql`.
- El seed (`server/src/db/seed.js`) distribuye intencionalmente PIAR vencidos, próximos a vencer y
  al día para que el tablero y las alertas se vean vivos desde el primer arranque.

## Salvaguarda de datos

Los estudiantes del seed son **registros ficticios** y se identifican con **códigos anonimizados**
(`EST-AAAA-NNN`), nunca con nombres propios, en coherencia con la protección de datos personales
de menores (Ley 1581 de 2012 — habeas data). Los prompts de IA instruyen explícitamente a no
inventar nombres y referirse siempre al estudiante por su código. Los documentos Word exportados
usan la etiqueta "Código del estudiante".

## Próximas fases

1. Fase de pulido: dictado por voz en el Asistente de anexos, mejoras de diseño.
2. Autenticación real de roles (orientación vs. docente).
