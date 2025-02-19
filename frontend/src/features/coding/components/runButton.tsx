import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const RunButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <Button
        onClick={onClick}
        className="absolute top-2 right-6 bg-green-400 p-2"
        variant="ghost"
        size="icon"
    >
        <Play className="h-4 w-4" />
    </Button>
);

export default RunButton; 