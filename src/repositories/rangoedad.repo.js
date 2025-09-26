
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';


// Cambia por el nombre real de tu tabla
const table = '[ECO].[Rango_Edad]';

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

// [Rango_edad]
//       ,[Minimo]
//       ,[Maximo]

export async function insert(dto) {
    const pool = getPool();
    const now = new Date();
    console.log("DTO recibido en el repositorio:");
    console.log(dto);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('Rango_edad', sql.Int(30), dto.RangoEdad || null)
        .input('Minimo', sql.Int, dto.Minimo || null)
        .input('Maximo', sql.Int, dto.Maximo || null);
        
    // Inserta y devuelve la fila recién creada
    const query = `
                INSERT INTO ${table} (  [Rango_edad]
                                        ,[Minimo]
                                        ,[Maximo]
                                        )
                VALUES (@Rango_edad, @Minimo, @Maximo);
                `; 
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset; // Devolver la fila insertada (SQL Server 2012+) en funcion del serial
}


export async function update(dto) {
    console.log("DTO recibido en el repositorio para actualizar:");
    console.log(dto);
    const pool = getPool();

    // Primero, obtener los datos actuales
    const getCurrentData = await pool
        .request()
        .input('RangoEdad', sql.Int, dto.RangoEdad)
        .query(`SELECT * FROM ${table} WHERE Rango_edad = @RangoEdad`);

    const currentData = getCurrentData.recordset[0];
    
    if (!currentData) {
        throw new Error(`No se encontró el Rango de edad con ID ${dto.RangoEdad}`);
    }

    // Mezclar los datos actuales con los nuevos datos del DTO
    const updatedData = {
        RangoEdad: dto.RangoEdad !== undefined ? dto.RangoEdad : currentData.RangoEdad,
        Minimo: dto.Minimo !== undefined ? dto.Minimo : currentData.Minimo,
        Maximo: dto.Maximo !== undefined ? dto.Maximo : currentData.Maximo
    };
        

    //Construye request con parámetros tipados con los datos mezclados
    const rq = pool
        .request()
        .input('RangoEdad', sql.Int, dto.RangoEdad)
        .input('Minimo', sql.Int, dto.Minimo)
        .input('Maximo', sql.Int, dto.Maximo);
        

    const query = `
                UPDATE ${table}
                SET Rango_edad=@RangoEdad,
                    Minimo=@Minimo,
                    Maximo=@Maximo
                    
            
                WHERE Rango_edad=@RangoEdad;
                
                SELECT *
                FROM ${table}
                WHERE Rango_edad = @RangoEdad;
                `;
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset[0];
}


export async function remove(dto) {
    console.log("El ID recibido para eliminar es:", dto); // Log del ID recibido
    
    const pool = getPool();
    const rq = pool.request();
    const query = `DELETE FROM ${table} WHERE Rango_edad=${dto.RangoEdad}`;
    
    const result = await rq.query(query);
    //console.log(result);

    return result;
}