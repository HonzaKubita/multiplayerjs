const WebSocket = require('ws');
const gameManager = require('./gameManager');
const SocketWrapper = require('./socketWrapper');
const Player = require('../models/player');

const util = require('util');

function getWebSocketServer(server) {
    const wss = new WebSocket.Server({ noServer: true });

    // When a client connects, listen for messages
    wss.on('connection', (ws) => {
        console.log("WS Client connected");

        // Create a wrapper for the socket
        const socket = new SocketWrapper(ws);

        // Create a player with this socket (player will handle socket events)
        const player = new Player(socket);

        gameManager.players[player.id] = player;
    });

    wss.on('close', (ws) => {
        console.log("WS Client disconnected");
    });

    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    return wss;
}

module.exports = { getWebSocketServer };