const pool = require('./db');
const redis = require('./redis');

async function insertAttacks(jsonData) {
    // * menghapus data
    truncateAttacks();

    const insertQuery = `
        INSERT INTO attacks (source_country, destination_country, millisecond, type, weight, attack_time)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const client = await pool.connect();

    try {
        for (const data of jsonData) {
            const values = [
                data.sourceCountry,
                data.destinationCountry,
                data.millisecond,
                data.type,
                data.weight,
                data.attackTime
            ];            

            await client.query(insertQuery, values);
        }

        console.log('Data inserted successfully');        
    } catch (error) {
        console.error('Error executing query', error.stack);
    } finally {
        client.release(); // Release the client back to the pool
    }
}

async function truncateAttacks() {
    const truncateQuery = 'TRUNCATE TABLE attacks RESTART IDENTITY';

    const client = await pool.connect();

    try {
        await client.query(truncateQuery);
        console.log('Table truncated/deleted successfully');
    } catch (error) {
        console.error('Error executing query', error.stack);
    } finally {
        client.release(); // Release the client back to the pool
    }
}

async function findBySourceAttackType(){
    const selectQuery = `
    SELECT source_country, type, COUNT(*) AS jumlah
    FROM attacks
    GROUP BY source_country, type
    ORDER BY source_country;
    `;

    const client = await pool.connect();
    try{
        const result = await client.query(selectQuery);
        client.release();
        return result.rows;
    }catch(error){
        throw new Error(error);
    }
}

async function findByDestinationAttackType(){
    const selectQuery = `
    SELECT destination_country, type, COUNT(*) AS jumlah
    FROM attacks
    GROUP BY destination_country, type
    ORDER BY destination_country;
    `;

    const client = await pool.connect();
    try{
        const result = await client.query(selectQuery);
        client.release();
        return result.rows;
    }catch(error){
        throw new Error(error);
    }
}


async function getDataSourceTypeWithCache(source) {
    const redisKey = `dataSourceType:${source}`;
    
    try {                
        // Cek apakah data ada di Redis cache                
        const cachedData = await redis.get(redisKey);        
  
        if (cachedData) {
            console.log('Data diambil dari Redis cache');
            return JSON.parse(cachedData);
        } else {
            console.log('Data diambil dari Database');
            // Jika data tidak ada di cache, ambil dari PostgreSQL
            const dataFromPostgres = await getDataSourceType(source);
    
            // Simpan data ke Redis cache
            await redis.set(redisKey, JSON.stringify(dataFromPostgres));

            // Simpan data ke Redis cache dengan waktu kedaluwarsa 1 jam
            await redis.expire(redisKey, 3600);
    
            return dataFromPostgres;
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
  }

async function getDataSourceType(source){
    const selectQuery = `
    SELECT source_country, type, COUNT(*) AS jumlah
    FROM attacks WHERE source_country = $1
    GROUP BY source_country, type
    ORDER BY source_country;
    `;

    const client = await pool.connect();
    try{
        const result = await client.query(selectQuery, [source]);        
        return result.rows;
    }catch(error){
        throw new Error(error);
    }finally{
        client.release();
    }
}

async function getDataDestinationTypeWithCache(destination) {
    const redisKey = `dataDestinationType:${destination}`;
    
    try {                
        // Cek apakah data ada di Redis cache                
        const cachedData = await redis.get(redisKey);        
  
        if (cachedData) {
            console.log('Data diambil dari Redis cache');
            return JSON.parse(cachedData);
        } else {
            console.log('Data diambil dari Database');
            // Jika data tidak ada di cache, ambil dari PostgreSQL
            const dataFromPostgres = await getDataDestinationType(destination);
    
            // Simpan data ke Redis cache
            await redis.set(redisKey, JSON.stringify(dataFromPostgres));

            // Simpan data ke Redis cache dengan waktu kedaluwarsa 1 jam
            await redis.expire(redisKey, 3600);
    
            return dataFromPostgres;
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function getDataDestinationType(destination){
    const selectQuery = `
    SELECT destination_country, type, COUNT(*) AS jumlah
    FROM attacks WHERE destination_country = $1
    GROUP BY destination_country, type
    ORDER BY destination_country;
    `;

    const client = await pool.connect();
    try{
        const result = await client.query(selectQuery, [destination]);
        client.release();
        return result.rows;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {insertAttacks, findBySourceAttackType, findByDestinationAttackType, getDataSourceType:getDataSourceTypeWithCache, getDataDestinationType:getDataDestinationTypeWithCache};