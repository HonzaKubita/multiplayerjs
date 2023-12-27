export default class MultiplayerJSClient {
    constructor() {
        this.socket = null;
        
        this.callbacks = {
            // eventName: [callback, callback, ...]
        };
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

    connect() {
        console.log(`[MultiplayerJS] Connecting to server... (ws://${window.location.hostname}:3000/)`);
        this.socket = new WebSocket(`ws://${window.location.hostname}:3000/`);

        this.socket.onmessage = (event) => {
            const { eventName, data } = JSON.parse(event.data);

            if (this.callbacks[eventName]) {
                this.callbacks[eventName].forEach(callback => {
                    callback(data);
                });
            }
        };

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
        this.socket.send(JSON.stringify({ eventName, data }));
    }

    joinLobby(lobbyCode) {
        this.send("joinLobby", { lobbyCode });
    }
}