// Reglas de negocio / coordinador de repositorios
import * as repo from '../repositories/trabajador.repo.js';


// export function getById(id) {
//     return repo.findById(id);
// }

export async function create(dto) {
    // reglas (duplicados, normalización, auditoría, etc.)
    return repo.insert(dto);
}

export async function update(dto) {
    // Verifica existencia antes de actualizar
    //const exists = await repo.findById(id);
    console.log("Servicio - Datos recibidos para actualizar:");
    
    return repo.update(dto);
}

export function remove(dto) {
    return repo.remove(dto);
}