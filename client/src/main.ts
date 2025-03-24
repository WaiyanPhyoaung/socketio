import { io } from "socket.io-client";
import {
  addListeners,
  createNamespaceElement,
  createRoomElement,
} from "./utils";
export const URL = "http://localhost:3000";

const listeners = {
  // this key must be same as server event
  nschange: [],
};

const namespacesContainer = <HTMLDivElement>(
  document.querySelector("#namespaces")
);
const roomListContainer = <HTMLUListElement>(
  document.querySelector("#room-list")
);

export const namespaceListSockets: any = [];

const socket = io(URL);

socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("namespaceList", (namespaceList) => {
  namespacesContainer.innerHTML = "";
  namespaceList.forEach((namespace: any) => {
    // DOM parts
    const namespaceElement = createNamespaceElement(
      namespacesContainer,
      namespace
    );

    // Socket parts
    const namespaceUrl = URL + namespace.endpoint;
    if (!namespaceListSockets[namespace.id]) {
      namespaceListSockets[namespace.id] = io(namespaceUrl);
      addListeners(namespaceListSockets, listeners, "nschange", namespace.id);
    }

    namespaceElement.addEventListener("click", () => {
      createRoomElement(roomListContainer, namespace);
    });
  });
  createRoomElement(roomListContainer, namespaceList[0]);
});
