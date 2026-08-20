# App PIAR — contexto del proyecto

Aplicativo de gestión del PIAR (Plan Individual de Ajustes Razonables) para el
**Colegio Jefferson** de Cali. Prototipo de demostración alineado al Decreto 1421
de 2017 y a la Ley Estatutaria 1618 de 2013.

> Este archivo existe para que cualquier sesión nueva entienda el proyecto sin
> reconstruirlo desde cero. Si cambias decisiones de fondo, actualízalo.

## Cómo se levanta

Dos terminales, desde la raíz del proyecto:

```bash
cd server && npm run dev     # API en http://localhost:4000
cd client && npm run dev     # interfaz en http://localhost:5173
```

`server/.env` necesita `ANTHROPIC_API_KEY` para el reporte ejecutivo, el
asistente de anexos y la wiki. `cd server && npm run seed` recarga los datos
ficticios de demostración.

## Arquitectura

```
client/   React 18 + Vite + react-router + recharts
server/   Node + Express + SQLite (better-sqlite3) + @anthropic-ai/sdk
```

- `server/src/routes/` → endpoints; `server/src/services/` → lógica y consultas.
- `server/src/services/anthropic.service.js` concentra los tres prompts (reporte
  ejecutivo, generación de anexos, wiki). El modelo está en la constante `MODEL`.
- `server/src/services/docx.service.js` replica el formato oficial del PIAR
  (MEN, V14, Decreto 1421), con el membrete en `server/src/assets/membrete-men.png`.
- La API key vive solo en el backend. El frontend nunca la ve.

## Funcionalidad construida

1. **Tablero institucional** — KPIs, distribución por grado y por tipo de
   barrera, estado de seguimientos, panel de alertas y reporte ejecutivo con IA.
2. **Asistente de anexos** — asesor "qué/cuándo/cómo" por momento del año
   escolar, generación guiada de anexos (caracterización, ajustes razonables,
   acta con familia) por texto libre o formulario, editor de revisión y
   exportación a Word con el formato oficial.
3. **Centro de conocimiento** — conceptos clave, facsímil anotado del formato
   PIAR, línea de tiempo normativa dual (marco global ↔ colombiano) y wiki
   conversacional con IA.

## Sistema de diseño — identidad Colegio Jefferson

La paleta se extrajo del escudo institucional
(`client/public/escudo-jefferson.png`) y vive en el bloque `:root` de
`client/src/styles/globals.css`. **No introduzcas hexadecimales sueltos en
componentes: usa las variables.**

| Rol | Token | Valor |
|---|---|---|
| Principal (marca, navegación, acciones) | `--color-primary` | `#B21E28` |
| Principal oscuro (sidebar, títulos) | `--color-primary-dark` | `#8E1820` |
| Secundario (informativo, marco global) | `--color-secundario` | `#16365C` |
| Al día | `--color-success-texto` | `#35691F` |
| Por vencer | `--color-warning-texto` | `#8A6410` |
| Vencido | `--color-danger` | `#6D1218` |
| Marcador de sección activa | `--color-sidebar-marcador` | `#E3A81B` |

Dos decisiones que conviene no deshacer sin pensarlo:

- **El rojo de marca y el rojo de alerta se distinguen por forma, no por tono.**
  El rojo de acción siempre es relleno sólido en un control (botón, pestaña,
  burbuja de chat). El estado crítico siempre es etiqueta con borde, símbolo ▲ y
  la palabra "vencido", en un rojo más profundo. Si esto se rompe, la señal de
  urgencia deja de leerse.
- **El anillo de foco va en azul**, no en rojo, para que se distinga del color de
  marca y siga siendo visible sobre superficies rojas.

### Accesibilidad

Es un requisito del proyecto, no un extra: una aplicación sobre inclusión que no
es accesible se contradice a sí misma. Lo implementado está al final de
`globals.css`, bajo "Capa de accesibilidad":

enlace de salto al contenido · foco visible por teclado (`:focus-visible`) ·
`.sr-only` · tabla equivalente oculta para cada gráfico (recharts no es legible
por lector de pantalla) · estados con símbolo además de color ·
`prefers-reduced-motion` · `prefers-contrast` · objetivos táctiles de 44px ·
responsive por debajo de 900px.

Las 18 combinaciones de texto/fondo de la paleta cumplen WCAG AA; ocho llegan a
AAA. Si cambias un color, recalcula el contraste antes de darlo por bueno.

