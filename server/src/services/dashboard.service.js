// Consultas de agregación que alimentan el tablero institucional
import { db } from '../db/connection.js';

const HOY = new Date().toISOString().slice(0, 10);
const EN_15_DIAS = new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10);

// KPIs generales para las tarjetas superiores
export function obtenerKpis() {
  const totalPiarActivos = db.prepare(
    `SELECT COUNT(*) AS total FROM piar WHERE estado IN ('activo', 'en_revision')`
  ).get().total;

  const totalEstudiantes = db.prepare(`SELECT COUNT(*) AS total FROM estudiantes`).get().total;

  const anexosPendientes = db.prepare(
    `SELECT COUNT(*) AS total FROM anexos WHERE estado IN ('pendiente', 'borrador')`
  ).get().total;

  const alertasVencimiento = db.prepare(
    `SELECT COUNT(*) AS total FROM piar WHERE estado != 'cerrado' AND fecha_proxima_revision <= ?`
  ).get(EN_15_DIAS).total;

  return { totalPiarActivos, totalEstudiantes, anexosPendientes, alertasVencimiento };
}

// Distribución de PIAR activos por grado (para gráfico de barras)
export function obtenerDistribucionPorGrado() {
  return db.prepare(`
    SELECT e.grado AS grado, COUNT(*) AS total
    FROM piar p
    JOIN estudiantes e ON e.id = p.estudiante_id
    WHERE p.estado != 'cerrado'
    GROUP BY e.grado
    ORDER BY CAST(e.grado AS INTEGER)
  `).all();
}

// Distribución por tipo de barrera/discapacidad (para gráfico circular)
export function obtenerDistribucionPorBarrera() {
  return db.prepare(`
    SELECT e.tipo_barrera AS tipo, COUNT(*) AS total
    FROM piar p
    JOIN estudiantes e ON e.id = p.estudiante_id
    WHERE p.estado != 'cerrado'
    GROUP BY e.tipo_barrera
    ORDER BY total DESC
  `).all();
}

// % de PIAR con seguimiento al día vs atrasado (según el seguimiento más reciente de cada PIAR)
export function obtenerEstadoSeguimientos() {
  const filas = db.prepare(`
    SELECT s.piar_id, s.estado
    FROM seguimientos s
    INNER JOIN (
      SELECT piar_id, MAX(id) AS max_id FROM seguimientos GROUP BY piar_id
    ) ultimo ON ultimo.max_id = s.id
  `).all();

  const total = filas.length;
  const alDia = filas.filter((f) => f.estado === 'al_dia' || f.estado === 'realizado').length;
  const atrasado = filas.filter((f) => f.estado === 'atrasado').length;

  return {
    total,
    alDia,
    atrasado,
    porcentajeAlDia: total ? Math.round((alDia / total) * 100) : 0,
    porcentajeAtrasado: total ? Math.round((atrasado / total) * 100) : 0,
  };
}

// Alertas: PIAR y anexos que vencen dentro de los próximos 15 días o ya vencieron
export function obtenerAlertas() {
  const piarVencimientos = db.prepare(`
    SELECT e.nombre AS estudiante, e.grado AS grado, p.fecha_proxima_revision AS fecha, p.estado AS estado_piar
    FROM piar p
    JOIN estudiantes e ON e.id = p.estudiante_id
    WHERE p.estado != 'cerrado' AND p.fecha_proxima_revision <= ?
    ORDER BY p.fecha_proxima_revision ASC
  `).all(EN_15_DIAS);

  const anexosVencimientos = db.prepare(`
    SELECT e.nombre AS estudiante, e.grado AS grado, a.tipo AS tipo_anexo, a.fecha_vencimiento AS fecha
    FROM anexos a
    JOIN piar p ON p.id = a.piar_id
    JOIN estudiantes e ON e.id = p.estudiante_id
    WHERE a.estado != 'completado' AND a.fecha_vencimiento IS NOT NULL AND a.fecha_vencimiento <= ?
    ORDER BY a.fecha_vencimiento ASC
  `).all(EN_15_DIAS);

  return {
    piar: piarVencimientos.map((p) => ({ ...p, vencido: p.fecha < HOY })),
    anexos: anexosVencimientos.map((a) => ({ ...a, vencido: a.fecha < HOY })),
  };
}

// Consolida todo lo anterior en un solo objeto (útil para el resumen del reporte ejecutivo)
export function obtenerResumenCompleto() {
  return {
    kpis: obtenerKpis(),
    distribucionPorGrado: obtenerDistribucionPorGrado(),
    distribucionPorBarrera: obtenerDistribucionPorBarrera(),
    estadoSeguimientos: obtenerEstadoSeguimientos(),
    alertas: obtenerAlertas(),
  };
}
