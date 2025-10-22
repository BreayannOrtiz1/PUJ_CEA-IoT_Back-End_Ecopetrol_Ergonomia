
// Acceso a datos (SQL puro parametrizado para evitar inyecciones)
import { getPool, sql } from '../config/db.js';

const table = '[ECO].[Gateway]';


export async function insert(dto) {
    const pool = getPool();
    const now = new Date();
    console.log("DTO recibido en el repositorio:");
    console.log(dto);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('Marca', sql.NVarChar(20), dto.marca || null)
        .input('Referencia', sql.NVarChar(50), dto.referencia || null)
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
                Marca: dto.Marca !== undefined ? dto.Marca : currentData.Marca,
                Referencia: dto.Referencia !== undefined ? dto.Referencia : currentData.Referencia,
                Serial: dto.Serial !== undefined ? dto.Serial : currentData.Serial,
                OS: dto.OS !== undefined ? dto.OS : currentData.OS,
                SSID: dto.SSID !== undefined ? dto.SSID : currentData.SSID,
                MAC_Wifi: dto.MAC_Wifi !== undefined ? dto.MAC_Wifi : currentData.MAC_Wifi,
                MAC_Ethernet: dto.MAC_Ethernet !== undefined ? dto.MAC_Ethernet : currentData.MAC_Ethernet
            };
            
            //console.log("Datos mezclados para actualizar:", updatedData);
    //Construye request con parámetros tipados
    const rq = pool
        .request()
        .input('GatewayId', sql.Int, dto.ID)
        .input('Marca', sql.NVarChar(20), updatedData.Marca)
        .input('Referencia', sql.NVarChar(50), updatedData.Referencia)
        .input('Serial', sql.NChar(20), updatedData.Serial)
        .input('OS', sql.NChar(20), updatedData.OS)
        .input('SSID', sql.NChar(20), updatedData.SSID)
        .input('MACWifi', sql.NChar(20), updatedData.MAC_Wifi)
        .input('MACEthernet', sql.NChar(20), updatedData.MAC_Ethernet);

    
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
    console.log(result.recordset[0]);

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