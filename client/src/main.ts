import { io } from "socket.io-client";

const namespacesContainer = <HTMLDivElement>(
  document.querySelector("#namespaces")
);
const roomListContainer = <HTMLUListElement>(
  document.querySelector("#room-list")
);

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("namespace-lists", (data) => {
  console.log("namespace-lists", data);
  data.forEach((namespace: any) => {
    const namespaceElement = document.createElement("div");
    namespaceElement.className = "namespace";
    namespaceElement.setAttribute("ns", namespace.endpoint);
    const image = document.createElement("img");
    image.src = namespace.image;
    image.alt = namespace.name;
    namespaceElement.appendChild(image);

    namespaceElement.addEventListener("click", () => {
      roomListContainer.innerHTML = "";
      namespace.rooms.forEach((room: any) => {
        // <li><span class="glyphicon glyphicon-lock"></span>Main Room</li>
        const roomElement = document.createElement("li");
        const lockIcon = document.createElement("span");
        lockIcon.className = room.privateRoom
          ? "glyphicon glyphicon-lock"
          : "glyphicon glyphicon-globe";
        roomElement.className = "room";
        roomElement.textContent = room.name;
        roomElement.prepend(lockIcon);
        roomListContainer.appendChild(roomElement);
      });
    });
    namespacesContainer.appendChild(namespaceElement);
  });
});
