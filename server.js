const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const http = require('http');

const { callmeWebSocket  } = require('./controller/mapController');


const app = require('./app');
const server = http.createServer(app);

// * Mengatur dan Memulai interval pengambilan data WebSocket
callmeWebSocket(server);

const port = 5000;
server.listen(port, () =>{
  console.log(`App running on port http://127.0.0.1:${port}`);
});

// ERROR HANDLING 
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLE REJECTION! 🔥 Shutting down...');
    server.close(() => {
      process.exit(1);
    });
});