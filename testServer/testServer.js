const Server = require('../server');

const testServer = new Server();

testServer.listen(3000, () => console.log("Server listening on port 3000"));