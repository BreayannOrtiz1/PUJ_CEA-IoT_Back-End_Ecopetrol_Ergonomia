
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';


// Cambia por el nombre real de tu tabla
const table = '[ECO].[Config_Provision_Fisiologicas]';

/**
 * Obtiene los últimos 10 registros de múltiples tablas
 * Consulta dinámicamente las tablas especificadas en el DTO
 * 
 * @param {Object} dto - Objeto con array de configuraciones de tablas
 * @param {Array} dto.tables - Array de objetos con {name, idColumn, displayColumn}
 * @returns {Object} Objeto con los resultados de cada tabla consultada
 * 
 * Ejemplo de dto:
 * {
 *   tables: [
 *     { name: "Trabajador", idColumn: "ID_Trabajador", displayColumn: "Nombre" },
 *     { name: "Sensor", idColumn: "ID_Sensor", displayColumn: "Marca" }
 *   ]
 * }
 */
export async function listID(dto) {
    const pool = getPool();

    console.log("DTO recibido en listID:");
    console.log(JSON.stringify(dto, null, 2));

    // Validar que el DTO contenga la estructura esperada
    if (!dto || !dto.tables || !Array.isArray(dto.tables)) {
        throw new Error("El DTO debe contener un array 'tables' con las configuraciones");
    }

    // Validar que haya al menos una tabla para consultar
    if (dto.tables.length === 0) {
        throw new Error("Debe especificar al menos una tabla para consultar");
    }

    // Objeto para almacenar los resultados de todas las tablas
    const results = {};

    // Nombres de tablas válidas (whitelist para seguridad)
    // IMPORTANTE: Solo permitir consultas a tablas relacionadas con Config_Provision_Fisiologicas
    const ALLOWED_TABLES = [
        'Trabajador',
        'NodoIoT',
        'Lugar',
        'Sensor',
        'Gateway',
        'Config_Provision_Gateways'
    ];

    // Procesar cada tabla solicitada
    for (const tableConfig of dto.tables) {
        const { name, idColumn, displayColumn } = tableConfig;

        // Validar que la configuración de la tabla sea válida
        if (!name || !idColumn || !displayColumn) {
            console.warn(`Configuración incompleta para tabla, se omite:`, tableConfig);
            continue;
        }

        // SEGURIDAD: Validar que la tabla esté en la lista permitida
        // Esto previene SQL injection y consultas no autorizadas
        if (!ALLOWED_TABLES.includes(name)) {
            console.warn(`Tabla no permitida: ${name}, se omite`);
            continue;
        }

        try {
            // Construir la consulta SQL de forma segura
            // Usamos el esquema [ECO] según tu configuración
            // TOP 10 para obtener solo los últimos 10 registros
            // ORDER BY con el ID en orden descendente para obtener los más recientes
            const query = `
                SELECT TOP (10) 
                    [${idColumn}] AS id,
                    [${displayColumn}] AS display
                FROM [ECO].[${name}]
                ORDER BY [${idColumn}] DESC
            `;

            console.log(`Ejecutando consulta para tabla ${name}:`, query);

            // Ejecutar la consulta
            const result = await pool.request().query(query);

            // Guardar resultados en el objeto de respuesta
            // La key será el nombre de la tabla para fácil identificación
            results[name] = result.recordset;

            console.log(`Tabla ${name}: ${result.recordset.length} registros obtenidos`);

        } catch (error) {
            // Si una consulta falla, registrar el error pero continuar con las demás
            console.error(`Error al consultar tabla ${name}:`, error.message);
            
            // Agregar un array vacío para esta tabla
            results[name] = [];
        }
    }

    console.log("Resultados finales de listID:");
    console.log(JSON.stringify(results, null, 2));

    // Devolver objeto con resultados de todas las tablas
    return results;
}

