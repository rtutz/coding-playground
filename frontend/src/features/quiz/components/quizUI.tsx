import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Quiz as quizType, Option as optionType } from "@/features/quiz/types/quiz";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";

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

    if (isLoading) return <Loader/>;
    if (error) return <div>Error...</div>;

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const getOptionClass = (option: optionType) => {
        if (!isSubmitted) return "hover:bg-gray-700";
        if (option.isRight) return "bg-green-500/20 border border-green-500 text-green-300";
        if (option.content === selectedOption && !option.isRight) 
          return "bg-red-500/20 border border-red-500 text-red-300";
        return "border border-gray-600";
      };
    
      return (
        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <Card className="w-full max-w-2xl shadow-2xl rounded-2xl bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-center text-gray-900 dark:text-white">
                {quizData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6 text-center text-gray-700 dark:text-gray-300">
                {quizData.content}
              </p>
              <RadioGroup onValueChange={handleOptionChange} disabled={isSubmitted}>
                {quizData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-4 rounded-lg transition-all duration-300 ${getOptionClass(option)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={option.content} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer text-lg">
                        {option.content}
                      </Label>
                      {isSubmitted && option.isRight && (
                        <span className="text-green-500 text-xl font-bold">✓</span>
                      )}
                      {isSubmitted && option.content === selectedOption && !option.isRight && (
                        <span className="text-red-500 text-xl font-bold">✗</span>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedOption || isSubmitted}
                  className="px-6 py-2 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitted ? "Submitted" : "Submit Answer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
};
