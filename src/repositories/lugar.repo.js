
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';


// Cambia por el nombre real de tu tabla
const table = '[ECO].[Lugar]';

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
        .input('Municipio', sql.NChar(40), dto.municipio || null)
        .input('Sede', sql.NChar(40), dto.sede || null)
        .input('Edificio', sql.NChar(40), dto.edificio || null)
        .input('Piso', sql.NChar(40), dto.piso || null)
        .input('Area', sql.NChar(40), dto.area || null);
    
    
    // Inserta y devuelve la fila recién creada
    const query = `
                INSERT INTO ${table} (  [Municipio]
                                        ,[Sede]
                                        ,[Edificio]
                                        ,[Piso]
                                        ,[Area])
                VALUES (@Municipio, @Sede, @Edificio, @Piso, @Area);
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
            .input('LugarId', sql.Int, dto.ID)
            .query(`SELECT * FROM ${table} WHERE ID_Lugar = @LugarId`);
    
        const currentData = getCurrentData.recordset[0];
        
        if (!currentData) {
            throw new Error(`No se encontró el Lugar con ID ${dto.ID}`);
        }
    
        // Mezclar los datos actuales con los nuevos datos del DTO
        const updatedData = {
            municipio: dto.municipio !== undefined ? dto.municipio : currentData.Municipio,
            sede: dto.sede !== undefined ? dto.sede : currentData.Sede,
            edificio: dto.edificio !== undefined ? dto.edificio : currentData.Edificio,
            piso: dto.piso !== undefined ? dto.piso : currentData.Piso,
            area: dto.area !== undefined ? dto.area : currentData.Area
        };
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('LugarId', sql.Int, dto.ID)
        .input('Municipio', sql.NChar(40), updatedData.municipio)
        .input('Sede', sql.NChar(40), updatedData.sede)
        .input('Edificio', sql.NChar(40), updatedData.edificio)
        .input('Piso', sql.NChar(40), updatedData.piso)
        .input('Area', sql.NChar(40), updatedData.area);
    //console.log(rq);
    
    // Inserta y devuelve la fila recién creada
    const query = `
                UPDATE ${table}
                SET Municipio=@Municipio,
                    Sede=@Sede,
                    Edificio=@Edificio,
                    Piso=@Piso,
                    Area=@Area
                WHERE ID_Lugar=@LugarId;
                
                SELECT *
                FROM ${table}
                WHERE ID_Lugar = @LugarId;
                `;
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset[0];
}


export async function remove(dto) {
    console.log("El ID recibido para eliminar es:", dto); // Log del ID recibido
    
    const pool = getPool();
    const rq = pool.request();
    const query = `DELETE FROM ${table} WHERE ID_Lugar=${dto.ID}`;
    
    const result = await rq.query(query);
    //console.log(result);

    return result;
}