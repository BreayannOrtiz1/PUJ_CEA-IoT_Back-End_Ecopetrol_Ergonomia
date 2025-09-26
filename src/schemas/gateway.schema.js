// Esquemas Joi para validar payloads de Gateways
import Joi from 'joi';


export const createGatewaySchema = Joi.object({

    marca: Joi.string().max(100).allow('', null),
    referencia: Joi.string().max(150).allow('', null).required(),
    serial: Joi.string().allow('', null).required(),
    os: Joi.string().max(100).allow('', null),
    ssid: Joi.string().max(100).allow('', null),
    macWifi: Joi.string().max(64).allow('', null),
    macEthernet: Joi.string().max(64).allow('', null)
});


export const updateGatewaySchema = Joi.object({
    ID: Joi.number().required(),
    marca: Joi.string().max(100).allow('', null),
    referencia: Joi.string().max(250).allow('', null).required(),
    serial: Joi.string().allow('', null),
    os: Joi.string().max(100).allow('', null),
    ssid: Joi.string().max(100).allow('', null),
    macWifi: Joi.string().max(64).allow('', null),
    macEthernet: Joi.string().max(64).allow('', null)
}).min(1); // Exige al menos un campo para actualizar, además del ID

export const deleteGatewaySchema = Joi.object({
    ID: Joi.number().required()
});


export const idParamSchema = Joi.object({
    id: Joi.string().max(64).required()
});