export async function insert(dto) {
    const pool = getPool();
    const now = new Date();
    console.log("DTO recibido en el repositorio:");
    console.log(dto);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('ID_NodoIoT', sql.BigInt, dto.ID_NodoIoT || null)
        .input('ID_Sensor', sql.BigInt, dto.ID_Sensor || null)
        .input('ID_Trabajador', sql.BigInt, dto.ID_Trabajador || null)
        .input('ID_Config_Provision_Gateways', sql.BigInt, dto.ID_Config_Provision_Gateways || null);
        
    
    
    // Inserta y devuelve la fila recién creada
    const query = `
                INSERT INTO ${table} (  [ID_NodoIoT]
                                        ,[ID_Sensor]
                                        ,[ID_Trabajador]
                                        ,[ID_Config_Provision_Gateways]
                                        )
                VALUES (@ID_NodoIoT, @ID_Sensor, @ID_Trabajador, @ID_Config_Provision_Gateways);
                `; 
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset; // Devolver la fila insertada (SQL Server 2012+) en funcion del serial
}


export async function update(dto) {
    console.log("DTO recibido en el repositorio para actualizar:");
    console.log(dto);
    const pool = getPool();

    // Primero, obtener los datos actuales del nodo
    const getCurrentData = await pool
        .request()
        .input('NodoId', sql.Int, dto.ID)
        .query(`SELECT * FROM ${table} WHERE ID_NodoIoT = @NodoId`);

    const currentData = getCurrentData.recordset[0];
    
    if (!currentData) {
        throw new Error(`No se encontró el nodo IoT con ID ${dto.ID}`);
    }

    // Mezclar los datos actuales con los nuevos datos del DTO
    const updatedData = {
        MAC_Ble: dto.MAC_Ble !== undefined ? dto.MAC_Ble : currentData.MAC_Ble,
        MAC_Wifi: dto.MAC_Wifi !== undefined ? dto.MAC_Wifi : currentData.MAC_Wifi,
        Tipo: dto.Tipo !== undefined ? dto.Tipo : currentData.Tipo,
        OS: dto.OS !== undefined ? dto.OS : currentData.OS,
        Marca: dto.Marca !== undefined ? dto.Marca : currentData.Marca,
        Referencia: dto.Referencia !== undefined ? dto.Referencia : currentData.Referencia,
        Propiedad: dto.Propiedad !== undefined ? dto.Propiedad : currentData.Propiedad
    };

    //Construye request con parámetros tipados con los datos mezclados
    const rq = pool
        .request()
        .input('NodoId', sql.Int, dto.ID)
        .input('MAC_Ble', sql.NChar(30), updatedData.MAC_Ble)
        .input('MAC_Wifi', sql.NChar(30), updatedData.MAC_Wifi)
        .input('Tipo', sql.NChar(30), updatedData.Tipo)
        .input('OS', sql.NChar(30), updatedData.OS)
        .input('Marca', sql.NChar(30), updatedData.Marca)
        .input('Referencia', sql.NChar(30), updatedData.Referencia)
        .input('Propiedad', sql.NChar(30), updatedData.Propiedad);

    const query = `
                UPDATE ${table}
                SET MAC_Ble=@MAC_Ble,
                    MAC_Wifi=@MAC_Wifi,
                    Tipo=@Tipo,
                    OS=@OS,
                    Marca=@Marca,
                    Referencia=@Referencia,
                    Propiedad=@Propiedad
            
                WHERE ID_NodoIoT=@NodoId;
                
                SELECT *
                FROM ${table}
                WHERE ID_NodoIoT = @NodoId;
                `;
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset[0];
}


export async function remove(dto) {
    console.log("El ID recibido para eliminar es:", dto); // Log del ID recibido
    
    const pool = getPool();
    const rq = pool.request();
    const query = `DELETE FROM ${table} WHERE ID_NodoIoT=${dto.ID}`;
    
    const result = await rq.query(query);
    //console.log(result);

    return result;
}