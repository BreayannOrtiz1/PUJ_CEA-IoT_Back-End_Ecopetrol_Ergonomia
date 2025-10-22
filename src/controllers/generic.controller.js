
import * as service from '../services/generic.service.js';


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
