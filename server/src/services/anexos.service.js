// Consultas de base de datos del módulo Asistente de anexos
import { db } from '../db/connection.js';

// Lista de estudiantes con su PIAR activo (para el selector del generador)
export function listarEstudiantesConPiar() {
  return db.prepare(`
    SELECT e.id, e.nombre, e.grado, e.tipo_barrera, p.id AS piar_id, p.estado AS estado_piar
    FROM estudiantes e
    JOIN piar p ON p.estudiante_id = e.id
    WHERE p.estado != 'cerrado'
    ORDER BY CAST(e.grado AS INTEGER), e.nombre
  `).all();
}

// Datos de un estudiante puntual (para armar el prompt y el DOCX)
export function obtenerEstudiante(estudianteId) {
  return db.prepare(`
    SELECT e.id, e.nombre, e.grado, e.tipo_barrera, p.id AS piar_id
    FROM estudiantes e
    JOIN piar p ON p.estudiante_id = e.id
    WHERE e.id = ?
  `).get(estudianteId);
}

// Guarda (o actualiza) el borrador de un anexo asociado al PIAR.
// Si ya existe un anexo del mismo tipo para ese PIAR, actualiza su contenido;
// si no, crea uno nuevo en estado 'borrador'.
export function guardarBorrador(piarId, tipoAnexo, contenido) {
  const existente = db.prepare(
    `SELECT id FROM anexos WHERE piar_id = ? AND tipo = ?`
  ).get(piarId, tipoAnexo);

  if (existente) {
    db.prepare(
      `UPDATE anexos SET contenido = ?, estado = 'borrador' WHERE id = ?`
    ).run(contenido, existente.id);
    return existente.id;
  }

  const resultado = db.prepare(
    `INSERT INTO anexos (piar_id, tipo, estado, contenido) VALUES (?, ?, 'borrador', ?)`
  ).run(piarId, tipoAnexo, contenido);
  return resultado.lastInsertRowid;
}

// Recupera un anexo con los datos del estudiante (para exportar a DOCX)
export function obtenerAnexoCompleto(anexoId) {
  return db.prepare(`
    SELECT a.id, a.tipo, a.contenido, a.estado,
           e.nombre AS estudiante, e.grado, e.tipo_barrera
    FROM anexos a
    JOIN piar p ON p.id = a.piar_id
    JOIN estudiantes e ON e.id = p.estudiante_id
    WHERE a.id = ?
  `).get(anexoId);
}
