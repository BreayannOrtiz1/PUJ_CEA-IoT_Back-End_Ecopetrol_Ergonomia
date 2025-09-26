// Esquemas Joi para validar payloads de NodoIoT
// En el front end se realizan validaciones, pero es importante validar también en el back end
import Joi from 'joi';


export const createRangoEdadSchema = Joi.object({

    RangoEdad: Joi.number().max(30).required(),    
    Minimo: Joi.number().max(120).required(),
    Maximo: Joi.number().max(120).required() 

});


export const updateRangoEdadSchema = Joi.object({

   RangoEdad: Joi.number().max(30).required(),    
   Minimo: Joi.number().max(120),  // No es requerido en la actualización
   Maximo: Joi.number().max(120)   // No es requerido en la actualización
}).min(1); // Exige al menos un campo para actualizar, además del ID

export const deleteRangoEdadSchema = Joi.object({
    RangoEdad: Joi.number().max(100).required()
});

