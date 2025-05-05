import { app } from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "socket.io";
import { createServer } from "http";
import { initializeSocket } from "./app/socket/index.socket";

// let io;
let server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = createServer(app);

    server.listen(config.port, () => {
      console.log(`Example app listening on  ${config.port}`);
    });
    initializeSocket(server);
  } catch (err) {
    console.error(
      "Error connecting to the database or starting the server:",
      err
    );
  }
}

main();
