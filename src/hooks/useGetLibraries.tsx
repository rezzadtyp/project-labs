import { useEffect, useState } from "react";
import type { Library, LibrariesData } from "@/types/library";

const useGetLibraries = () => {
  const [data, setData] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getLibraries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/libraries.json");
      const data: LibrariesData = await response.json();
      setData(data.libraries);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLibraries();
  }, []);
  return { data, isLoading };
};

export default useGetLibraries;
