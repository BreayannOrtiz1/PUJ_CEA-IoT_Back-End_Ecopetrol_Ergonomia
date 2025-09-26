
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';


// Cambia por el nombre real de tu tabla
const table = '[ECO].[Gateway]';


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

export async function insert(dto) {
    const pool = getPool();
    const now = new Date();
    console.log("DTO recibido en el repositorio:");
    console.log(dto);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('Marca', sql.NVarChar(20), dto.marca || null)
        .input('Referencia', sql.NVarChar(20), dto.referencia || null)
        .input('Serial', sql.NChar(20), dto.serial || null)
        .input('OS', sql.NChar(20), dto.os || null)
        .input('SSID', sql.NChar(20), dto.ssid || null)
        .input('MACWifi', sql.NChar(20), dto.macWifi || null)
        .input('MACEthernet', sql.NChar(20), dto.macEthernet || null);

    //console.log(rq);
    
    
    // Inserta y devuelve la fila recién creada
    const query = `
                INSERT INTO ${table} (  [Marca]
                                        ,[Referencia]
                                        ,[Serial]
                                        ,[OS]
                                        ,[SSID]
                                        ,[MAC_Wifi]
                                        ,[MAC_Ethernet])
                VALUES (@Marca, @Referencia, @Serial, @OS, @SSID, @MACWifi, @MACEthernet);


                SELECT *
                FROM ${table}
                WHERE Serial = '${dto.serial}';
                `;  // Devolver la fila insertada (SQL Server 2012+) en funcion del serial
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset[0];
}


export async function update(dto) {
    console.log("DTO recibido en el repositorio para actualizar:");
    console.log(dto);
    const pool = getPool();
    // Primero, obtener los datos actuales del nodo
            const getCurrentData = await pool
                .request()
                .input('GatewayId', sql.Int, dto.ID)
                .query(`SELECT * FROM ${table} WHERE ID_Gateway = @GatewayId`);
        
            const currentData = getCurrentData.recordset[0];
            
            if (!currentData) {
                throw new Error(`No se encontró el GatewayId con ID ${dto.ID}`);
            }
        
            console.log("Datos actuales del gateway:", currentData);
            
            // Mezclar los datos actuales con los nuevos datos del DTO
            const updatedData = {
                marca: dto.marca !== undefined ? dto.marca : currentData.Marca,
                referencia: dto.referencia !== undefined ? dto.referencia : currentData.Referencia,
                serial: dto.serial !== undefined ? dto.serial : currentData.Serial,
                os: dto.os !== undefined ? dto.os : currentData.OS,
                ssid: dto.ssid !== undefined ? dto.ssid : currentData.SSID,
                macWifi: dto.macWifi !== undefined ? dto.macWifi : currentData.MAC_Wifi,
                macEthernet: dto.macEthernet !== undefined ? dto.macEthernet : currentData.MAC_Ethernet
            };
            
            //console.log("Datos mezclados para actualizar:", updatedData);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('GatewayId', sql.Int, dto.ID)
        .input('Marca', sql.NVarChar(20), updatedData.marca)
        .input('Referencia', sql.NVarChar(20), updatedData.referencia)
        .input('Serial', sql.NChar(20), updatedData.serial)
        .input('OS', sql.NChar(20), updatedData.os)
        .input('SSID', sql.NChar(20), updatedData.ssid)
        .input('MACWifi', sql.NChar(20), updatedData.macWifi)
        .input('MACEthernet', sql.NChar(20), updatedData.macEthernet);

    
    // Inserta y devuelve la fila recién creada
    const query = `
                UPDATE ${table}
                SET Marca=@Marca, Referencia=@Referencia, Serial=@Serial, OS=@OS, SSID=@SSID, MAC_Wifi=@MACWifi, MAC_Ethernet=@MACEthernet
                WHERE ID_Gateway=@GatewayId;
                
                SELECT *
                FROM ${table}
                WHERE ID_Gateway = @GatewayId;
                `;
    
    const result = await rq.query(query);
    //console.log(result);

    return result.recordset[0];
}


export async function remove(dto) {
    console.log("El ID recibido para eliminar es:", dto); // Log del ID recibido
    
    const pool = getPool();
    const rq = pool.request();
    const query = `DELETE FROM ${table} WHERE ID_Gateway=${dto.ID}`;
    
    const result = await rq.query(query);
    //console.log(result);

    //console.log(result);
    return result;
}