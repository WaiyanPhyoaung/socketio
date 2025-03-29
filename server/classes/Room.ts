export type MessageObj = { message: string; username: string; date: string };
class Room {
  public namespaceId: string = "";
  constructor(
    public id: number,
    public name: string,
    public privateRoom: boolean = false,
    public history: MessageObj[] = []
  ) {}

  public setNamespaceId(namespaceId: string) {
    this.namespaceId = namespaceId;
  }

  public addMessage(message: MessageObj) {
    this.history.push(message);
  }

  public clearHistory() {
    this.history = [];
  }
}
export default Room;
