// Rutas de la wiki conversacional del Centro de conocimiento
import { Router } from 'express';
import { responderWiki } from '../services/anthropic.service.js';

const router = Router();

// Recibe el historial completo de la conversación y devuelve la respuesta de la IA
router.post('/preguntar', async (req, res, next) => {
  try {
    const { mensajes } = req.body;
    if (!Array.isArray(mensajes) || mensajes.length === 0) {
      return res.status(400).json({ error: 'La conversación está vacía.' });
    }
    // Solo se aceptan los campos esperados (rol y contenido de texto)
    const historial = mensajes
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content }));
    if (historial.length === 0 || historial[historial.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'El último mensaje debe ser una pregunta del usuario.' });
    }
    const respuesta = await responderWiki(historial);
    res.json({ respuesta });
  } catch (error) {
    next(error);
  }
});

export default router;
