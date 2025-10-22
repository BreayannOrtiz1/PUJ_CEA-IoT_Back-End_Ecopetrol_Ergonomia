// Esquemas Joi para validar payloads de Gateways
import Joi from 'joi';


export const createGatewaySchema = Joi.object({

    Marca: Joi.string().max(25).allow('', null),
    Referencia: Joi.string().max(60).allow('', null).required(),
    Serial: Joi.string().max(30).allow('', null).required(),
    OS: Joi.string().max(30).allow('', null),
    SSID: Joi.string().max(40).allow('', null),
    MAC_WiFi: Joi.string().max(30).allow('', null),
    MAC_Ethernet: Joi.string().max(30).allow('', null)

});


export const updateGatewaySchema = Joi.object({

    ID: Joi.number().required(),
    Marca: Joi.string().max(25).allow('', null),
    Referencia: Joi.string().max(60).allow('', null),
    Serial: Joi.string().allow('', null),
    OS: Joi.string().max(30).allow('', null),
    SSID: Joi.string().max(40).allow('', null),
    MAC_WiFi: Joi.string().max(30).allow('', null),
    MAC_Ethernet: Joi.string().max(30).allow('', null)
}); // Exige al menos un campo para actualizar, además del ID

export const deleteGatewaySchema = Joi.object({
    ID: Joi.number().required()
});
