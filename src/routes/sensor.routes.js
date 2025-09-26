// Define los endpoints REST relacionados con lugares
import { Router } from 'express';
import * as ctrl from '../controllers/sensor.controller.js';
import { validate } from '../middlewares/validate.js';
import { createSensorSchema, updateSensorSchema, deleteSensorSchema } from '../schemas/sensor.schema.js';


const router = Router();

// Lista (GET /api/v1/nodoiot)
//router.get('/', ctrl.list);


// Crear (POST /api/v1/sensor/register)
router.post('/register', validate({ body: createSensorSchema }), ctrl.register);


// Actualizar (PUT /api/v1/sensor/update)
router.put('/update', validate({ body: updateSensorSchema }), ctrl.update);


// Eliminar (DELETE /api/v1/sensor/remove)
router.delete('/remove', validate({ body: deleteSensorSchema }), ctrl.remove);


export default router;