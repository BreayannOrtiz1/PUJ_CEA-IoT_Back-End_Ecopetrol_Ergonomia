import * as repo from '../repositories/generic.repo.js';

export function list(tableName) {
    return repo.findAll(tableName);
}

export function getById(id) {
    return repo.findById(id);
}
