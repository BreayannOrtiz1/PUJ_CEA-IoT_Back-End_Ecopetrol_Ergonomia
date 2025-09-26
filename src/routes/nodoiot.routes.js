// Define los endpoints REST relacionados con lugares
import { Router } from 'express';
import * as ctrl from '../controllers/nodoiot.controller.js';
import { validate } from '../middlewares/validate.js';
import { createNodoIoTSchema, updateNodoIoTSchema, deleteNodoIoTSchema } from '../schemas/nodoiot.schema.js';


const router = Router();

// Lista (GET /api/v1/nodoiot)
//router.get('/', ctrl.list);


// Crear (POST /api/v1/nodoiot/register)
router.post('/register', validate({ body: createNodoIoTSchema }), ctrl.register);


// Actualizar (PUT /api/v1/nodoiot/update)
router.put('/update', validate({ body: updateNodoIoTSchema }), ctrl.update);


// Eliminar (DELETE /api/v1/nodoiot/remove)
router.delete('/remove', validate({ body: deleteNodoIoTSchema }), ctrl.remove);


export default router;