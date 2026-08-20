// Ruta para generar el informe ejecutivo institucional con IA
import { Router } from 'express';
import { obtenerResumenCompleto } from '../services/dashboard.service.js';
import { generarReporteEjecutivo } from '../services/anthropic.service.js';

const router = Router();

router.post('/generar', async (req, res, next) => {
  try {
    const resumen = obtenerResumenCompleto();
    const informe = await generarReporteEjecutivo(resumen);
    res.json({ informe });
  } catch (error) {
    next(error);
  }
});

export default router;
