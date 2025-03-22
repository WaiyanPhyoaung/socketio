class Room {
  private namespaceId: string = "";
  constructor(
    private id: number,
    private name: string,
    private privateRoom: boolean = false,
    private history: string[] = []
  ) {}

  public setNamespaceId(namespaceId: string) {
    this.namespaceId = namespaceId;
  }

  public addMessage(message: string) {
    this.history.push(message);
  }

  public clearHistory() {
    this.history = [];
  }
}
export default Room;
