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

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{module.title}</CardTitle>
        <CardDescription>{module.subtitle}</CardDescription>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent>
        {module.materials.map((material, index) => (
          <MaterialItem
            key={index}
            material={material}
            isDone={false} // You might want to pass this as a prop or calculate it
          />
        ))}
      </CardContent>
    </Card>
  );
};
