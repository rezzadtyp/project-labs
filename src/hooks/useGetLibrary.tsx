import { useEffect, useState, useCallback } from "react";
import type { Library, LibrariesData } from "@/types/library";

const useGetLibrary = (identifier: string, identifierType: "url" | "name" = "url") => {
  const [data, setData] = useState<Library | null>(null);
  const [before, setBefore] = useState<Library | null>(null);
  const [after, setAfter] = useState<Library | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLibrary = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/libraries.json");
      const data: LibrariesData = await response.json();
      const currentIndex = data.libraries.findIndex(
        (lib: Library) =>
          lib[identifierType] === identifier
      );
      
      if (currentIndex !== -1) {
        const library = data.libraries[currentIndex];
        setData(library);
        
        // Get the library before (previous)
        const prevLibrary = currentIndex > 0 ? data.libraries[currentIndex - 1] : null;
        setBefore(prevLibrary);
        
        // Get the library after (next)
        const nextLibrary = currentIndex < data.libraries.length - 1 ? data.libraries[currentIndex + 1] : null;
        setAfter(nextLibrary);
      } else {
        setData(null);
        setBefore(null);
        setAfter(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [identifier, identifierType]);

  useEffect(() => {
    if (identifier) {
      getLibrary();
    }
  }, [identifier, getLibrary]);

  return { data, before, after, isLoading };
};

export default useGetLibrary;

