import { api } from "@/lib/api-client";
import { Problem as problemType } from "../types/problem";
import { useQuery } from "@tanstack/react-query";
import MarkdownPreview from "@/features/markdown/components/preview";
import CodeEditor from "@/features/coding/components/editor";
import Terminal from "@/features/coding/components/terminal";
import { useState } from "react";
import RunButton from "@/features/coding/components/runButton";
import { WSClient } from "@/lib/ws-client";
import TestButton from "@/features/coding/components/testButton";
import { Loader } from "@/components/loader";

interface ProblemProps {
    lessonId: string;
    moduleId: string;
}

const Problem: React.FC<ProblemProps> = ({ lessonId, moduleId }) => {
    const {
        data: problemData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["problemData"],
        queryFn: () =>
            api
                .get(`/modules/${moduleId}/materials/${lessonId}`)
                .then((response) => response.data),
    }) as { data: problemType; isLoading: boolean; error: unknown };

    const [code, setCode] = useState<string>("");
    if (isLoading) return <Loader/>;
    if (error) return <div>Error...</div>;

    const handleRun = () => {
        WSClient.getInstance().sendCode(code);
    };

    const handleTest = () => {
        WSClient.getInstance().sendTest(code, problemData.testCases || []);
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="w-1/2 h-full py-6 bg-background text-foreground">
                <MarkdownPreview content={problemData.content} />
            </div>

            <div className="w-1/2 flex flex-col">
                <div className="h-1/2">
                    <CodeEditor
                        code={code}
                        onCodeChange={(code) => setCode(code || "")}
                    >
                        <RunButton onClick={handleRun} />
                        {problemData.testCases &&
                            problemData.testCases.length > 0 && <TestButton onClick={handleTest}/>}
                    </CodeEditor>
                </div>

                <div className="h-1/2">
                    <Terminal />
                </div>
            </div>
        </div>
    );
};

export default Problem;
