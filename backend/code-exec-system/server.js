require('dotenv').config();
const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');
const fs = require('fs');
const uuid = require('uuid');

console.log(process.env.WS_PORT)

const wss = new WebSocket.Server({ port: parseInt(process.env.WS_PORT) });

const currentWorkingDirectory = process.cwd();

wss.on('connection', (ws) => {
    // Assign a unique identifier for the client. This is used 
    // for the python file name.
    ws.id = uuid.v4();
    
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });

    // Turns off echo for inputs on ptyProcess
    ptyProcess.write('stty -echo\n');

    ptyProcess.on('data', (data) => {
      process.stdout.write(data);
      ws.send(data);
    });

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      /* 
      You have two types of input:
      1. Code: Passes in <data> that is expected to be some Python code. What
                we then do is save the data to a file and execute it via 
                python3. Note that we have a listenere on ptyProcess such 
                that it immediately writes to the websocket upon receiving data.
      2. Terminal: This is for command/inputs that is directly executed on the
                terminal like ls. This is also used for user inputs on a currently
                running program.
      3. Test: Passes in both the code and test cases. We write these in a file and run 
                tester.py with these as arguments. It will print the result on ptyProcess 
                which sends the data back to the websocket.
      */
      if (parsedMessage.type === "code") {
        compileCode(parsedMessage.data);
        ptyProcess.write(`timeout 5s python3 ${currentWorkingDirectory}/${ws.id}.py\n`);

      } else if (parsedMessage.type === "terminal") {
        ptyProcess.write(parsedMessage.data + '\n');
      } else if (parsedMessage.type === "test") {
        const { code, testCases } = parsedMessage.data;
        
        // Save the code to a temporary Python file
        fs.writeFileSync(`${ws.id}_test.py`, code, 'utf8');
        
        // Create a JSON file with the test cases
        fs.writeFileSync(`${ws.id}_testcases.json`, JSON.stringify(testCases), 'utf8');
        
        // Run the tester script
        const command = `python3 ${currentWorkingDirectory}/tester.py ${currentWorkingDirectory}/${ws.id}_test.py ${currentWorkingDirectory}/${ws.id}_testcases.json\n`;
        
        ptyProcess.write(command);
      }
    });

    // LOOKINTO: When a user runs another program while a program is still
    // running, it should kill the current running program.

    // LOOKINTO: Introduce timeouts.
    ws.on('close', () => {
        console.log('Client disconnected');
        // Delete the file for 
        const filesToDelete = [
          `${ws.id}.py`,
          `${ws.id}_test.py`,
          `${ws.id}_testcases.json`
        ];
        
        filesToDelete.forEach(file => {
          fs.unlink(file, (err) => {
            if (err) {
              console.error(`Error deleting file ${file}: ${err}`);
            } else {
              console.log(`File ${file} has been successfully deleted`);
            }
          });
        });
        
        
        ptyProcess.kill();
    });
    /* 
    ============== HELPER METHODS ==============
    */
    function compileCode(data) {
      // Save the code to a Python file and run it
      fs.writeFileSync(`${ws.id}.py`, data, 'utf8');
      console.log(`Code saved to ${ws.id}.py`);
    }
});

console.log(`WebSocket server running on port ${process.env.WS_PORT}`);
