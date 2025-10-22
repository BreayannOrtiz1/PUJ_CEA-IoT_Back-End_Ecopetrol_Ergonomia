// Esquemas Joi para validar payloads
// En el front end se realizan validaciones, pero es importante validar también en el back end
import Joi from 'joi';
// [ID_Trabajador]
//       ,[Sexo]
//       ,[Rango_Edad]
//       ,[Cargo]

export const createTrabajadorSchema = Joi.object({

    Sexo: Joi.string().max(30).allow('', null).required(),
    ID_Rango_Edad: Joi.number().required(),
    Cargo: Joi.string().max(60).allow('', null).required()     
});


export const updateTrabajadorSchema = Joi.object({

    ID: Joi.number().max(100).required(),
    Sexo: Joi.string().max(30).allow('', null),
    Rango_Edad: Joi.number().max(100),
    Cargo: Joi.string().max(30).allow('', null)
   
}).min(1); // Exige al menos un campo para actualizar, además del ID

export const deleteTrabajadorSchema = Joi.object({
    ID: Joi.number().max(100).required()
});

