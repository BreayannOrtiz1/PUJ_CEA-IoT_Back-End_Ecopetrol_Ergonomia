// Capa delgada entre HTTP (req/res) y la lógica de negocio (services)
import * as service from '../services/rangoedad.service.js';


export async function getById(req, res) {
    // Busca por ID, si no existe -> 404
    // const data = await service.getById(req.params.id);
    // if (!data) return res.status(404).json({ ok: false, message: ' no encontrado' });
    // res.json({ ok: true, data });
}


export async function register(req, res) {
    // Crea un nuevo rangoedad (valores ya validados por Joi)
    console.log("Controlador - Datos recibidos:", req.body);
    const created = await service.create(req.body);
    res.status(201).json({ ok: true, message: 'Rango Edad registrado', data: created });
}


export async function update(req, res) {
    // Actualiza  existente, si no existe -> 404
    console.log("Controlador - Datos recibidos para actualizar:", req.body);
    const updated = await service.update(req.body);
    res.json({ ok: true, message: 'Rango edad actualizado', data: updated });
}


export async function remove(req, res) {
    // Elimina y responde 
    console.log("Controlador - Datos recibidos para eliminar:", req.body);
    const delJson = await service.remove(req.body);
    
    res.json({ ok: true, message: 'rango edad eliminado', data: delJson });
}
