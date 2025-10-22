// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';


const table = '[ECO].[Sensor]';

export async function insert(dto) {
    const pool = getPool();
    const now = new Date();
    console.log("DTO recibido en el repositorio:");
    console.log(dto);
   
    
    const rq = pool
        .request()
        .input('Marca', sql.NChar(30), dto.Marca || null)
        .input('Modelo', sql.NChar(30), dto.Modelo || null)
        .input('Variable', sql.NChar(30), dto.Variable || null)
        .input('Unidad', sql.NChar(20), dto.Unidad || null)
        .input('ValorMaximo', sql.Float, dto.ValorMaximo ?? null)
        .input('ValorMinimo', sql.Float, dto.ValorMinimo ?? null)
        .input('Resolucion', sql.Float, dto.Resolucion ?? null)
        .input('MAC', sql.NChar(30), dto.MAC || null)
        .input('Protocolo', sql.NChar(20), dto.Protocolo || null)
        .input('FechaUltimaCalibracion', sql.Date, dto.FechaUltimaCalibracion !== undefined ? dto.FechaUltimaCalibracion : null);

    // Inserta y devuelve la fila recién creada
    const query = `
                INSERT INTO ${table} (  [Marca]
                                        ,[Modelo]
                                        ,[Variable]
                                        ,[Unidad]
                                        ,[ValorMaximo]
                                        ,[ValorMinimo]
                                        ,[Resolucion]
                                        ,[MAC]
                                        ,[Protocolo]
                                        ,[FechaUltimaCalibracion])
                VALUES (@Marca, @Modelo, @Variable, @Unidad, @ValorMaximo, @ValorMinimo, @Resolucion, @MAC, @Protocolo, @FechaUltimaCalibracion);
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
        .input('SensorId', sql.Int, dto.ID)
        .query(`SELECT * FROM ${table} WHERE ID_Sensor = @SensorId`);

    const currentData = getCurrentData.recordset[0];
    
    if (!currentData) {
        throw new Error(`No se encontró el sensor con ID ${dto.ID}`);
    }

    // Mezclar los datos actuales con los nuevos datos del DTO
    const updatedData = {
        Marca: dto.Marca !== undefined ? dto.Marca : currentData.Marca,
        Modelo: dto.Modelo !== undefined ? dto.Modelo : currentData.Modelo,
        Variable: dto.Variable !== undefined ? dto.Variable : currentData.Variable,
        Unidad: dto.Unidad !== undefined ? dto.Unidad : currentData.Unidad,
        ValorMaximo: dto.ValorMaximo !== undefined ? dto.ValorMaximo : currentData.ValorMaximo,
        ValorMinimo: dto.ValorMinimo !== undefined ? dto.ValorMinimo : currentData.ValorMinimo,
        Resolucion: dto.Resolucion !== undefined ? dto.Resolucion : currentData.Resolucion,
        MAC: dto.MAC !== undefined ? dto.MAC : currentData.MAC,
        FechaUltimaCalibracion: dto.FechaUltimaCalibracion !== undefined ? dto.FechaUltimaCalibracion : currentData.FechaUltimaCalibracion
        
    };

    //Construye request con parámetros tipados con los datos mezclados
    const rq = pool
        .request()
        .input('SensorId', sql.Int, dto.ID)
        .input('Marca', sql.NChar(30), updatedData.Marca || null)
        .input('Modelo', sql.NChar(30), updatedData.Modelo || null)
        .input('Variable', sql.NChar(30), updatedData.Variable || null)
        .input('Unidad', sql.NChar(20), updatedData.Unidad || null)
        .input('ValorMaximo', sql.Float, updatedData.ValorMaximo ?? null)
        .input('ValorMinimo', sql.Float, updatedData.ValorMinimo ?? null)
        .input('Resolucion', sql.Float, updatedData.Resolucion ?? null)
        .input('MAC', sql.NChar(30), updatedData.MAC || null)
        .input('FechaUltimaCalibracion', sql.DateTime, updatedData.FechaUltimaCalibracion || null);
        

    const query = `
                UPDATE ${table}
                SET Marca=@Marca,
                    Modelo=@Modelo,
                    Variable=@Variable,
                    Unidad=@Unidad,
                    ValorMaximo=@ValorMaximo,
                    ValorMinimo=@ValorMinimo,
                    Resolucion=@Resolucion,
                    MAC=@MAC,
                    FechaUltimaCalibracion=@FechaUltimaCalibracion
                    
            
                WHERE ID_Sensor=@SensorID;
                
                SELECT *
                FROM ${table}
                WHERE ID_Sensor = @SensorId;
                `;
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset[0];
}


export async function remove(dto) {
    console.log("El ID recibido para eliminar es:", dto); // Log del ID recibido
    
    const pool = getPool();
    const rq = pool.request();
    const query = `DELETE FROM ${table} WHERE ID_Sensor=${dto.ID}`;
    
    const result = await rq.query(query);
    //console.log(result);

    return result;
}