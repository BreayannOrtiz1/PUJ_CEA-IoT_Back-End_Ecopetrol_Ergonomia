// Define los endpoints REST relacionados con lugares
import { Router } from 'express';
import * as ctrl from '../controllers/lugar.controller.js';
import { validate } from '../middlewares/validate.js';
import { createLugarSchema, updateLugarSchema, deleteLugarSchema } from '../schemas/lugar.schema.js';


const router = Router();

// Lista (GET /api/v1/lugar)
//router.get('/', ctrl.list);


// Crear (POST /api/v1/lugar/register)
router.post('/register', validate({ body: createLugarSchema }), ctrl.register);


// Actualizar (PUT /api/v1/lugar/update)
router.put('/update', validate({ body: updateLugarSchema }), ctrl.update);


// Eliminar (DELETE /api/v1/lugar/remove)
router.delete('/remove', validate({ body: deleteLugarSchema }), ctrl.remove);


export default router;