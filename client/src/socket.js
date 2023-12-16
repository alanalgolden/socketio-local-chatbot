import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");
export const userSocket = io("http://localhost:3000/user", {
  auth: { token: "test" },
});

socket.on("connect", () => {
  console.log(`You connected with id: ${socket.id}`);
});

userSocket.on("connect_error", (error) => {
  console.log(error);
});
