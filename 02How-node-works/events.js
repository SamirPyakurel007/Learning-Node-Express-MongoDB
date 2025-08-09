const eventEmitter = require("events");
const http = require("http");

class sales extends eventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new sales();
myEmitter.on("newsale", () => {
  console.log("there was a new sale!");
});
myEmitter.on("newsale", () => {
  console.log("costumer name: samir");
});
myEmitter.on("newsale", (stock) => {
  console.log(`the stock is ${stock}`);
});
myEmitter.emit("newsale", 9);

/////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("request received");
  res.end("request received");
});
server.on("request", (req, res) => {
  console.log("another request received");
});
server.on("close", (req, res) => {
  res.end("request received");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("waiting for requests...");
});
