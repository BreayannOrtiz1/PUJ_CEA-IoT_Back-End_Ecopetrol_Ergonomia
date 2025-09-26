// Esquemas Joi para validar payloads de NodoIoT
// En el front end se realizan validaciones, pero es importante validar también en el back end
import Joi from 'joi';


export const createSensorSchema = Joi.object({

    Marca: Joi.string().max(30).allow('', null).required(),
    Modelo: Joi.string().max(30).allow('', null).required(),
    Variable: Joi.string().max(30).allow('', null).required(),
    Unidad: Joi.string().max(30).allow('', null).required(),
    ValorMaximo: Joi.number().allow(null).required(),
    ValorMinimo: Joi.number().allow(null).required(),
    Resolucion: Joi.number().allow(null).required(),
    MAC: Joi.string().max(30).allow('', null).required(),
    FechaUltimaCalibracion: Joi.string().allow('', null).required()
    

});


export const updateSensorSchema = Joi.object({

    ID: Joi.number().max(100).required(),
    Marca: Joi.string().max(30).allow('', null),
    Modelo: Joi.string().max(30).allow('', null),
    Variable: Joi.string().max(30).allow('', null),
    Unidad: Joi.string().max(30).allow('', null),
    ValorMaximo: Joi.number().precision(2).allow(null),
    ValorMinimo: Joi.number().precision(2).allow(null),
    Resolucion: Joi.number().precision(2).allow(null),
    MAC: Joi.string().max(30).allow('', null),
    FechaUltimaCalibracion: Joi.date().allow(null)
    
}).min(1); // Exige al menos un campo para actualizar, además del ID

export const deleteSensorSchema = Joi.object({
    ID: Joi.number().max(100).required()
});

