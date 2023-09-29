const WebSocket = require('ws');

function callmeWebSocket(server) {
    let ws;
  
    function fetchDataAndSendToClient(client) {
      fetch('https://livethreatmap.radware.com/api/map/attacks?limit=10')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Sending data to client...');
          if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data), (error) => {
              if (error) {
                console.error('Error sending data to client:', error);
              }
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  
    function startDataFetchingInterval() {
      setInterval(() => {
        if (ws && ws.clients) {
          ws.clients.forEach((client) => {
            fetchDataAndSendToClient(client);
          });
        }
      }, 3 * 60 * 1000); // Memfetch data setiap 3 menit
    }
  
    ws = new WebSocket.Server({ server });
  
    ws.on('connection', (client) => {
      console.log('Client connected.');
  
      // Mengirim data saat klien pertama kali terhubung
      fetchDataAndSendToClient(client);
  
      client.on('close', () => {
        console.log('Client disconnected.');
      });
    });
  
    startDataFetchingInterval(); // Memulai interval pemanggilan fetchDataAndSendToClient
  }
  
  module.exports = {
    callmeWebSocket,
  };