const net = require("net");
const server = net.createServer();
const PORT = 3008;

const clients = [];

server.on("connection", (socket) => {
  const clientId = clients.length + 1;

  clients.push({ id: clientId.toString(), socket: socket });
  console.log(`User ${clientId} Join the chat app!`);
  socket.write(`Your id is ${clientId}\n`);
  clients.map((client) => {
    client.socket.write(`User ${clientId} Join the chat app!`);
  });

  socket.on("data", (data) => {
    if (data.toString().endsWith("left-the-chat-room!")) {
      const id = data.toString().substring(0, data.toString().indexOf("-"));
      const username = data
        .toString()
        .substring(
          data.toString().indexOf("-") + 1,
          data.toString().indexOf("-left-")
        );
      console.log(`User-${id}-username: ${username} has Left the chat room!`);
      clients.map((client) => {
        client.socket.write(
          `>User-${id}-username(${username}) left the chat room!`
        );
      });
    } else {
      const id = data.toString().substring(0, data.toString().indexOf("-"));
      const username = data
        .toString()
        .substring(
          data.toString().indexOf("-") + 1,
          data.toString().indexOf("-message-")
        );
      const message = data
        .toString()
        .substring(data.toString().indexOf("-message-") + 9);
      clients.map((client) => {
        client.socket.write(`>User-${id}-username(${username}): ${message}`);
      });
    }
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Server listening on port ${PORT}`, server.address());
});
