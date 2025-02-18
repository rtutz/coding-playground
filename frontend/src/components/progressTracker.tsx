import React, { useEffect, useState } from "react";
import { Material } from "@/types/material";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface ProgressTrackerProps {
  materials: Material[];
  currentMaterialId: string;
  onMaterialChange: (materialId: string) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  materials,
  currentMaterialId,
  onMaterialChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const index = materials.findIndex((m) => m._id === currentMaterialId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [currentMaterialId, materials]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onMaterialChange(materials[newIndex]._id);
    }
  };

  const handleNext = () => {
    if (currentIndex < materials.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onMaterialChange(materials[newIndex]._id);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-4">
      <button
        onClick={handlePrev}
        className="text-gray-300 hover:text-white disabled:opacity-50"
        disabled={currentIndex === 0}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <div className="flex space-x-2 overflow-x-auto">
        {materials.map((material, index) => (
          <div
            key={material._id}
            className={`flex-shrink-0 w-10 h-2 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentIndex
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          />
        ))}
      </div>
      <button
        onClick={handleNext}
        className="text-gray-300 hover:text-white disabled:opacity-50"
        disabled={currentIndex === materials.length - 1}
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ProgressTracker;
