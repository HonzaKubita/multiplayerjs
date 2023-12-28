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
        this.send("joinLobby", { lobbyCode, name });
    }

    hostLobby(name) {
        this.send("hostLobby", { name });
    }
}