// Define los endpoints REST relacionados con lugares
import { Router } from 'express';
import * as ctrl from '../controllers/rangoedad.controller.js';
import { validate } from '../middlewares/validate.js';
import { createRangoEdadSchema, updateRangoEdadSchema, deleteRangoEdadSchema } from '../schemas/rangoedad.schema.js';


const router = Router();

// Lista (GET /api/v1/)
//router.get('/', ctrl.list);


// Crear (POST /api/v1/rangoedad/register)
router.post('/register', validate({ body: createRangoEdadSchema }), ctrl.register);


// Actualizar (PUT /api/v1/rangoedad/update)
router.put('/update', validate({ body: updateRangoEdadSchema }), ctrl.update);


// Eliminar (DELETE /api/v1/rangoedad/remove)
router.delete('/remove', validate({ body: deleteRangoEdadSchema }), ctrl.remove);


export default router;