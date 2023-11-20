const net = require("net");
const readLine = require("readline/promises");
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const PORT = 3008;

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;
let username;
const socket = net.createConnection(
  { host: "127.0.0.1", port: PORT },
  async () => {
    console.log("Connected to server");
    const askUserName = async () => {
      username = await rl.question("choose a username$ ");
      await moveCursor(0, -1);
      await clearLine(0);
      ask();
    };
    askUserName();
    const ask = async () => {
      const message = await rl.question(`Enter a message as -${username}-$ `);
      await moveCursor(0, -1);
      await clearLine(0);
      if (message === "exit") {
        socket.write(`${id}-${username}-left-the-chat-room!`);
        socket.end();
      } else {
        socket.write(`${id}-${username}-message-${message}`);
      }
    };
    socket.on("data", async (data) => {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      if (data.toString().substring(0, 3) === "id-") {
        id = data.toString().substring(3);
        console.log(`Your id is ${id}\n`);
      } else {
        console.log(data.toString());
      }
      ask();
    });
    socket.on("end", async () => {
      await clearLine(0);
      console.log(` you left the chat room`);
    });
  }
);
