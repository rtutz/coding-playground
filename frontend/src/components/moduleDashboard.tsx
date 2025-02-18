import React from "react";
import ProgressTracker from "@/components/progressTracker";
import { Material } from "@/types/material";

interface ModuleDashboardProps {
    materials: Material[];
    currentMaterialId: string;
    onMaterialChange: (materialId: string) => void;
}

const ModuleDashboard: React.FC<ModuleDashboardProps> = ({
    materials,
    currentMaterialId,
    onMaterialChange,
}) => {
    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full">
            <ProgressTracker
                materials={materials}
                currentMaterialId={currentMaterialId}
                onMaterialChange={onMaterialChange}
            />
        </div>
    );
};

export default ModuleDashboard;
