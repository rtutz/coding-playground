import { FitAddon } from "@xterm/addon-fit";
// import { useEffect } from 'react'
import { useEffect } from "react";
import { useXTerm } from "react-xtermjs";
import { ws, WSClient } from "@/lib/ws-client";

const Terminal: React.FC = () => {
    const { instance, ref } = useXTerm();
    const fitAddon = new FitAddon();
    const wsClient = WSClient.getInstance();

    useEffect(() => {
        instance?.loadAddon(fitAddon);
        const rows = Math.ceil(document.body.clientHeight / (16 * 2));
        const cols = Math.ceil(document.body.clientWidth / (8 * 2));
        instance?.resize(cols, rows);
        console.log(rows, cols);

        let currentCommand = "";

        const disposable = instance?.onKey(({ key, domEvent }) => {
            const printable =
                !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

            if (domEvent.keyCode === 13) {
                // Enter key
                instance.write("\r\n");
                wsClient.sendTerminalCommand(currentCommand);
                currentCommand = "";
            } else if (domEvent.keyCode === 8) {
                // Backspace key
                if (currentCommand !== "") {
                    instance.write("\b \b");
                    currentCommand = currentCommand.slice(0, -1);
                }
            } else if (printable) {
                instance.write(key);
                currentCommand += key;
            }
        });

        return () => {
            disposable?.dispose();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, instance]);

    ws.onmessage = (event) => {
        if (instance) {
            instance.write(event.data); // Ensure new lines are properly handled
        }
    };
    return <div ref={ref} className="h-1/2 w-full" />;
};

export default Terminal;
