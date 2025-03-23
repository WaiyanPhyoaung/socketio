import { io } from "socket.io-client";
export const URL = "http://localhost:3000";

const namespacesContainer = <HTMLDivElement>(
  document.querySelector("#namespaces")
);
const roomListContainer = <HTMLUListElement>(
  document.querySelector("#room-list")
);

const socket = io(URL);

socket.on("connect", () => {
  console.log("connected to server");
});

// wikiSocket.on("connect", () => {
//   console.log("connected to wiki server");
// });
// wikiSocket.on("addRoom", (ns) => {
//   console.log(ns);
// });

socket.on("messageFromWikiNamespace", (data) => {
  console.log("data", data);
});

socket.on("fromChatRoom", (data) => {
  console.log("room data", data);
});

socket.on("namespace-lists", (data) => {
  console.log("namespace-lists", data);
  createNamespaceElement(namespacesContainer, data);
});

function createNamespaceElement(
  container: HTMLDivElement,
  namespaceLists: any
) {
  container.innerHTML = "";
  namespaceLists.forEach((namespace: any) => {
    // creating namespaces dynamically
    const namespaceUrl = URL + namespace.endpoint;
    console.log(namespaceUrl);
    const thisNs = io(namespaceUrl);
    thisNs.on("addRoom", (addedRoomNamespace) => {
      console.log("new room received");
      createRoomElement(roomListContainer, addedRoomNamespace);
    });
    const namespaceElement = document.createElement("div");
    namespaceElement.className = "namespace";
    namespaceElement.setAttribute("ns", namespace.endpoint);
    const image = document.createElement("img");
    image.src = namespace.image;
    image.alt = namespace.name;
    namespaceElement.appendChild(image);

    namespaceElement.addEventListener("click", () => {
      createRoomElement(roomListContainer, namespace);
    });
    container.appendChild(namespaceElement);
  });
  createRoomElement(roomListContainer, namespaceLists[0]);
}

function createRoomElement(container: HTMLUListElement, namespace: any) {
  container.innerHTML = "";
  namespace.rooms.forEach((room: any) => {
    const roomElement = document.createElement("li");
    const lockIcon = document.createElement("span");
    lockIcon.className = room.privateRoom
      ? "glyphicon glyphicon-lock"
      : "glyphicon glyphicon-globe";
    roomElement.className = "room";
    roomElement.textContent = room.name;
    roomElement.prepend(lockIcon);
    container.appendChild(roomElement);
  });
}
