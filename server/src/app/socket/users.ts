import { Socket } from "socket.io";

interface ActiveUser {
  _id: string;
  email: string;
  iat: number;
  exp: number;
  socketId: string;
}

export const activeUsers: ActiveUser[] = [];
export const users = (socket: Socket) => {
  socket.on("getUser", (data: Omit<ActiveUser, "socketId">) => {
    const userExists = activeUsers.find((user) => user.email === data.email);
    if (!userExists) {
      activeUsers.push({ ...data, socketId: socket.id });
    }
    activeUsers.forEach((activeUser) => {
      socket.to(activeUser.socketId).emit("online", activeUsers);
    });
  });

  socket.on("disconnect", () => {
    const index = activeUsers.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      activeUsers.splice(index, 1);
    }
    activeUsers.forEach((activeUser) => {
      socket.to(activeUser.socketId).emit("online", activeUsers);
    });
  });
};
