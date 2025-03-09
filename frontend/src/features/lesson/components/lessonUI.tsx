import { api } from "@/lib/api-client";
import { Lesson as lessonType } from "../types/lesson";
import { useQuery } from "@tanstack/react-query";
// import MarkdownPreview from "@/features/markdown/components/preview";
import CodeEditor from "@/features/coding/components/editor";
import Terminal from "@/features/coding/components/terminal";
import { useState } from "react";
import RunButton from "@/features/coding/components/runButton";
import { WSClient } from "@/lib/ws-client";
import { Loader } from "@/components/loader";
import MarkdownEditor from '@uiw/react-markdown-editor';

interface LessonProps {
    lessonId: string;
    moduleId: string;
}

const Lesson: React.FC<LessonProps> = ({ lessonId, moduleId }) => {
    const {
        data: lessonData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["lessonsData"],
        queryFn: () =>
            api
                .get(`/modules/${moduleId}/materials/${lessonId}`)
                .then((response) => response.data),
    }) as { data: lessonType; isLoading: boolean; error: unknown };

    const [code, setCode] = useState<string>('');

    if (isLoading) return <Loader/>;
    if (error) return <div>Error...</div>;

    const handleRun = () => {
        WSClient.getInstance().sendCode(code);
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="w-1/2 h-full p-6 bg-background text-foreground">
                {/* <MarkdownPreview content={lessonData.content} /> */}
                <MarkdownEditor.Markdown source={lessonData.content} />
            </div>

            <div className="w-1/2 flex flex-col">
                <div className="h-1/2">
                    <CodeEditor code={code} onCodeChange={code => setCode(code || '')} >
                        <RunButton onClick={handleRun}/>
                    </CodeEditor>
                </div>

                <div className="h-1/2">
                    <Terminal />
                </div>
            </div>
        </div>
    );
};

export default Lesson;
