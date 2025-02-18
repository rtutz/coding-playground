import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className }) => {
  return (
    <div className={cn(
      "w-full h-full overflow-auto p-4 bg-background text-foreground",
      "prose prose-invert prose-sm sm:prose-base lg:prose-lg dark:prose-invert",
      className
    )}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
