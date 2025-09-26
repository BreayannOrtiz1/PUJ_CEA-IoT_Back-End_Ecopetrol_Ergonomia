
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';


// Cambia por el nombre real de tu tabla
const table = '[ECO].[NodoIoT]';

//Paa listar todos los elementos basta con hacer un llamado al endpoint /gateway con el body { "tableName": "Lugar" }
// export async function findAll(dto) {
    
// }

// export async function findById(id) {
//     const pool = getPool();
//     const result = await pool
//         .request()
//         .input('GatewayId', sql.VarChar(64), id)
//         .query(
//             `SELECT GatewayId, Name, Location, IPAddress, Notes, CreatedAt, UpdatedAt
// FROM ${table}
// WHERE GatewayId = @GatewayId`
//         );
//     return result.recordset[0]; // undefined si no existe
// }

export async function insert(dto) {
    const pool = getPool();
    const now = new Date();
    console.log("DTO recibido en el repositorio:");
    console.log(dto);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('MAC_Ble', sql.NChar(30), dto.MAC_Ble || null)
        .input('MAC_Wifi', sql.NChar(30), dto.MAC_Wifi || null)
        .input('Tipo', sql.NChar(30), dto.Tipo || null)
        .input('OS', sql.NChar(30), dto.OS || null)
        .input('Marca', sql.NChar(30), dto.Marca || null)
        .input('Referencia', sql.NChar(30), dto.Referencia || null)
        .input('Propiedad', sql.NChar(30), dto.Propiedad || null);
        
    
    
    // Inserta y devuelve la fila recién creada
    const query = `
                INSERT INTO ${table} (  [MAC_Ble]
                                        ,[MAC_Wifi]
                                        ,[Tipo]
                                        ,[OS]
                                        ,[Marca]
                                        ,[Referencia]
                                        ,[Propiedad])
                VALUES (@MAC_Ble, @MAC_Wifi, @Tipo, @OS, @Marca, @Referencia, @Propiedad);
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