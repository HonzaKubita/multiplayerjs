const { uuidv4, checkNameError } = require('../utils');
const gameManager = require('../modules/gameManager');
const { it } = require('node:test');

module.exports = class Player {
    constructor(socket) {
        this.socket = socket;

        // Generate uid
        this.id = uuidv4();

        // Initialize player variables
        this.name = "";
        this.lobbyCode = "";
        this.isMaster = false;

        // Bind socket events
        this.socket.on("joinLobby", this.joinLobby.bind(this));
        this.socket.on("hostLobby", this.hostLobby.bind(this));
        // Bind socket.ws close event
        this.socket.ws.on("close", this.leave.bind(this));
    }

    getSimplified() {
        return {
            id: this.id,
            name: this.name,
            lobbyCode: this.lobbyCode,
            isMaster: this.isMaster,
        };
    }

    send(eventName, data) {
        this.socket.send(eventName, data);
    }

    joinLobby(data) {
        const { lobbyCode, name } = data;
        // Check name
        const nameError = checkNameError(name);
        if (nameError) {
            this.socket.send("joinLobbyError", {error: nameError});
            return;
        }

        // Save the name
        this.name = name;

        // Join the lobby
        const joinError = gameManager.joinPlayerToGame(lobbyCode, this);
        if (joinError) {
            this.socket.send("joinLobbyError", {error: joinError});
        } else {
            // Send success message with players in the lobby (including this player)
            const players = gameManager.getGameByCode(lobbyCode).players
                .map(player => player.getSimplified())
                // .filter(player => player.id != this.id);
            this.socket.send("joinLobbySuccess", {players: players});
            // Save the lobby code
            this.lobbyCode = lobbyCode;
        }
    }

    hostLobby(data) {
        const { name } = data;

        // Check name
        const nameError = checkNameError(name);
        if (nameError) {
            this.socket.send("hostLobbyError", {error: nameError});
            return;
        }

        // Save the name
        this.name = name;

        // Create a new game
        const lobbyCode = gameManager.hostGame();

        // Save the lobby code
        this.lobbyCode = lobbyCode;

        // Set this player as the master
        this.isMaster = true;

        // Join the lobby (should not fail as the lobby was just created)
        gameManager.joinPlayerToGame(lobbyCode, this);
   
        // Send the lobby code back to the client
        this.socket.send("hostLobbySuccess", { lobbyCode });
    }

    leave() {
        // Remove the player from the game
        gameManager.removePlayerFromGame(this.lobbyCode, this.id);
    }
}