// Punto de entrada del servidor Express
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes.js';
import reporteRoutes from './routes/reporte.routes.js';
import anexosRoutes from './routes/anexos.routes.js';
import wikiRoutes from './routes/wiki.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reporte', reporteRoutes);
app.use('/api/anexos', anexosRoutes);
app.use('/api/wiki', wikiRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor PIAR corriendo en http://localhost:${PORT}`);
});
