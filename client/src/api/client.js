// Cliente HTTP simple hacia el backend.
//
// En desarrollo, Vite hace proxy de /api hacia el Express local (localhost:4000)
// y BASE_URL queda vacío, así que las rutas relativas funcionan igual que antes.
//
// En producción, el frontend (Netlify) y el backend (Render) viven en dominios
// distintos, así que la URL completa del backend debe venir de la variable de
// entorno VITE_API_URL, definida en el build de Netlify (ver README de despliegue).
const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error en la solicitud a ${path}`);
  }
  return res.json();
}

export const api = {
  obtenerResumenDashboard: () => request('/dashboard/resumen'),
  generarReporteEjecutivo: () => request('/reporte/generar', { method: 'POST' }),

  // Asistente de anexos (Fase 2)
  listarEstudiantes: () => request('/anexos/estudiantes'),
  recomendarAnexo: (contexto) =>
    request('/anexos/recomendar', { method: 'POST', body: JSON.stringify({ contexto }) }),
  generarAnexo: (estudianteId, tipoAnexo, datos) =>
    request('/anexos/generar', {
      method: 'POST',
      body: JSON.stringify({ estudianteId, tipoAnexo, datos }),
    }),
  guardarAnexo: (piarId, tipoAnexo, contenido) =>
    request(`/anexos/${piarId}/guardar`, {
      method: 'PUT',
      body: JSON.stringify({ tipoAnexo, contenido }),
    }),
  // La exportación es una descarga directa, no una llamada JSON
  urlExportarAnexo: (anexoId) => `${BASE_URL}/api/anexos/${anexoId}/exportar`,

  // Wiki del Centro de conocimiento (Fase 3)
  preguntarWiki: (mensajes) =>
    request('/wiki/preguntar', { method: 'POST', body: JSON.stringify({ mensajes }) }),
};
