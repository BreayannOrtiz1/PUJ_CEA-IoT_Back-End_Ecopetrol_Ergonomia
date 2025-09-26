// Esquemas Joi para validar payloads de Lugares
// En el front end se realizan validaciones, pero es importante validar también en el back end
import Joi from 'joi';


export const createLugarSchema = Joi.object({

    municipio: Joi.string().max(100).allow('', null).required(),
    sede: Joi.string().max(100).allow('', null).required(),
    edificio: Joi.string().max(100).allow('', null),
    piso: Joi.string().max(100).allow('', null),
    area: Joi.string().max(100).allow('', null)
});


export const updateLugarSchema = Joi.object({

    ID: Joi.number().max(100).required(),
    municipio: Joi.string().max(100).allow('', null),
    sede: Joi.string().max(100).allow('', null),
    edificio: Joi.string().max(100).allow('', null),
    piso: Joi.string().max(100).allow('', null),
    area: Joi.string().max(100).allow('', null)
}).min(1); // Exige al menos un campo para actualizar, además del ID

export const deleteLugarSchema = Joi.object({
    ID: Joi.number().max(100).required()
});

