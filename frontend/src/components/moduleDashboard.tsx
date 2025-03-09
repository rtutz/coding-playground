import React from "react";
import ProgressTracker from "@/components/progressTracker";
import { Material } from "@/types/material";
import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";

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
    const navigate = useNavigate(); // Initialize navigate function

    const handleHomeClick = () => {
        navigate("/"); // Navigate to the root route or change this to your desired path
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full">
            {/* Home Button */}
            <div className="flex items-center justify-end mb-4">
                <button
                    onClick={handleHomeClick}
                    className="flex items-center text-gray-300 hover:text-white bg-gray-800 px-4 py-2 rounded-md"
                >
                    <House size={20} />
                </button>

                {/* Progress Tracker */}
                <ProgressTracker
                    materials={materials}
                    currentMaterialId={currentMaterialId}
                    onMaterialChange={onMaterialChange}
                />
            </div>
        </div>
    );
};

export default ModuleDashboard;
