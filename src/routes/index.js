// Agrupa y versiona rutas de la API
import { Router } from 'express';
import gatewayRoutes from './gateway.routes.js';
import lugarRoutes from './lugar.routes.js';
import nodoiotRoutes from './nodoiot.routes.js';
import sensorRoutes from './sensor.routes.js';
import trabajadorRoutes from './trabajador.routes.js';
import rangoedadRoutes from './rangoedad.routes.js';
// import medidaRoutes from './medida.routes.js';
import provision from './provision.routes.js';



const router = Router();


// /api/v1/gateway
router.use('/gateway', gatewayRoutes);
router.use('/lugar', lugarRoutes); 
router.use('/nodoiot', nodoiotRoutes);
router.use('/sensor', sensorRoutes);
router.use('/trabajador', trabajadorRoutes);
router.use('/rangoedad', rangoedadRoutes);
router.use('/provision', provision);
// router.use('/medida', medidaRoutes);

export default router;