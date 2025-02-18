export class WSClient {
  private static instance: WSClient;
  private ws: WebSocket;

  private constructor() {
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  public static getInstance(): WSClient {
    if (!WSClient.instance) {
      WSClient.instance = new WSClient();
    }
    return WSClient.instance;
  }

  public sendCode(code: string): void {
    const message = JSON.stringify({
      type: 'code',
      data: code
    });
    this.ws.send(message);
  }

  public sendTerminalCommand(command: string): void {
    const message = JSON.stringify({
      type: 'terminal',
      data: command
    });
    this.ws.send(message);
  }

  public getWebSocket(): WebSocket {
    return this.ws;
  }
}

// Export the WebSocket instance
export const ws = WSClient.getInstance().getWebSocket();
