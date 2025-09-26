// Carga variables de entorno y maneja errores async sin try/catch en cada ruta
import 'dotenv/config';


// Arranque de la app y pool MSSQL
import app from './app.js';
import { initPool } from './config/db.js';


const PORT = process.env.PORT || 5173; // Por defecto 5173 


// Inicializa el pool antes de levantar el servidor HTTP
(async () => {
    try {
        await initPool(); // Abre una única conexión pool reutilizable (singleton)
        app.listen(PORT, () => {
            console.log(`[API] Escuchando en puerto ${PORT}`);
        });
    } catch (err) {
        console.error('[API] No se pudo inicializar el pool de MSSQL:', err);
        process.exit(1); // Falla rápido si DB no está lista
    }
})();