import { api } from "@/lib/api-client";
import { Lesson as lessonType } from "../types/lesson";
import { useQuery } from "@tanstack/react-query";
import MarkdownPreview from "@/features/markdown/components/preview";
import CodeEditor from "@/features/coding/components/editor";
import Terminal from "@/features/coding/components/terminal";

interface LessonProps {
    lessonId: string;
    moduleId: string;
}

const Lesson: React.FC<LessonProps> = ({ lessonId, moduleId }) => {
    console.log("lessonId", lessonId);
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="w-1/2 h-full py-6 bg-background text-foreground">
                <MarkdownPreview content={lessonData.content} />
            </div>
    
            <div className="w-1/2 flex flex-col">
                <div className="h-1/2">
                    <CodeEditor />
                </div>
    
                <div className="h-1/2">
                    <Terminal/>
                </div>
            </div>
        </div>
    );
}    

export default Lesson;
