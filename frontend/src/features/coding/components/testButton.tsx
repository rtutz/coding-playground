import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";


const TestButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <Button
        onClick={onClick}
        className="absolute top-2 right-16 bg-blue-400 p-2"
        variant="ghost"
        size="icon"
    >
        <CloudUpload className="h-4 w-4" />
    </Button>
);

export default TestButton;
