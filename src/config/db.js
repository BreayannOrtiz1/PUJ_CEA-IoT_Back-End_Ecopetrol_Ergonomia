// Configuración y pool de MSSQL como singleton
import sql from 'mssql'; // CJS -> ESM interop: el default es el objeto del módulo


let pool; // Mantiene una única instancia para toda la app


// Lee configuración desde variables de entorno
const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: process.env.SQL_ENCRYPT !== 'false', // Azure SQL requiere encrypt
        trustServerCertificate: process.env.SQL_TRUST_CERT === 'true' // Útil en labs on‑prem
    }
};


// Inicializa el pool si no existe (idempotente)
export async function initPool() {
    if (pool) return pool;
    pool = new sql.ConnectionPool(config);

    // Manejo de errores del pool (reconexión automática está gestionada por mssql)
    pool.on('error', (err) => console.error('[MSSQL] Pool error:', err));

    await pool.connect();
    console.log('[MSSQL] Pool conectado');
    return pool;
}

// Obtiene el pool existente (o lanza si aún no se inicializó)
export function getPool() {
    if (!pool) throw new Error('MSSQL pool no inicializado');
    return pool;
}


// Reexporta el namespace de mssql por conveniencia en repositorios
export { sql };