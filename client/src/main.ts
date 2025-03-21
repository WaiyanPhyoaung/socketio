import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const form = <HTMLFormElement>document.querySelector("#chat-submit");
const messageBox = <HTMLUListElement>document.querySelector("#message-box");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = <HTMLInputElement>document.querySelector("#message");
  const message = input.value;
  if (message) {
    socket.emit("message-from-client", { text: message });
    input.value = "";
  }
});

socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("message-from-server", (data: { text: string }) => {
  const newMessage = document.createElement("li");
  newMessage.textContent = data.text;
  messageBox.appendChild(newMessage);
});
