import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { activeUsers, users } from "./users";

let io: SocketIOServer;

export function initializeSocket(server: HTTPServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New connection");

    users(socket);

    socket.on("message", (data) => {
      const findUser = activeUsers?.find(
        (user) => user._id === data.receiverId
      );
      socket.to(findUser?.socketId as string).emit("message", data);
    });

    socket.on("deleteForEveryone", (data) => {
      const findUser = activeUsers?.find(
        (user) => user._id === data.receiverId
      );
      console.log(findUser);
      socket.to(findUser?.socketId as string).emit("deleteForEveryone", data);
    });

    socket.on("conversation", (data) => {
      const findUser = activeUsers?.find(
        (user) => user._id === data.receiverId
      );
      socket.to(findUser?.socketId as string).emit("conversation", data);
    });

    socket.on("online", () => {
      socket.emit("online", activeUsers);
    });

    socket.on("typing", (data) => {
      activeUsers.forEach((activeUser) => {
        socket.to(activeUser.socketId).emit("typing", data);
      });
    });

    // Add your socket event listeners here
    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });

  return io;
}
