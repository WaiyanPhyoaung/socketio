import { io } from "socket.io-client";

console.log("Hello from main.ts", io);

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected to server");
});
socket.emit("from-client", "Hello from client!");
