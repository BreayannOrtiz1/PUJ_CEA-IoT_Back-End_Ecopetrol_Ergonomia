// Instancia y configuración de Express (middlewares + rutas + errores)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino-http';


import routesV1 from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.js';


const app = express();

// Logging HTTP estructurado (útil para auditoría y diagnósticos)
app.use(pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: "HH:MM:ss Z", ignore: "pid,hostname" }
  }
}));

// Seguridad base (headers) y CORS (ajusta ALLOWED_ORIGIN según tu frontend)
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));


// Parser JSON (limita tamaño para evitar payloads gigantes)
app.use(express.json({ limit: '1mb' }));




// Healthcheck simple para probes / monitoreo
app.get('/api/v1/health', (req, res) => {
    res.json({ ok: true, status: 'healthy', ts: new Date().toISOString() });
});


// Rutas versión 1
app.use('/api/v1', routesV1);


// Middlewares finales de 404 y errores
app.use(notFound);
app.use(errorHandler);


export default app;