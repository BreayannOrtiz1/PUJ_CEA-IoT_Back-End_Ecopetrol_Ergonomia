import { Router } from 'express';
import * as ctrl from '../controllers/generic.controller.js';


const router = Router();

// Lista (GET /api/v1/generic/:tableName)  
// Lista todos los campos de la tabla especificada en la url { "tableName": "Gateway" } o { "tableName": "Lugar" } o { "tableName": "Medida" }  o { "tableName": "Nodo" }  o { "tableName": "Sensor" }, etc 
router.get('/', ctrl.list);


export default router;