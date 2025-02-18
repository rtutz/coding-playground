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

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/modules/${module._id}`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div
          onClick={handleClick}
          className="cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 p-4 rounded-lg"
        >
          <CardTitle className="text-lg font-semibold">
            {module.title}
          </CardTitle>
        </div>{" "}
        <CardDescription>{module.subtitle}</CardDescription>
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
