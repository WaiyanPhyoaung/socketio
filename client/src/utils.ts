export function createNamespaceElement(
  container: HTMLDivElement,
  namespace: any
) {
  const namespaceElement = document.createElement("div");
  namespaceElement.className = "namespace";
  namespaceElement.setAttribute("ns", namespace.endpoint);
  const image = document.createElement("img");
  image.src = namespace.image;
  image.alt = namespace.name;
  namespaceElement.appendChild(image);

  container.appendChild(namespaceElement);
  return namespaceElement;
}

export function createRoomElement(
  roomListContainer: HTMLUListElement,
  room: any
) {
  const roomElement = document.createElement("li");
  const lockIcon = document.createElement("span");
  lockIcon.className = room.privateRoom
    ? "fa-solid fa-lock"
    : "fa-solid fa-globe";
  roomElement.className = "room";
  roomElement.textContent = room.name;
  roomElement.prepend(lockIcon);

  roomListContainer.appendChild(roomElement);
  return roomElement;
}
export function addListeners(
  sockets: any,
  listeners: Record<string, any>,
  listenerName: string,
  namespaceId: number,
  cb: (data: any) => void
) {
  if (listeners[listenerName][namespaceId]) return;

  sockets[namespaceId].on(listenerName, (data: any) => {
    cb(data);
  });

  listeners[listenerName][namespaceId] = true;
}
