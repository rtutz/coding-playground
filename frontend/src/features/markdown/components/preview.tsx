import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import ReactMarkdown from "react-markdown";
import "./styling/preview.css";

interface MarkdownPreviewProps {
    content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
    return (
        <ScrollArea className="h-full w-full">
            <div className="markdown-preview px-6">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </ScrollArea>
    );
};

export default MarkdownPreview;
