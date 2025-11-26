import { useEffect, useState } from "react";

// Import all source files as raw strings
// This ensures Vite can properly bundle them
import animatedLinkSource from "@/components/shared/animated-link.tsx?raw";
import gooeyButtonSource from "@/components/shared/gooey-button.tsx?raw";
import gooeyMenuSource from "@/components/shared/gooey-menu.tsx?raw";
import entryAnimationSource from "@/components/shared/entry-animation.tsx?raw";

// Map component names to their source code
const sourceCodeMap: Record<string, string> = {
  "animated-link": animatedLinkSource,
  "gooey-button": gooeyButtonSource,
  "gooey-menu": gooeyMenuSource,
  "entry-animation": entryAnimationSource,
};

const useGetSourceCode = (componentName: string | null) => {
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!componentName) {
      setSourceCode(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Simulate async loading for consistency with API patterns
    const fetchSourceCode = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Small delay to show loading state (optional, can be removed)
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        const code = sourceCodeMap[componentName];
        
        if (code) {
          setSourceCode(code);
        } else {
          setError(`Source code not found for component: ${componentName}`);
          setSourceCode(null);
        }
      } catch (err) {
        console.error("Error loading source code:", err);
        setError(`Failed to load source code for ${componentName}`);
        setSourceCode(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSourceCode();
  }, [componentName]);

  return { sourceCode, isLoading, error };
};

export default useGetSourceCode;

