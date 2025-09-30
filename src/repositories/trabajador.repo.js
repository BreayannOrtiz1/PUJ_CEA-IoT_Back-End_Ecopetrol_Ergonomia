
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';


// Cambia por el nombre real de tu tabla
const table = '[ECO].[Trabajador]';

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

export async function insert(dto) {
    const pool = getPool();
    const now = new Date();
    console.log("DTO recibido en el repositorio:");
    console.log(dto);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('Sexo', sql.NChar(10), dto.Sexo || null)
        .input('ID_Rango_Edad', sql.BigInt, dto.Rango_Edad || null)
        .input('Cargo', sql.NChar(30), dto.Cargo || null);
        
    // Inserta y devuelve la fila recién creada
    const query = `
                INSERT INTO ${table} (  [Sexo]
                                        ,[ID_Rango_Edad]
                                        ,[Cargo]
                                        )
                VALUES (@Sexo, @ID_Rango_Edad, @Cargo);
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
        .input('TrabajadorId', sql.Int, dto.ID)
        .query(`SELECT * FROM ${table} WHERE ID_Trabajador = @TrabajadorId`);

    const currentData = getCurrentData.recordset[0];
    
    if (!currentData) {
        throw new Error(`No se encontró el Trabajador con ID ${dto.ID}`);
    }

    // Mezclar los datos actuales con los nuevos datos del DTO
    const updatedData = {
        Sexo: dto.Sexo !== undefined ? dto.Sexo : currentData.Sexo,
        Rango_Edad: dto.Rango_Edad !== undefined ? dto.Rango_Edad : currentData.Rango_Edad != null ? currentData.Rango_Edad: 1,
        Cargo: dto.Cargo !== undefined ? dto.Cargo : currentData.Cargo
       
    };

    // IMPORTANTE!!! SE DEBE CORREGIR EN EL FRONT EL PAYLOAD AL DEITAR UN TRABAJADOR, NO SE ESTA ENVIANDO EL ID DEL RANGO DE EDAD

    //Construye request con parámetros tipados con los datos mezclados
    const rq = pool
        .request()
        .input('TrabajadorId', sql.Int, dto.ID)
        .input('Sexo', sql.NChar(10), updatedData.Sexo || null)
        .input('ID_Rango_Edad', sql.BigInt, updatedData.Rango_Edad || null)
        .input('Cargo', sql.NChar(30), updatedData.Cargo || null);
        

    const query = `
                UPDATE ${table}
                SET Sexo=@Sexo,
                    ID_Rango_Edad=@ID_Rango_Edad,
                    Cargo=@Cargo
                    
            
                WHERE ID_Trabajador=@TrabajadorId;
                
                SELECT *
                FROM ${table}
                WHERE ID_Trabajador = @TrabajadorId;
                `;
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset[0];
}


export async function remove(dto) {
    console.log("El ID recibido para eliminar es:", dto); // Log del ID recibido
    
    const pool = getPool();
    const rq = pool.request();
    const query = `DELETE FROM ${table} WHERE ID_Trabajador=${dto.ID}`;
    
    const result = await rq.query(query);
    //console.log(result);

    return result;
}