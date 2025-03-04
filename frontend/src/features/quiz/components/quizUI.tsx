import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Quiz as quizType,
    Option as optionType,
} from "@/features/quiz/types/quiz";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";
import { CheckCircle, XCircle } from "lucide-react";
import MarkdownPreview from "@/features/markdown/components/preview";

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
        if (!isSubmitted) return "hover:bg-gray-700";
        if (option.isRight)
            return "bg-green-500/20 border border-green-500 text-green-300";
        if (option.content === selectedOption && !option.isRight)
            return "bg-red-500/20 border border-red-500 text-red-300";
        return "border border-gray-600";
    };

    return (
        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-3xl shadow-2xl rounded-2xl bg-white dark:bg-gray-800">
                <CardHeader className="text-xl">
                    <MarkdownPreview
                        content={quizData.content}
                    />
                </CardHeader>
                <CardContent className="space-y-6">
                    
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
                                        className="flex-grow cursor-pointer text-lg text-gray-800 dark:text-gray-200"
                                    >
                                        <MarkdownPreview
                                            content={option.content}
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
                            className="px-6 py-3 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                            {isSubmitted ? "Submitted" : "Submit Answer"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
