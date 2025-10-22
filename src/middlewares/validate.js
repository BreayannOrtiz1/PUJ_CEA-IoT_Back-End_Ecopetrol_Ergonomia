// Validación declarativa con Joi para body/params/query
import Joi from 'joi';


export function validate({ body, params, query } = {}) {
    return (req, res, next) => {
        try {
            if (body) req.body = Joi.attempt(req.body, body, { abortEarly: false, stripUnknown: true });
            if (params) req.params = Joi.attempt(req.params, params, { abortEarly: false, stripUnknown: true });
            if (query) req.query = Joi.attempt(req.query, query, { abortEarly: false, stripUnknown: true });
            return next();
        } catch (err) {
             console.error('Error de validación con Joi:', err.details);

            // Devuelve 400 con detalles de validación
            const details = err.details?.map((d) => d.message) || [err.message];
            return res.status(400).json({ ok: false, message: 'Error de validación', details });
        }
    };
}