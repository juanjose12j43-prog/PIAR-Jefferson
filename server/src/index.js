// Punto de entrada del servidor Express
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dashboardRoutes from './routes/dashboard.routes.js';
import reporteRoutes from './routes/reporte.routes.js';
import anexosRoutes from './routes/anexos.routes.js';
import wikiRoutes from './routes/wiki.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { db } from './db/connection.js';
import { sembrarDatos } from './db/seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

// En un despliegue como Render (plan free) no hay acceso a shell para correr
// "npm run seed" a mano tras el primer deploy. Si el servidor arranca con la
// base de datos vacía, se siembra sola con los datos ficticios de demostración.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM estudiantes').get();
if (total === 0) {
  console.log('Base de datos vacía: sembrando datos de demostración…');
  sembrarDatos();
}

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reporte', reporteRoutes);
app.use('/api/anexos', anexosRoutes);
app.use('/api/wiki', wikiRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// En producción el frontend no corre con Vite: este mismo servidor entrega
// los archivos ya construidos (client/dist) y, para cualquier ruta que no
// sea de la API, devuelve index.html — es React Router quien decide qué
// pantalla mostrar del lado del navegador.
if (process.env.NODE_ENV === 'production') {
  const rutaClient = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(rutaClient));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(rutaClient, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor PIAR corriendo en http://localhost:${PORT}`);
});
