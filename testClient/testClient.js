import MultiplayerJSClient from "../client/index.js";

const client = new MultiplayerJSClient();

async function connectToServer() {
    await client.connect();
    
    client.on("hello", (data) => {
        console.log(data);
    });

    client.send("hello", "Hello from client!")
}

connectToServer();