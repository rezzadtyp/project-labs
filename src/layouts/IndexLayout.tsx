import Navbar from "@/components/navbar";
import { Outlet } from "react-router-dom";

const IndexLayout = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-4 min-h-screen bg-background pt-32">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default IndexLayout;
