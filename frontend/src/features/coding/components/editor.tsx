import React, { ReactNode } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
    code: string;
    children?: ReactNode;
    onCodeChange: (code: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    code,
    children,
    onCodeChange
}) => {

    return (
        <div className="w-full h-full border dark:border-gray-700 relative">
            <Editor
                height="100%"
                defaultLanguage="python"
                value={code}
                onChange={onCodeChange}
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
            {children}
        </div>
    );
};

export default CodeEditor;
