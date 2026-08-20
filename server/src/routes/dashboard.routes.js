// Rutas del tablero institucional: exponen las métricas agregadas
import { Router } from 'express';
import {
  obtenerKpis,
  obtenerDistribucionPorGrado,
  obtenerDistribucionPorBarrera,
  obtenerEstadoSeguimientos,
  obtenerAlertas,
  obtenerResumenCompleto,
} from '../services/dashboard.service.js';

const router = Router();

router.get('/kpis', (req, res) => {
  res.json(obtenerKpis());
});

router.get('/distribucion-grado', (req, res) => {
  res.json(obtenerDistribucionPorGrado());
});

router.get('/distribucion-barrera', (req, res) => {
  res.json(obtenerDistribucionPorBarrera());
});

router.get('/estado-seguimientos', (req, res) => {
  res.json(obtenerEstadoSeguimientos());
});

router.get('/alertas', (req, res) => {
  res.json(obtenerAlertas());
});

// Endpoint único que trae todo el resumen (usado por el dashboard al cargar)
router.get('/resumen', (req, res) => {
  res.json(obtenerResumenCompleto());
});

export default router;
