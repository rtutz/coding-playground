import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WSClient } from "@/lib/ws-client";

interface CodeEditorProps {
    defaultValue?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    defaultValue = "// Type your code here",
}) => {
    const [code, setCode] = useState(defaultValue);
    const handleRun = (codeToRun: string) => {
      WSClient.getInstance().sendCode(codeToRun);
  };
    return (
        <div className="w-full h-full border dark:border-gray-700 relative">
            <Editor
                height="100%"
                defaultLanguage="python"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                }}
            />
            <Button
                onClick={() => handleRun(code)}
                className="absolute top-2 right-6 bg-green-400"
                variant="ghost"
                size="icon"
            >
                <Play className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default CodeEditor;
