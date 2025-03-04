export class WSClient {
  private static instance: WSClient;
  private ws: WebSocket;

  private constructor() {
    if (process.env.WS_URL) {
      this.ws = new WebSocket(process.env.WS_URL);
    } else {
      throw new Error('WebSocket URL is not defined in environment variables');
    }

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

  public sendTest(code: string, testCases: TestCase[]): void {
    const formattedTestCases = testCases.map(testCase => [testCase.input, testCase.expectedOutput]);
  
    const message = JSON.stringify({
      type: 'test',
      data: {
        code: code,
        testCases: formattedTestCases
      }
    });
  
    this.ws.send(message);
  }

  public getWebSocket(): WebSocket {
    return this.ws;
  }
}

/* LOOKINTO: Temporary fix as I cannot import Testcase from the features folder */
interface TestCase {
  input: string;
  expectedOutput: string;
}

// Export the WebSocket instance
export const ws = WSClient.getInstance().getWebSocket();
