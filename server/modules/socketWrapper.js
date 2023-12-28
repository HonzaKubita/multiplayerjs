module.exports = class SocketWrapper {
    constructor(ws) {
        this.callbacks = {};

        this.ws = ws;

        ws.on('message', message => {
            this.processMessage(message);
        });
    }

    on(eventName, callback) {
        if (!this.callbacks[eventName]) {
            this.callbacks[eventName] = [];
        }
        this.callbacks[eventName].push(callback);
    }

    removeCallback(eventName, callback) {
        this.callbacks[eventName] = this.callbacks[eventName].filter(cb => cb !== callback);
    }

    send(eventName, data) {
        this.ws.send(JSON.stringify({ eventName, data }));
    }

    processMessage(message) {
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);

        const { eventName, data } = parsedMessage;

        if (this.callbacks[eventName]) {
            this.callbacks[eventName].forEach(callback => {
                callback(data);
            });
        }
    }
}