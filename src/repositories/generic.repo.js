
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';

export async function findAll(tableName) {
    console.log("Entrando a findAll, table name: "+tableName);
    
    const pool = getPool();
    const rq = pool.request();
    var query = `
                SELECT * FROM [ECO].[${tableName}]
                `;
    if(tableName === 'ECOPETROL_Main_Telemetry') {
        query = `
                SELECT TOP (10) [TimeStamp_Sensor]
                ,[DeviceID]
                ,[DeviceSN]
                ,[HR]
                ,[RRi_Mean]
                ,[HRV_SDNN]
                ,[HRV_RMSSD]
                ,[RR]
                ,[AccAccuracy]
                ,[AverageRR]
                ,[isLeadOn]
                ,[isActivity]
                ,[BatteryPercentage]
                ,[id]
                ,[TimeStamp_Write_DB]
                ,[FromGateway]
                FROM [dbo].[${tableName}] ORDER BY TimeStamp_Sensor DESC
                `;
    }
    // Devuelve todos los campos de la tabla
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset;
}

export async function findById(id) {
    const pool = getPool();
    const result = await pool
        .request()
        .input('GatewayId', sql.VarChar(64), id)
        .query(
            `SELECT GatewayId, Name, Location, IPAddress, Notes, CreatedAt, UpdatedAt
FROM ${table}
WHERE GatewayId = @GatewayId`
        );
    return result.recordset[0]; // undefined si no existe
}