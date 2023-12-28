import MultiplayerJSClient from "../client/index.js";

const client = new MultiplayerJSClient();

// Html elements
const joinButton = document.getElementById("joinButton");
const hostButton = document.getElementById("hostButton");
const lobbyCodeInput = document.getElementById("lobbyCodeInput");
const nameInput = document.getElementById("nameInput");

const playerList = document.getElementById("playerList");

async function connectToServer() {
    await client.connect();

    hostButton.addEventListener("click", () => {
        client.hostLobby(nameInput.value);
    });

    joinButton.addEventListener("click", () => {
        client.joinLobby(lobbyCodeInput.value, nameInput.value);
    });

    client.on("joinLobbySuccess", (data) => {
        console.log("Joined lobby successfully");
        
        data.players.forEach(player => {
            const p = document.createElement("p");
            p.innerText = player.name;
            p.id = player.id;
            playerList.appendChild(p);
        });
    });

    client.on("playerJoined", (data) => {
        const p = document.createElement("p");
        p.innerText = data.player.name;
        p.id = data.player.id;
        playerList.appendChild(p);
    });

    client.on("playerLeft", (data) => {
        const p = document.getElementById(data.id);
        p.remove();
    });

}

connectToServer();