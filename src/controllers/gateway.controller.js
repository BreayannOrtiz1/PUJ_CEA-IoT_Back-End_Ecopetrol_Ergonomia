// Capa delgada entre HTTP (req/res) y la lógica de negocio (services)
import * as service from '../services/gateway.service.js';


export async function list(req, res) {
    // Obtiene lista de la tabla solicitada
    console.log("Controlador - Listando tabla:", req.query);
    const tableName = String(req.query.tableName || "");
    const data = await service.list(tableName);
    res.json({ ok: true, data });
}


export async function getById(req, res) {
    // Busca por ID, si no existe -> 404
    const data = await service.getById(req.params.id);
    if (!data) return res.status(404).json({ ok: false, message: 'Gateway no encontrado' });
    res.json({ ok: true, data });
}


export async function register(req, res) {
    // Crea un nuevo gateway (valores ya validados por Joi)
    console.log("Controlador - Datos recibidos:", req.body);
    const created = await service.create(req.body);
    res.status(201).json({ ok: true, message: 'Gateway registrado', data: created });
}


export async function update(req, res) {
    // Actualiza gateway existente, si no existe -> 404
    console.log("Controlador - Datos recibidos para actualizar:", req.body);
    const updated = await service.update(req.body);
    res.json({ ok: true, message: 'Gateway actualizado', data: updated });
}


export async function remove(req, res) {
    // Elimina y responde 
    console.log("Controlador - Datos recibidos para eliminar:", req.body);
    const delJson = await service.remove(req.body);
    
    res.json({ ok: true, message: 'Gateway eliminado', data: delJson });
}
