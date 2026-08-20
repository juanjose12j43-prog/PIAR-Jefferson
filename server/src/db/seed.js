// Sembrado de datos ficticios para que la demo se vea viva.
//
// Se usa de dos formas:
//  - CLI local:            npm run seed   (desde /server)
//  - Automático en Render: index.js llama a sembrarDatos() al arrancar si la
//    tabla `estudiantes` está vacía. Render (plan free) no da acceso a shell,
//    así que no hay forma de correr `npm run seed` a mano tras el deploy.
import { db } from './connection.js';

export function sembrarDatos() {
  // Limpieza de tablas (orden inverso por llaves foráneas)
  db.exec(`
    DELETE FROM seguimientos;
    DELETE FROM anexos;
    DELETE FROM piar;
    DELETE FROM estudiantes;
    DELETE FROM usuarios;
  `);

  const hoy = new Date();

  // Suma/resta días a la fecha de referencia y devuelve "YYYY-MM-DD"
  function fecha(diasOffset) {
    const d = new Date(hoy);
    d.setDate(d.getDate() + diasOffset);
    return d.toISOString().slice(0, 10);
  }

  // --- Usuarios ---
  const insertUsuario = db.prepare(
    `INSERT INTO usuarios (nombre, email, rol) VALUES (?, ?, ?)`
  );
  const orientacion = insertUsuario.run('Equipo de Orientación', 'orientacion@institucion.edu.co', 'orientacion').lastInsertRowid;
  const docentes = [
    insertUsuario.run('Docente titular — Básica primaria', 'docente.primaria@institucion.edu.co', 'docente').lastInsertRowid,
    insertUsuario.run('Docente titular — Básica secundaria', 'docente.secundaria@institucion.edu.co', 'docente').lastInsertRowid,
    insertUsuario.run('Docente titular — Media', 'docente.media@institucion.edu.co', 'docente').lastInsertRowid,
  ];

  // --- Estudiantes ---
  // Salvaguarda de datos (Ley 1581 de 2012 — habeas data): los estudiantes se
  // identifican con códigos anonimizados (EST-AAAA-NNN), nunca con nombres propios.
  // Todos los registros son ficticios, generados para la demostración.
  // grado en nomenclatura nacional colombiana (1-11)
  const estudiantesData = [
    { nombre: 'EST-2026-001', grado: '1', tipo_barrera: 'Discapacidad cognitiva', docente: docentes[0] },
    { nombre: 'EST-2026-002', grado: '2', tipo_barrera: 'TEA', docente: docentes[0] },
    { nombre: 'EST-2026-003', grado: '3', tipo_barrera: 'Dificultad de aprendizaje específica', docente: docentes[1] },
    { nombre: 'EST-2026-004', grado: '3', tipo_barrera: 'Discapacidad auditiva', docente: docentes[1] },
    { nombre: 'EST-2026-005', grado: '4', tipo_barrera: 'TEA', docente: docentes[0] },
    { nombre: 'EST-2026-006', grado: '5', tipo_barrera: 'Discapacidad visual', docente: docentes[2] },
    { nombre: 'EST-2026-007', grado: '6', tipo_barrera: 'Discapacidad cognitiva', docente: docentes[1] },
    { nombre: 'EST-2026-008', grado: '7', tipo_barrera: 'TDAH', docente: docentes[2] },
    { nombre: 'EST-2026-009', grado: '8', tipo_barrera: 'Dificultad de aprendizaje específica', docente: docentes[0] },
    { nombre: 'EST-2026-010', grado: '9', tipo_barrera: 'TEA', docente: docentes[2] },
    { nombre: 'EST-2026-011', grado: '10', tipo_barrera: 'Discapacidad auditiva', docente: docentes[1] },
    { nombre: 'EST-2026-012', grado: '11', tipo_barrera: 'Discapacidad física', docente: docentes[2] },
  ];

  const insertEstudiante = db.prepare(
    `INSERT INTO estudiantes (nombre, grado, tipo_barrera, docente_id) VALUES (?, ?, ?, ?)`
  );

  const insertPiar = db.prepare(
    `INSERT INTO piar (estudiante_id, estado, fecha_creacion, fecha_ultima_revision, fecha_proxima_revision, responsable_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  const insertAnexo = db.prepare(
    `INSERT INTO anexos (piar_id, tipo, estado, fecha_vencimiento, contenido) VALUES (?, ?, ?, ?, ?)`
  );

  const insertSeguimiento = db.prepare(
    `INSERT INTO seguimientos (piar_id, fecha_programada, fecha_realizada, estado, observaciones) VALUES (?, ?, ?, ?, ?)`
  );

  const tiposAnexo = [
    'Anexo 1 - Caracterización',
    'Anexo 2 - Valoración pedagógica',
    'Anexo 3 - Ajustes razonables',
  ];

  // Distribución de escenarios para que el tablero muestre variedad:
  // - PIAR vencidos (próxima revisión ya pasó)
  // - PIAR próximos a vencer (dentro de 15 días)
  // - PIAR al día (revisión lejana)
  const escenarios = [
    { proximaRevision: -10, estadoPiar: 'activo', seguimiento: 'atrasado' },       // vencido hace 10 días
    { proximaRevision: -3, estadoPiar: 'en_revision', seguimiento: 'atrasado' },   // vencido hace 3 días
    { proximaRevision: 5, estadoPiar: 'activo', seguimiento: 'al_dia' },          // vence en 5 días
    { proximaRevision: 12, estadoPiar: 'activo', seguimiento: 'al_dia' },         // vence en 12 días
    { proximaRevision: 45, estadoPiar: 'activo', seguimiento: 'al_dia' },
    { proximaRevision: 60, estadoPiar: 'activo', seguimiento: 'realizado' },
    { proximaRevision: -1, estadoPiar: 'activo', seguimiento: 'atrasado' },       // vencido ayer
    { proximaRevision: 90, estadoPiar: 'activo', seguimiento: 'al_dia' },
    { proximaRevision: 8, estadoPiar: 'activo', seguimiento: 'al_dia' },          // vence en 8 días
    { proximaRevision: 30, estadoPiar: 'en_revision', seguimiento: 'al_dia' },
    { proximaRevision: -20, estadoPiar: 'activo', seguimiento: 'atrasado' },      // vencido hace 20 días
    { proximaRevision: 120, estadoPiar: 'cerrado', seguimiento: 'realizado' },
  ];

  estudiantesData.forEach((est, i) => {
    const estudianteId = insertEstudiante.run(est.nombre, est.grado, est.tipo_barrera, est.docente).lastInsertRowid;
    const esc = escenarios[i];

    const piarId = insertPiar.run(
      estudianteId,
      esc.estadoPiar,
      fecha(-200 - i * 5),
      fecha(-30 - i * 3),
      fecha(esc.proximaRevision),
      orientacion
    ).lastInsertRowid;

    // Cada estudiante tiene 2-3 anexos con estados y vencimientos variados
    const numAnexos = 2 + (i % 2);
    for (let a = 0; a < numAnexos; a++) {
      const tipo = tiposAnexo[a % tiposAnexo.length];
      const estados = ['completado', 'borrador', 'pendiente'];
      const estadoAnexo = estados[(i + a) % estados.length];
      // Algunos anexos vencen pronto o ya vencieron para alimentar el panel de alertas
      const vencimientoOffset = (i * 7 + a * 11) % 40 - 15; // rango aprox [-15, 25]
      insertAnexo.run(
        piarId,
        tipo,
        estadoAnexo,
        estadoAnexo === 'completado' ? null : fecha(vencimientoOffset),
        estadoAnexo === 'completado' ? `Contenido de ejemplo para ${tipo} de ${est.nombre}.` : null
      );
    }

    insertSeguimiento.run(
      piarId,
      fecha(esc.proximaRevision - 30),
      esc.seguimiento === 'realizado' ? fecha(esc.proximaRevision - 32) : null,
      esc.seguimiento,
      esc.seguimiento === 'atrasado' ? 'Seguimiento pendiente por realizar.' : 'Seguimiento registrado en la fecha prevista.'
    );
  });

  console.log(`Seed completado: ${estudiantesData.length} estudiantes, ${docentes.length} docentes y datos de PIAR/anexos/seguimientos generados.`);
}

// Permite seguir usando "npm run seed" desde la línea de comandos.
// import.meta.url === process.argv[1] (convertido a file URL) solo es cierto
// cuando este archivo se ejecuta directamente, no cuando otro módulo lo importa.
if (import.meta.url === `file://${process.argv[1]}`) {
  sembrarDatos();
}
