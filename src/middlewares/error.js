// 404 y manejador de errores centralizado
export function notFound(req, res, next) {
    res.status(404).json({ ok: false, message: 'Ruta no encontrada' });
}


export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.status ? err.message : 'Error interno del servidor';


    // Log técnico completo (pino-http ya captura request/response básicos)
    console.error('[API] Error no controlado:', err);


    res.status(status).json({ ok: false, message });
}