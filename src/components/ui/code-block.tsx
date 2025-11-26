import { useState } from "react";
import { Button } from "./button";
import { CopyIcon } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeBlock = ({
  code,
  language = "tsx",
  className = "",
}: CodeBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`relative border border-border overflow-hidden bg-muted/50 transition-all duration-500 ease-in-out ${
        isExpanded ? "max-h-[1200px]" : "max-h-[300px]"
      } ${className}`}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <CopyIcon className="size-4" />
        </button>
      </div>
      <div className="relative">
        <pre
          className={`overflow-x-auto p-4 text-xs text-muted-foreground transition-opacity duration-300 ${
            !isExpanded
              ? "overflow-y-hidden max-h-[calc(300px-3rem)]"
              : "overflow-y-auto max-h-[calc(800px-3rem)]"
          }`}
        >
          <code className="font-mono">{code}</code>
        </pre>

        {/* Gradient overlay with fade animation */}
        <div
          className={`absolute bottom-0 left-0 w-full h-32 bg-linear-to-b from-transparent via-background/80 to-background pointer-events-none transition-opacity duration-500 z-10 ${
            isExpanded ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Expand button with fade and scale animation */}
        {!isExpanded && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
            <Button
              variant="secondary"
              className="text-xs"
              size={"sm"}
              onClick={handleExpand}
            >
              Expand
            </Button>
          </div>
        )}

        {/* Collapse button with fade and scale animation */}
        {isExpanded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
            <Button
              variant="secondary"
              className="text-xs"
              size={"sm"}
              onClick={handleExpand}
            >
              Collapse
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
