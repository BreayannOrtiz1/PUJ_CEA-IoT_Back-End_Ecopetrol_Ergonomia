// Reglas de negocio / coordinador de repositorios
import * as repo from '../repositories/provision.repo.js';



export async function listID(dto) {
    // reglas (duplicados, normalización, auditoría, etc.)
    return repo.listID(dto);
}

export async function create(dto) {
    // reglas (duplicados, normalización, auditoría, etc.)
    return repo.insert(dto);
}

export async function update(dto) {
    return repo.update(dto);
}

export function remove(dto) {
    return repo.remove(dto);
}