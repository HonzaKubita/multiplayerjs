const Game = require("../models/game");
const settings = require("./settings");

module.exports = {
    players: [], // Array for dumping players that are not in any game yet

    games: {
        // lobbyCode: Game
    },

    getGameByCode(lobbyCode) {
        return this.games[lobbyCode];
    },

    hostGame() {
        const lobbyCode = Math.random().toString(36).substring(2, settings.lobbyCodeLength + 2).toUpperCase();
        // Check if game with this code already exists
        if (this.games[lobbyCode]) {
            return this.hostGame();
        }

        this.games[lobbyCode] = new Game(lobbyCode);

        console.log(`Game hosted with code ${lobbyCode}`);

        return lobbyCode;
    },

    joinPlayerToGame(lobbyCode, player) {
        const game = this.games[lobbyCode];

        if (!game) {
            return "Game does not exist";
        }

        if (game.players.length >= settings.maxPlayers) {
            return "Game is full";
        }

        if (game.gameState !== "inLobby") {
            return "This lobby is not joinable anymore";
        }

        game.addPlayer(player);
        return null;
    },

    removePlayerFromGame(lobbyCode, playerId) {
        const game = this.games[lobbyCode];

        if (!game) {
            return "Game does not exist";
        }

        game.removePlayer(playerId);

        // If the game is empty, delete it
        if (game.players.length === 0) {
            delete this.games[lobbyCode];
        }

        return null;
    },

    startGame(lobbyCode) {
        const game = this.games[lobbyCode];

        if (!game) {
            return "Game does not exist";
        }

        if (game.players.length < settings.minPlayers) {
            return "Not enough players to start the game";
        }

        game.start();
        return null;
    }
}