import { cnm } from "@/utils/style";
import React from "react";

const Loading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cnm(
        "w-full flex h-screen items-center justify-center",
        className
      )}
    >
      <div className="m-auto w-fit h-fit">
        <img src="/vinyl.svg" alt="vinyl" className="w-40 h-40 animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