## Salvaguarda de datos

Los estudiantes se identifican con **códigos anonimizados** (`EST-AAAA-NNN`),
nunca con nombres propios, en coherencia con la Ley 1581 de 2012 (habeas data) y
por tratarse de datos sensibles de menores. Los prompts instruyen explícitamente
a no inventar nombres. Todos los registros del seed son ficticios.

## Pendientes conocidos

De una revisión crítica del código, ordenados por lo que abordaría primero:

1. **Bug de fechas.** `HOY` y `EN_15_DIAS` en `server/src/services/dashboard.service.js`
   se calculan al importar el módulo. Un servidor levantado varios días muestra
   alertas congeladas en la fecha de arranque. Deben calcularse por petición.
2. **Un solo anexo de ajustes por PIAR.** `guardarBorrador` hace UPDATE si ya
   existe uno del mismo tipo, pero el formato oficial pide ajustes *por área*
   (matemáticas, lenguaje…). Hoy el segundo pisa al primero.
3. **`seguimientos.estado` guarda un valor derivable.** "Atrasado" debería
   calcularse comparando `fecha_programada` con hoy; almacenado se desincroniza.
4. **Modelo de datos incoherente con el propio discurso.** `estudiantes.tipo_barrera`
   guarda un diagnóstico clínico único ("TEA", "TDAH") adherido a la persona,
   justo el modelo médico que el Decreto 1421 busca desplazar. Debería separarse
   en `condicion` / `barreras` (varias, del contexto) / `apoyos`.
5. **`anexos.tipo` guarda el nombre largo** y se recupera con el mapa inverso
   `CLAVE_POR_NOMBRE`. Cambiar una tilde rompe la exportación: guardar la clave.
6. **Sin autenticación ni auditoría.** No hay roles reales (orientación vs.
   docente) ni registro de quién generó o editó cada documento. Para un documento
   con efectos legales es un vacío serio. La tabla `usuarios` existe y nadie la lee.
7. **Seguridad, bloqueante si sale del prototipo.** `cors()` abierto, sin
   rate-limit ni límite de longitud en los endpoints de IA, SQLite sin cifrar, y
   la wiki acepta el historial completo desde el cliente (se pueden falsificar
   turnos de `assistant`).
8. **Sin streaming en las respuestas de IA.** El usuario espera 20–40 segundos
   sin realimentación. El reporte ejecutivo además se pierde al recargar.
9. **El ciclo de gestión está incompleto.** Se generan documentos pero no hay
   forma de registrar un seguimiento desde la interfaz, aunque la tabla existe.
10. **Dictado por voz** en el Asistente de anexos (preparado conceptualmente en
    `client/src/pages/AsistenteAnexos/EntradaLibre.jsx`).

## Riesgo de fondo a tener presente

El PIAR es un instrumento que se construye **colaborativamente** — docente,
familia, estudiante, orientación. La aplicación permite que un docente escriba
tres frases y obtenga un documento formal y bien redactado que *parece* riguroso.
El riesgo no es que la IA se equivoque: es que sustituya la deliberación por
generación de texto y produzca cumplimiento de papel de mejor calidad estética.
Además, hoy la única fuente de información es el docente; la voz de la familia y
del estudiante no entra por ningún lado, y el Decreto la exige.

Mitigaciones pendientes: validación sección por sección antes de exportar, marcar
qué texto vino de IA y cuál escribió una persona, y campos obligatorios de
"aportes de la familia" y "voz del estudiante".

## Nota sobre el entorno

Los `node_modules` están compilados para macOS. Desde un sandbox Linux
`npm run build` falla con un error de `rollup`; no es un problema del código.
Para validar sintaxis sin construir:

```bash
cd client && node -e '
const {parse}=require("./node_modules/@babel/parser");
const fs=require("fs"),path=require("path");let n=0,e=0;
(function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);
 if(fs.statSync(p).isDirectory()){if(f!=="node_modules")w(p);continue;}
 if(!/\.jsx?$/.test(f))continue;n++;
 try{parse(fs.readFileSync(p,"utf8"),{sourceType:"module",plugins:["jsx"]});}
 catch(err){e++;console.log("FALLA",p,err.message);}}})("src");
console.log(`${n} archivos, ${e} errores`);'
```
