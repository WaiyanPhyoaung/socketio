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
  messages: [],
};

const namespacesContainer = <HTMLDivElement>(
  document.querySelector("#namespaces")
);
const roomListContainer = <HTMLUListElement>(
  document.querySelector("#room-list")
);
const currentRoom = <HTMLSpanElement>document.querySelector("#current-room");
const userCount = <HTMLSpanElement>document.querySelector("#user-count");
const messageForm = <HTMLFormElement>document.querySelector("#message-form");
const userMessage = <HTMLInputElement>document.querySelector("#user-message");

export const namespaceListSockets: any = [];

const socket = io(URL);
let namespaceLists: any = [];

socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("namespaceList", (namespaceList) => {
  namespacesContainer.innerHTML = "";

  roomListContainer.innerHTML = "";
  //first time default namespace and rooms
  namespaceList[0].rooms.forEach((room: any) => {
    const roomElement = createRoomElement(roomListContainer, room);
    roomElement.addEventListener("click", () => {
      joinRoom(namespaceList[0].id, room.name);
    });
  });
  namespaceLists = namespaceList;

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
      addListeners(namespaceListSockets, listeners, "messages", namespace.id);
    }

    namespaceElement.addEventListener("click", () => {
      roomListContainer.innerHTML = "";
      const newUrl = window.location.origin + namespace.endpoint;
      window.history.pushState({ path: namespace.endpoint }, "", newUrl);

      joinRoom(namespace.id, namespace.rooms[0].name);
      namespace.rooms.forEach((room: any) => {
        const roomElement = createRoomElement(roomListContainer, room);
        roomElement.addEventListener("click", () => {
          joinRoom(namespace.id, room.name);
        });
      });
    });
  });

  joinRoom(namespaceList[0].id, namespaceList[0].rooms[0].name);
});

messageForm.onsubmit = (event) => {
  event.preventDefault();

  const currentNamespace = namespaceLists.find(
    (namespace: any) => namespace.endpoint === window.location.pathname
  );
  if (!currentNamespace) return;

  namespaceListSockets[currentNamespace.id].emit(
    "new-message",
    userMessage.value
  );

  userMessage.value = "";
};

export async function joinRoom(namespaceID: number, roomTitle: string) {
  // everything from ackCB get as result
  const ack = await namespaceListSockets[namespaceID].emitWithAck(
    "joinroom",
    roomTitle
  );
  currentRoom.textContent = roomTitle;
  userCount.textContent = ack.numberOfUsers;
}
