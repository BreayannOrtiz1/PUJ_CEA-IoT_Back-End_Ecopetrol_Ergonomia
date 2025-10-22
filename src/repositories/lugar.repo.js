
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';

const table = '[ECO].[Lugar]';

export async function insert(dto) {
    const pool = getPool();
    const now = new Date();
    console.log("DTO recibido en el repositorio:");
    console.log(dto);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('Municipio', sql.NChar(40), dto.Municipio || null)
        .input('Sede', sql.NChar(40), dto.Sede || null)
        .input('Edificio', sql.NChar(40), dto.Edificio || null)
        .input('Piso', sql.NChar(40), dto.Piso || null)
        .input('Area', sql.NChar(40), dto.Area || null);
    
    
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
            municipio: dto.Municipio !== undefined ? dto.Municipio : currentData.Municipio,
            sede: dto.Sede !== undefined ? dto.Sede : currentData.Sede,
            edificio: dto.Edificio !== undefined ? dto.Edificio : currentData.Edificio,
            piso: dto.Piso !== undefined ? dto.Piso : currentData.Piso,
            area: dto.Area !== undefined ? dto.Area : currentData.Area
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