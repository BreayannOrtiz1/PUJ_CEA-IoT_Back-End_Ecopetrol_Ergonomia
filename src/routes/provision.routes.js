// Define los endpoints REST 
import { Router } from 'express';
import * as ctrl from '../controllers/provision.controller.js';
//import { validate } from '../middlewares/validate.js';
//import { createprovisionSchema, updateprovisionSchema, deleteprovisionSchema } from '../schemas/nodoiot.schema.js';


const router = Router();

// List
router.post('/listID', ctrl.listID);

// Crear (POST /api/v1/provision/register)
router.post('/register', ctrl.register);


// Actualizar (PUT /api/v1/--/update)
router.put('/update', ctrl.update);


// Eliminar (DELETE /api/v1/--/remove)
router.delete('/remove', ctrl.remove);

export default router;