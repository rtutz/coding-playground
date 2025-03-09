import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@uiw/react-markdown-editor";
import {
    Quiz as quizType,
    Option as optionType,
} from "@/features/quiz/types/quiz";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";
import { CheckCircle, XCircle } from "lucide-react";
// import MarkdownPreview from "@/features/markdown/components/preview";

interface QuizProps {
    lessonId: string;
    moduleId: string;
}

export const Quiz: React.FC<QuizProps> = ({ lessonId, moduleId }) => {
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

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (isLoading) return <Loader />;
    if (error) return <div>Error...</div>;

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const getOptionClass = (option: optionType) => {
        if (!isSubmitted) return "hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors";
        if (option.isRight)
            return "bg-green-500/20 border border-green-500 text-green-600 dark:text-green-300";
        if (option.content === selectedOption && !option.isRight)
            return "bg-red-500/20 border border-red-500 text-red-600 dark:text-red-300";
        return "border border-gray-300 dark:border-gray-600";
    };
    
    return (
        <div className=" flex items-center justify-center  p-6">
            <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
                <CardHeader className="text-xl font-semibold bg-markdown">
                    <MarkdownEditor.Markdown
                        source={quizData.content}
                        className="prose dark:prose-invert"
                    />
                </CardHeader>
                <CardContent className="space-y-6 bg-markdown">
                    <RadioGroup
                        onValueChange={handleOptionChange}
                        disabled={isSubmitted}
                        className="space-y-4"
                    >
                        {quizData.options.map((option, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg transition-all duration-300 ${getOptionClass(
                                    option
                                )}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem
                                        value={option.content}
                                        id={`option-${index}`}
                                    />
                                    <Label
                                        htmlFor={`option-${index}`}
                                        className="flex-grow cursor-pointer text-lg text-gray-900 dark:text-gray-100"
                                    >
                                        <MarkdownEditor.Markdown
                                            source={option.content}
                                            className="prose dark:prose-invert"
                                        />
                                    </Label>
                                    {isSubmitted && option.isRight && (
                                        <CheckCircle className="text-green-500 h-6 w-6" />
                                    )}
                                    {isSubmitted &&
                                        option.content === selectedOption &&
                                        !option.isRight && (
                                            <XCircle className="text-red-500 h-6 w-6" />
                                        )}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                    <div className="flex justify-center">
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedOption || isSubmitted}
                            className="px-6 py-3 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                        >
                            {isSubmitted ? "Submitted" : "Submit Answer"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
    
};
