// Define los endpoints REST relacionados con lugares
import { Router } from 'express';
import * as ctrl from '../controllers/trabajador.controller.js';
import { validate } from '../middlewares/validate.js';
import { createTrabajadorSchema, updateTrabajadorSchema, deleteTrabajadorSchema } from '../schemas/trabajador.schema.js';


const router = Router();

// Lista (GET /api/v1/)
//router.get('/', ctrl.list);


// Crear (POST /api/v1/trabajador/register)
router.post('/register', validate({ body: createTrabajadorSchema }), ctrl.register);


// Actualizar (PUT /api/v1/trabajador/update)
router.put('/update', validate({ body: updateTrabajadorSchema }), ctrl.update);


// Eliminar (DELETE /api/v1/trabajador/remove)
router.delete('/remove', validate({ body: deleteTrabajadorSchema }), ctrl.remove);


export default router;