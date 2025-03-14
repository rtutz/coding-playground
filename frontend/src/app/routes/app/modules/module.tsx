import ModuleDashboard from "@/components/moduleDashboard";
import { api } from "@/lib/api-client";
import { Material } from "@/types/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lesson from "@/features/lesson/components/lessonUI";
import Problem from "@/features/problem/components/problemUI";
import { Quiz } from "@/features/quiz/components/quizUI";
import { Loader } from "@/components/loader";
import { useUserRole } from "@/hooks/useUserRole";
import LessonTeacher from "@/features/lesson/components/lessonTeacherUI";
import { QuizTeacher } from "@/features/quiz/components/quizTeacher";
/* 
Displays a specific module to the user. This module
should interact with all 3 types of problems. The 
user should be able to move across the materials
associated to this module.

- if no materials, display a message no materials for this module.
- else,
    if url param contains a materialId, use that
    else, update URL to contain the ID of the first material. 
*/
export default function Module() {
    const navigate = useNavigate();
    const { moduleId, materialId } = useParams<{
        moduleId: string;
        materialId?: string;
    }>();
    const [currentMaterial, setCurrentMaterial] = useState<
        Material | undefined
    >();
    const userRole = useUserRole();

    const {
        data: materials,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["materials", moduleId],
        queryFn: () =>
            api
                .get(`/modules/${moduleId}/materials`)
                .then((response) => response.data),
    }) as { data: Material[]; isLoading: boolean; error: unknown };

    useEffect(() => {
        if (materials && materials.length > 0) {
            if (!materialId || !materials.some((m) => m._id === materialId)) {
                navigate(`/modules/${moduleId}/${materials[0]._id}`);
                navigate(0); // Ensure it reloads
            }
        }
    }, [materials, moduleId, materialId, navigate]);

    useEffect(() => {
        const material = materials?.find((m) => m._id === materialId);
        setCurrentMaterial(material);
    }, [materials, materialId]);

    // TODO: Make a separate component for these
    if (isLoading) return <Loader />;
    if (error) return <div>Error...</div>;
    if (!materials || materials.length == 0) return <div>No materials</div>;

    const onMaterialChange = (materialId: string) => {
        navigate(`/modules/${moduleId}/${materialId}`);
        navigate(0);
    };

    if (!currentMaterial) return <div>Invalid material</div>;
    return (
        // <div className="h-screen flex flex-col">
        <div>
            <ModuleDashboard
                materials={materials}
                currentMaterialId={materialId!}
                onMaterialChange={onMaterialChange}
            />
            {(() => {
                switch (currentMaterial?.type) {
                    case "lesson":
                        if (userRole === "teacher") {
                            return (
                                <LessonTeacher
                                    key={materialId}
                                    lessonId={currentMaterial._id}
                                    moduleId={moduleId!}
                                />
                            );
                        } else {
                            return (
                                <Lesson
                                    key={materialId}
                                    lessonId={currentMaterial._id}
                                    moduleId={moduleId!}
                                />
                            );
                        }
                    case "problem":
                        if (userRole === "teacher") {
                            return (
                                <LessonTeacher
                                    key={materialId}
                                    lessonId={currentMaterial._id}
                                    moduleId={moduleId!}
                                />
                            );
                        } else {
                            return (
                                <Problem
                                    key={materialId}
                                    lessonId={currentMaterial._id}
                                    moduleId={moduleId!}
                                />
                            );
                        }
                    case "quiz":
                        if (userRole === "teacher") {
                            return (
                                <QuizTeacher
                                    key={materialId}
                                    lessonId={currentMaterial._id}
                                    moduleId={moduleId!}
                                />
                            );
                        } else {
                            return (
                                <Quiz
                                    key={materialId}
                                    lessonId={currentMaterial._id}
                                    moduleId={moduleId!}
                                />
                            );
                        }
                    default:
                        return <div>DEFAULT</div>;
                }
            })()}
        </div>
    );
}
