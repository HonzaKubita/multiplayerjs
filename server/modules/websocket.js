const WebSocket = require('ws');

function getWebSocketServer(server) {
    const wss = new WebSocket.Server({ noServer: true });

    // When a client connects, listen for messages
    wss.on('connection', (socket) => {
        console.log("WS Client connected");

        socket.on('message', message => {
            const { eventName, data } = JSON.parse(message);
            
            console.log(`event: ${eventName}, data: ${data}`);
        });
    });

    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    return wss;
}

module.exports = { getWebSocketServer };