import { useUserRole } from "@/hooks/useUserRole";
import { api } from "@/lib/api-client";
import { Material } from "@/types/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, CircleIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaterialItemProps {
    moduleId: string;
    material: Material;
    isDone: boolean;
}

export const MaterialItem: React.FC<MaterialItemProps> = ({
    moduleId,
    material,
    isDone,
}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userRole = useUserRole();

    const handleClick = () => {
        navigate(`/modules/${moduleId}/${material._id}`);
    };

    // Mutation to delete the material
    const deleteMaterialMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`/modules/${moduleId}/materials/${material._id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules', moduleId] });
            alert('Material successfully deleted.');
            navigate(0);
        },
        onError: () => {
            alert(`Error deleting material`);
        },
    });

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this material?")) {
            deleteMaterialMutation.mutate();
        }
    };

    return (
        <div
        className="grid grid-cols-12 items-center p-3 w-full relative"
    >
        {/* Icon */}
        <div className="col-span-1 flex justify-center">
            {isDone ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
                <CircleIcon className="h-5 w-5 text-gray-300" />
            )}
        </div>

        {/* Type */}
        <span className="col-span-2 text-sm font-medium">{material.type}</span>

        {/* Title */}
        <span
            className="col-span-9 text-sm font-semibold truncate cursor-pointer hover:text-blue-600"
            onClick={handleClick}
        >
            {material.title}
        </span>

        {/* Trash Icon */}
        {userRole==='teacher' && <div className="absolute top-0 right-0 p-2">
            <TrashIcon
                className="h-5 w-5 text-gray-500 cursor-pointer hover:text-red-500"
                onClick={handleDelete}
            />
        </div>}
        
    </div>
);

};
