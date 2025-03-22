import type Room from "./Room";

interface NamespaceInterface {
  id: string;
  name: string;
  image: string;
  endpoint: string;
  rooms: Room[];
}

class Namespace {
  constructor(
    private id: string,
    private name: string,
    private image: string,
    private endpoint: string,
    private rooms: Room[] = []
  ) {}

  public addRoom(room: Room) {
    // Add room to the namespace
    room.setNamespaceId(this.id);
    this.rooms.push(room);
  }
}
export default Namespace;
