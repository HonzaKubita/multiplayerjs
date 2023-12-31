module.exports = class Game {
    constructor(lobbyCode) {
        this.lobbyCode = lobbyCode;
        this.players = [];
        this.gameState = "inLobby"; // inLobby is default when the game is created
    }

    // ws functions
    send(playerId, eventName, data) {
        this.players.forEach(player => {
            if (player.id == playerId) {
                player.send(eventName, data);
            }
        });
    }

    broadcast(eventName, data, excludePlayerId = "") {
        this.players.forEach(player => {
            if (player.id != excludePlayerId) {
                player.send(eventName, data);
            }
        });
    }

    // game functions
    addPlayer(player) {
        this.players.push(player);
        this.broadcast("playerJoined", {player: player.getSimplified()}, player.id);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id != playerId);
        this.broadcast("playerLeft", { playerId: playerId });
    }

    start() {
        this.gameState = "inGame";
        this.broadcast("gameStarted", {});
    }

    end() {
        this.gameState = "end";
        this.broadcast("gameEnded", { /* TODO: add game results */ });
    }
}