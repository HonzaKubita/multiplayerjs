const express = require("express");
const { getWebSocketServer } = require('./modules/websocket');
const settings = require('./modules/settings');

module.exports = class MultiplayerJSServer {
    constructor() {
        // Create an Express app
        this.app = express();

        this.wss = null;
        this.server = null;

        this.settings = settings;
    }

    static() {
        this.app.use(express.static("public"));
    }

    listen(port, callback) {
        // Start the express app
        this.server = this.app.listen(port, callback);

        // Create a WebSocket server
        this.wss = getWebSocketServer(this.server);
    }
}