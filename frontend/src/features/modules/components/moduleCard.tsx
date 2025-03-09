import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MaterialItem } from "@/features/modules/components/materialItem";
import { Module } from "@/features/modules/types/module";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";

interface ModuleCardProps {
    module: Module;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
    const navigate = useNavigate();
    const userRole = useUserRole();
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("lesson");
    const [title, setTitle] = useState("");
    const queryClient = useQueryClient();

    // Mutation to delete the material
    const deleteMaterialMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(
                `/module/${module._id}`
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", module._id] });
            alert("Module successfully deleted.");
            navigate(0);
        },
        onError: () => {
            alert(`Error deleting module`);
        },
    });

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this module?")) {
            deleteMaterialMutation.mutate();
        }
    };

    const handleClick = () => {
        navigate(`/modules/${module._id}`);
    };

    const createMaterialMutation = useMutation({
        mutationFn: (newMaterial: { type: string; title: string }) =>
            api.post(`/modules/${module._id}/materials`, newMaterial),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["modules", module._id],
            });
            setOpen(false);
            setTitle("");
        },
    });

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <div
                    onClick={handleClick}
                    className="cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 p-4 rounded-lg flex-grow"
                >
                    <CardTitle className="text-lg font-semibold">
                        {module.title}
                    </CardTitle>
                    <CardDescription>{module.subtitle}</CardDescription>
                </div>
                {userRole === "teacher" && (
                    <div className="flex space-x-2">
                        {/* Plus Icon */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <PlusIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Material</DialogTitle>
                                </DialogHeader>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (title.trim()) {
                                            createMaterialMutation.mutate({
                                                type,
                                                title,
                                            });
                                            // navigate(0); // Refresh the page after
                                        }
                                    }}
                                >
                                    <div className="space-y-4">
                                        <RadioGroup
                                            value={type}
                                            onValueChange={setType}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="lesson"
                                                    id="lesson"
                                                />
                                                <Label htmlFor="lesson">
                                                    Lesson
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="problem"
                                                    id="problem"
                                                />
                                                <Label htmlFor="problem">
                                                    Problem
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="quiz"
                                                    id="quiz"
                                                />
                                                <Label htmlFor="quiz">Quiz</Label>
                                            </div>
                                        </RadioGroup>
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Create
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
    
                        {/* Trash Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardHeader>
            <Separator className="my-4" />
            <CardContent>
                {module.materials.map((material, index) => (
                    <MaterialItem
                        key={index}
                        material={material}
                        moduleId={module._id}
                        isDone={false} // You might want to pass this as a prop or calculate it
                    />
                ))}
            </CardContent>
        </Card>
    );
    
};
