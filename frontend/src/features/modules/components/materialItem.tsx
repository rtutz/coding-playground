import { Material } from "@/types/material";
import { CheckCircleIcon, CircleIcon } from "lucide-react";
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

  const handleClick = () => {
    navigate(`/modules/${moduleId}/${material._id}`);
  };

  return (
    <div className="grid grid-cols-12 items-center p-3 w-full">
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
    </div>
  );
};
