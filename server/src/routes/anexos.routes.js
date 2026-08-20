// Rutas del módulo Asistente de anexos
import { Router } from 'express';
import {
  listarEstudiantesConPiar,
  obtenerEstudiante,
  guardarBorrador,
  obtenerAnexoCompleto,
} from '../services/anexos.service.js';
import {
  recomendarAnexo,
  generarBorradorAnexo,
  NOMBRES_ANEXO,
  CLAVE_POR_NOMBRE,
} from '../services/anthropic.service.js';
import { generarDocxAnexo } from '../services/docx.service.js';

const router = Router();

// Estudiantes disponibles para el selector del generador
router.get('/estudiantes', (req, res) => {
  res.json(listarEstudiantesConPiar());
});

// Asesor: recomienda qué anexo diligenciar según la situación descrita
router.post('/recomendar', async (req, res, next) => {
  try {
    const { contexto } = req.body;
    if (!contexto || !contexto.trim()) {
      return res.status(400).json({ error: 'Describe brevemente la situación del estudiante.' });
    }
    const recomendacion = await recomendarAnexo(contexto.trim());
    res.json(recomendacion);
  } catch (error) {
    next(error);
  }
});

// Genera el borrador del anexo con IA (formulario guiado o texto libre)
router.post('/generar', async (req, res, next) => {
  try {
    const { estudianteId, tipoAnexo, datos } = req.body;
    if (!estudianteId || !tipoAnexo || !datos || !datos.trim()) {
      return res.status(400).json({ error: 'Faltan datos: estudiante, tipo de anexo o información del docente.' });
    }
    const estudiante = obtenerEstudiante(estudianteId);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }
    const borrador = await generarBorradorAnexo({ estudiante, tipoAnexo, datos: datos.trim() });
    res.json({ borrador, piarId: estudiante.piar_id });
  } catch (error) {
    next(error);
  }
});

// Guarda el borrador (editado por el docente) en la tabla anexos
router.put('/:piarId/guardar', (req, res, next) => {
  try {
    const { tipoAnexo, contenido } = req.body;
    if (!tipoAnexo || !contenido || !contenido.trim()) {
      return res.status(400).json({ error: 'Faltan el tipo de anexo o el contenido.' });
    }
    const nombreFormal = NOMBRES_ANEXO[tipoAnexo] || tipoAnexo;
    const anexoId = guardarBorrador(Number(req.params.piarId), nombreFormal, contenido);
    res.json({ anexoId });
  } catch (error) {
    next(error);
  }
});

// Exporta el anexo guardado como archivo Word descargable
router.get('/:anexoId/exportar', async (req, res, next) => {
  try {
    const anexo = obtenerAnexoCompleto(Number(req.params.anexoId));
    if (!anexo || !anexo.contenido) {
      return res.status(404).json({ error: 'Anexo no encontrado o sin contenido.' });
    }
    const buffer = await generarDocxAnexo({
      // La clave del tipo determina qué diseño oficial usar (null → genérico)
      tipoClave: CLAVE_POR_NOMBRE[anexo.tipo] ?? null,
      tituloAnexo: anexo.tipo,
      estudiante: anexo.estudiante,
      grado: anexo.grado,
      tipoBarrera: anexo.tipo_barrera,
      contenido: anexo.contenido,
    });

    // Nombre de archivo seguro para la cabecera HTTP: sin tildes ni caracteres especiales
    const nombreArchivo = `${anexo.tipo}_${anexo.estudiante}`
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '_') + '.docx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

export default router;
