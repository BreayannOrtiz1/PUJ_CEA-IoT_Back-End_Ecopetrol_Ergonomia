// Esquemas Joi para validar payloads de Lugares
// En el front end se realizan validaciones, pero es importante validar también en el back end
import Joi from 'joi';


export const createLugarSchema = Joi.object({

    Municipio: Joi.string().max(100).allow('', null),
    Sede: Joi.string().max(100).allow('', null),
    Edificio: Joi.string().max(100).allow('', null),
    Piso: Joi.string().max(100).allow('', null),
    Area: Joi.string().max(100).allow('', null)
});


export const updateLugarSchema = Joi.object({

    ID: Joi.number().max(100).required(),
    Municipio: Joi.string().max(100).allow('', null),
    Sede: Joi.string().max(100).allow('', null),
    Edificio: Joi.string().max(100).allow('', null),
    Piso: Joi.string().max(100).allow('', null),
    Area: Joi.string().max(100).allow('', null)
}).min(1); // Exige al menos un campo para actualizar, además del ID

export const deleteLugarSchema = Joi.object({
    ID: Joi.number().max(100).required()
});

