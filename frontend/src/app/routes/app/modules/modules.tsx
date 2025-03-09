import { api } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Module } from "@/features/modules/types/module";
import { ModuleCard } from "@/features/modules/components/moduleCard";
import { Loader } from "@/components/loader";
import { useUserRole } from "@/hooks/useUserRole";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/* 
Displays all the modules in the app. A user should
be able to click on a specific module and get rerouted 
to it (which should then display module.tsx)
*/
export default function Modules() {
    const [open, setOpen] = useState(false);
    const [subtitle, setSubtitle] = useState("");
    const [title, setTitle] = useState("");

    const queryClient = useQueryClient();
    const {
        data: modules,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["modules"],
        queryFn: () => api.get("/modules").then((response) => response.data),
    }) as { data: Module[]; isLoading: boolean; error: unknown };

    const createModuleMutation = useMutation({
        mutationFn: (newModule: { title: string; subtitle: string }) =>
            api.post("/modules", newModule),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules"] });
            setOpen(false);
            setTitle("");
            setSubtitle("");
        },
    });

    const userRole = useUserRole();

    if (isLoading) return <Loader />;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Modules</h1>
                {modules && modules.length > 0 ? (
                    <div className="space-y-6">
                        {modules.map((module) => (
                            <ModuleCard key={module._id} module={module} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">
                        No modules found.
                    </p>
                )}
                {userRole === "teacher" && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="mt-6 w-full">
                                Create New Module
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Module</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (title.trim()) {
                                        createModuleMutation.mutate({
                                            title,
                                            subtitle,
                                        });
                                    }
                                }}
                            >
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
                                    <Label htmlFor="subtitle">Sub Title</Label>
                                    <Input
                                        id="subtitle"
                                        value={subtitle}
                                        onChange={(e) =>
                                            setSubtitle(e.target.value)
                                        }
                                    />
                                    <Button type="submit" className="w-full">
                                    Create
                                </Button>
                                </div>
                                
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
