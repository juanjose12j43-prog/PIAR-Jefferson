// Set de iconos SVG del aplicativo (trazo 1.75, heredan el color del texto).
// Sustituyen a los emojis para mantener una estética institucional sobria.

function IconoBase({ children, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Barras de tablero (Tablero institucional)
export function IconoTablero(props) {
  return (
    <IconoBase {...props}>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="8" width="3" height="10" />
      <rect x="17" y="5" width="3" height="13" />
    </IconoBase>
  );
}

// Libro abierto (Centro de conocimiento)
export function IconoLibro(props) {
  return (
    <IconoBase {...props}>
      <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
    </IconoBase>
  );
}

// Documento con líneas (Asistente de anexos)
export function IconoDocumento(props) {
  return (
    <IconoBase {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </IconoBase>
  );
}

// Descarga (Exportar a Word)
export function IconoDescarga(props) {
  return (
    <IconoBase {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </IconoBase>
  );
}

// Flecha izquierda (Volver)
export function IconoVolver(props) {
  return (
    <IconoBase {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </IconoBase>
  );
}

// Lápiz (Descripción libre)
export function IconoLapiz(props) {
  return (
    <IconoBase {...props}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
    </IconoBase>
  );
}

// Lista de verificación (Formulario guiado)
export function IconoLista(props) {
  return (
    <IconoBase {...props}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </IconoBase>
  );
}

// Fuente normativa (referencia)
export function IconoFuente(props) {
  return (
    <IconoBase {...props}>
      <path d="M12 6.25c-2-1.5-4.5-2-8-2v13.5c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4.25c-3.5 0-6 .5-8 2z" />
      <path d="M12 6.25v13.5" />
    </IconoBase>
  );
}
