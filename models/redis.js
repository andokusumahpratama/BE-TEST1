const redis = require('redis');

// Konfigurasi koneksi Redis
const redisClient = redis.createClient({    
    socket: {
        port: process.env.PORT_REDIS,       
        host: process.env.HOST_REDIS, 
    } 
});

(async () => {
    // Connect to redis server
    await redisClient.connect();
})();

// Tunggu hingga koneksi berhasil
redisClient.on('connect', () => {
    console.log('Koneksi Redis berhasil.');
});
  
// Tangani kesalahan koneksi
redisClient.on('error', (error) => {
    console.error('Koneksi Redis gagal:', error);
});
  

module.exports = redisClient;