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
      const removeUser = activeUsers[index];
      socket.to(removeUser.socketId).emit("disconnectUser", removeUser);
      activeUsers.splice(index, 1);
      if (removeUser) {
        fetch("http://localhost:5000/api/v1/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: removeUser._id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              activeUsers.forEach((activeUser) => {
                socket.to(activeUser.socketId).emit("online", activeUsers);
              });
            }
          });
      }
    }
  });
};
