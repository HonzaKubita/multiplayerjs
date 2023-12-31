export default class MultiplayerJSClient {
    constructor() {
        this.socket = null;
        
        this.callbacks = {
            // eventName: [callback, callback, ...]
        };

        this.playerId = null;

        this.on("playerId", (data) => {
            console.log(`[MultiplayerJS] Received playerId: ${data.playerId}`)
            this.playerId = data.playerId;
        });
    }

    on(eventName, callback) {
        if (!this.callbacks[eventName]) {
            this.callbacks[eventName] = [];
        }

        this.callbacks[eventName].push(callback);
    }

    removeCallback(eventName, callback) {
        if (!this.callbacks[eventName]) {
            return;
        }

        this.callbacks[eventName] = this.callbacks[eventName].filter(cb => cb !== callback);
    }

    connect(url = `ws://${window.location.hostname}:3000`) {
        console.log(`[MultiplayerJS] Connecting to server... (${url})`);
        this.socket = new WebSocket(url);

        this.socket.onmessage = (event) => {
            const { eventName, data } = JSON.parse(event.data);

            if (this.callbacks[eventName]) {
                this.callbacks[eventName].forEach(callback => {
                    callback(data);
                });
            }
        };

        this.socket.onclose = () => {
            console.log("[MultiplayerJS] Connection closed");
        }

        return new Promise((resolve, reject) => {
            this.socket.onopen = () => {
                console.log("[MultiplayerJS] Connection successful");
                resolve();
            };

            this.socket.onerror = (error) => {
                console.error("[MultiplayerJS] Connection failed");
                reject(error);
            };
        });
    }

    send(eventName, data) {
        const payload = { eventName, data };
        console.log(payload);
        this.socket.send(JSON.stringify(payload));
    }

    joinLobby(lobbyCode, name) {
        // Prepare callbacks
        const joinLobbySuccess = (data) => {
            this.removeCallback("joinLobbySuccess", joinLobbySuccess);
            this.removeCallback("joinLobbyError", joinLobbyError);

            return data.players;
        };

        const joinLobbyError = (data) => {
            this.removeCallback("joinLobbySuccess", joinLobbySuccess);
            this.removeCallback("joinLobbyError", joinLobbyError);

            throw new Error(data.error);
        };

        this.on("joinLobbySuccess", joinLobbySuccess);
        this.on("joinLobbyError", joinLobbyError);

        this.send("joinLobby", { lobbyCode, name });
    }

    hostLobby(name) {
        // Prepare callbacks
        const hostLobbySuccess = (data) => {
            this.removeCallback("hostLobbySuccess", hostLobbySuccess);
            this.removeCallback("hostLobbyError", hostLobbyError);

            return data.lobbyCode;
        };

        const hostLobbyError = (data) => {
            this.removeCallback("hostLobbySuccess", hostLobbySuccess);
            this.removeCallback("hostLobbyError", hostLobbyError);

            throw new Error(data.error);
        };

        this.on("hostLobbySuccess", hostLobbySuccess);
        this.on("hostLobbyError", hostLobbyError);

        this.send("hostLobby", { name });
    }

    startGame() {
        // Prepare callbacks
        const startGameSuccess = (data) => {
            this.removeCallback("startGameSuccess", startGameSuccess);
            this.removeCallback("startGameError", startGameError);
        };

        const startGameError = (data) => {
            this.removeCallback("startGameSuccess", startGameSuccess);
            this.removeCallback("startGameError", startGameError);

            throw new Error(data.error);
        };

        this.on("startGameSuccess", startGameSuccess);
        this.on("startGameError", startGameError);

        this.send("startGame", {});
    }
}