// Define los endpoints REST relacionados con Gateways
import { Router } from 'express';
import * as ctrl from '../controllers/gateway.controller.js';
import { validate } from '../middlewares/validate.js';
import { createGatewaySchema, updateGatewaySchema, deleteGatewaySchema } from '../schemas/gateway.schema.js';


const router = Router();


// Lista (GET /api/v1/gateway/:tableName)  
// Lista todos los campos de la tabla especificada en la url { "tableName": "Gateway" } o { "tableName": "Lugar" } o { "tableName": "Medida" }  o { "tableName": "Nodo" }  o { "tableName": "Sensor" }, etc 
router.get('/', ctrl.list);



// Crear    Gateway  (POST /api/v1/gateway/register)
router.post('/register', validate({ body: createGatewaySchema }), ctrl.register);


// Actualizar   Gateway (PUT /api/v1/gateway/:id)
router.put('/update', validate({ body: updateGatewaySchema }), ctrl.update);


// Eliminar Gateway (DELETE /api/v1/gateway/remove)
router.delete('/remove', validate({ body: deleteGatewaySchema }), ctrl.remove);


export default router;