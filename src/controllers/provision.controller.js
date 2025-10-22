// Capa delgada entre HTTP (req/res) y la lógica de negocio (services)
import * as service from '../services/provision.service.js';


export async function listID(req, res) {
    try {
        console.log("=== Solicitud a /provision/listID ===");
        console.log("Body recibido:", JSON.stringify(req.body, null, 2));

        // Obtener el DTO del body de la petición
        const dto = req.body;

        // Validar que el body no esté vacío
        if (!dto || Object.keys(dto).length === 0) {
            return res.status(400).json({
                ok: false,
                message: "El body de la petición no puede estar vacío",
                data: null
            });
        }

        // Validar estructura del DTO
        if (!dto.tables || !Array.isArray(dto.tables)) {
            return res.status(400).json({
                ok: false,
                message: "El campo 'tables' es requerido y debe ser un array",
                data: null
            });
        }

        // Validar que haya al menos una tabla
        if (dto.tables.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "Debe especificar al menos una tabla para consultar",
                data: null
            });
        }

        // Validar estructura de cada elemento del array
        for (const table of dto.tables) {
            if (!table.name || !table.idColumn || !table.displayColumn) {
                return res.status(400).json({
                    ok: false,
                    message: "Cada tabla debe tener 'name', 'idColumn' y 'displayColumn'",
                    data: null
                });
            }
        }

        // Llamar al repositorio para obtener los datos
        const data = await service.listID(dto);

        // Verificar si se obtuvieron resultados
        const totalResults = Object.values(data).reduce((acc, arr) => acc + arr.length, 0);

        if (totalResults === 0) {
            return res.status(404).json({
                ok: false,
                message: "No se encontraron registros en las tablas solicitadas",
                data: data
            });
        }

        // Respuesta exitosa
        return res.status(200).json({
            ok: true,
            message: `Se obtuvieron registros de ${Object.keys(data).length} tabla(s)`,
            data: data
        });

    } catch (error) {
        console.error("Error en getProvisionIDs:", error);
        
        return res.status(500).json({
            ok: false,
            message: error.message || "Error al obtener los IDs de provisión",
            data: null
        });
    }
}


export async function register(req, res) {
    console.log("Controlador - Datos recibidos:", req.body);
    const created = await service.create(req.body);
    res.status(201).json({ ok: true, message: ' registrado', data: created });
}


export async function update(req, res) {
    console.log("Controlador - Datos recibidos para actualizar:", req.body);
    const updated = await service.update(req.body);
    res.json({ ok: true, message: ' actualizado', data: updated });
}


export async function remove(req, res) {
    // Elimina y responde 
    console.log("Controlador - Datos recibidos para eliminar:", req.body);
    const delJson = await service.remove(req.body);
    
    res.json({ ok: true, message: ' eliminado', data: delJson });
}
