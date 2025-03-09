import { Loader } from "@/components/loader";
import { api } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Quiz as quizType } from "@/features/quiz/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuizProps {
    lessonId: string;
    moduleId: string;
}

export const QuizTeacher: React.FC<QuizProps> = ({ lessonId, moduleId }) => {
    const queryClient = useQueryClient();
    const [localQuiz, setLocalQuiz] = useState<quizType | null>(null);

    const {
        data: quizData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["quizData"],
        queryFn: () =>
            api
                .get(`/modules/${moduleId}/materials/${lessonId}`)
                .then((response) => response.data),
    }) as { data: quizType; isLoading: boolean; error: unknown };

    useEffect(() => {
        if (quizData) {
            setLocalQuiz(quizData);
        }
    }, [quizData]);

    // Mutation for saving changes
    const { mutate: saveQuiz, isPending: isSaving } = useMutation({
        mutationFn: (updatedQuiz: quizType) => 
          api.put(
            `/modules/${moduleId}/materials/quiz/${lessonId}`, // Updated endpoint path
            {
              content: updatedQuiz.content,
              options: updatedQuiz.options
            }
          ),
        onSuccess: () => {
          queryClient.invalidateQueries({ 
            queryKey: ["quizData", moduleId, lessonId] // Match query key pattern
          });
        },
      });
      
    // Handle form updates
    const handleQuestionChange = (value: string) => {
        setLocalQuiz((prev) => (prev ? { ...prev, content: value } : null));
    };

    const handleOptionChange = (index: number, value: string) => {
        setLocalQuiz((prev) => {
            if (!prev) return null;
            const newOptions = [...prev.options];
            newOptions[index].content = value;
            return { ...prev, options: newOptions };
        });
    };

    const toggleCorrectAnswer = (index: number) => {
        setLocalQuiz((prev) => {
            if (!prev) return null;
            const newOptions = prev.options.map((option, i) => 
                i === index ? { ...option, isRight: !option.isRight } : option
            );
            return { ...prev, options: newOptions };
        });
    }

    if (isLoading) return <Loader />;
    if (error) return <div>Error loading quiz</div>;
    if (!localQuiz) return null;

    return (
        
        <Card className="max-w-3xl mx-auto mt-20">
            <CardHeader>
                <CardTitle>Edit Quiz Question</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Question Input */}
                    <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                            id="question"
                            value={localQuiz.content}
                            onChange={(e) =>
                                handleQuestionChange(e.target.value)
                            }
                            placeholder="Enter your question..."
                            className="h-full"
                        />
                    </div>

                    {/* Options List */}
                    <div className="space-y-4">
                        <Label>Answer Options</Label>
                        {localQuiz.options.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4"
                            >
                                <input
                                    type="checkbox"
                                    checked={option.isRight}
                                    onChange={() => toggleCorrectAnswer(index)}
                                />

                                <Textarea
                                    value={option.content}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-1"
                                />
                                {/* <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeOption(index)}
                                    disabled={localQuiz.options.length <= 2}
                                >
                                    Remove
                                </Button> */}
                            </div>
                        ))}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-4">
                        <Button
                            onClick={() => saveQuiz(localQuiz)}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
