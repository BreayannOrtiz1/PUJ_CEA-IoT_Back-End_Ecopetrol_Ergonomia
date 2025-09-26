// Esquemas Joi para validar payloads de NodoIoT
// En el front end se realizan validaciones, pero es importante validar también en el back end
import Joi from 'joi';


export const createNodoIoTSchema = Joi.object({

    MAC_Ble: Joi.string().max(30).allow('', null).required(),       // En la base de datos => NChar(20)
    MAC_Wifi: Joi.string().max(30).allow('', null).required(),      // En la base de datos => NChar(20)
    Tipo: Joi.string().max(30).allow('', null).required(),           // En la base de datos => NChar(20)
    OS: Joi.string().max(30).allow('', null).required(),             // En la base de datos => NChar(20)
    Marca: Joi.string().max(30).allow('', null).required(),          // En la base de datos => NChar(20)
    Referencia: Joi.string().max(30).allow('', null).required(),     // En la base de datos => NChar(20)
    Propiedad: Joi.string().max(30).allow('', null).required()       // En la base de datos => NChar(20)

});


export const updateNodoIoTSchema = Joi.object({

    ID: Joi.number().max(100).required(),
    MAC_Ble: Joi.string().max(30).allow('', null),       // En la base de datos => NChar(20)
    MAC_Wifi: Joi.string().max(30).allow('', null),      // En la base de datos => NChar(20)
    Tipo: Joi.string().max(30).allow('', null),           // En la base de datos => NChar(20)
    OS: Joi.string().max(30).allow('', null),             // En la base de datos => NChar(20)
    Marca: Joi.string().max(30).allow('', null),          // En la base de datos => NChar(20)
    Referencia: Joi.string().max(30).allow('', null),     // En la base de datos => NChar(20)
    Propiedad: Joi.string().max(30).allow('', null)       // En la base de datos => NChar(20)
}).min(1); // Exige al menos un campo para actualizar, además del ID

export const deleteNodoIoTSchema = Joi.object({
    ID: Joi.number().max(100).required()
});

