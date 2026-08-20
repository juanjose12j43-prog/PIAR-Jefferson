-- Esquema de base de datos del prototipo PIAR
-- SQLite (better-sqlite3)

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('orientacion', 'docente')),
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

-- grado: "1" a "11" (sistema nacional colombiano).
-- Nota: en instituciones con bachillerato internacional (hasta grado 12),
-- el grado IB "N" equivale al grado nacional "N-1" (ej. IB 6 = nacional 5°).
-- Para el prototipo se usa siempre la nomenclatura nacional (1-11).
CREATE TABLE IF NOT EXISTS estudiantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  grado TEXT NOT NULL,
  tipo_barrera TEXT NOT NULL,
  docente_id INTEGER REFERENCES usuarios(id),
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS piar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id),
  estado TEXT NOT NULL CHECK (estado IN ('activo', 'en_revision', 'cerrado')),
  fecha_creacion TEXT NOT NULL,
  fecha_ultima_revision TEXT,
  fecha_proxima_revision TEXT NOT NULL,
  responsable_id INTEGER REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS anexos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  piar_id INTEGER NOT NULL REFERENCES piar(id),
  tipo TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'borrador', 'completado')),
  fecha_vencimiento TEXT,
  contenido TEXT,
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seguimientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  piar_id INTEGER NOT NULL REFERENCES piar(id),
  fecha_programada TEXT NOT NULL,
  fecha_realizada TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('al_dia', 'atrasado', 'realizado')),
  observaciones TEXT
);

CREATE INDEX IF NOT EXISTS idx_piar_estudiante ON piar(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_anexos_piar ON anexos(piar_id);
CREATE INDEX IF NOT EXISTS idx_seguimientos_piar ON seguimientos(piar_id);
