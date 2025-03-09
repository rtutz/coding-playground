import { api } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Lesson as lessonType } from "../types/lesson";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
// import MarkdownPreview from "@/features/markdown/components/preview";
// import MarkdownEditor from "@/features/markdown/components/editor";
import { useEffect, useState } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";

interface LessonTeacherProps {
    lessonId: string;
    moduleId: string;
}

const LessonTeacher: React.FC<LessonTeacherProps> = ({
    lessonId,
    moduleId,
}) => {
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

    const [content, setContent] = useState("");
    const mutation = useMutation({
        mutationFn: async (updatedContent: string) => {
            return api.put(`/modules/${moduleId}/materials/${lessonId}`, {
                content: updatedContent,
            });
        },
    });

    useEffect(() => {
        if (lessonData) {
            setContent(lessonData.content);
        }
    }, [lessonData]);

    if (isLoading) return <Loader />;
    if (error) return <div>Error loading lesson...</div>;

    return (
        <>
            <div className="absolute top-0">
                <Button
                    className="m-4"
                    onClick={() => mutation.mutate(content)}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "..." : "Save"}
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden h-screen">
                {/* Markdown Editor Section */}

                <MarkdownEditor
                    value={content}
                    onChange={(value) => setContent(value)}
                    className="h-full w-full"
                    visible
                />
            </div>
        </>
    );
};

export default LessonTeacher;
