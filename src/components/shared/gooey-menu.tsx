import React from "react";
import { PlusIcon } from "lucide-react";

interface GooeyMenuItem {
  icon: React.ReactNode;
  onClick: () => void;
}

interface GooeyMenuProps {
  items: GooeyMenuItem[];
  className?: string;
  spacing?: number; // Vertical spacing between items in pixels
  theme?: "light" | "dark"; // Theme: light = black, dark = white
}

export default function GooeyMenu({ 
  items, 
  className,
  spacing = 80,
  theme = "light"
}: GooeyMenuProps) {
  const menuId = React.useId();
  const checkboxId = `gooey-menu-${menuId}`;
  const filterId = `gooey-${menuId}`;
  
  // Determine colors based on theme
  const bgColor = theme === "dark" ? "bg-white" : "bg-black";
  const textColor = theme === "dark" ? "text-black" : "text-white";

  return (
    <div className={`relative h-[300px] w-full ${className || ""}`}>
      <nav
        className="menu"
        style={
          {
            filter: `url(#${filterId})`,
            width: "100%",
            height: "100%",
            "--spring-easing":
              "linear(0, 0.88117 15.492%, 1.09261 23.232%, 1.10421 28.713%, 0.99031 49.585%,0.99995)",
          } as React.CSSProperties
        }
      >
        <input type="checkbox" className="peer hidden" name={checkboxId} id={checkboxId} />
        <label
          className={`absolute bottom-10 right-10 z-10 flex h-14 w-14 scale-125 cursor-pointer items-center justify-center rounded-full ${bgColor} ${textColor} transition-all duration-1000 peer-checked:rotate-135 peer-checked:scale-100`}
          htmlFor={checkboxId}
          style={{ transitionTimingFunction: "var(--spring-easing)" }}
        >
          <PlusIcon className="h-5 w-5" />
        </label>
        {items.map((item, index) => {
          const translateY = -(spacing * (index + 1));
          return (
            <button
              key={index}
              onClick={item.onClick}
              className={`absolute bottom-10 right-10 flex h-14 w-14 items-center justify-center rounded-full ${bgColor} ${textColor} transition-transform duration-300 ease-in peer-checked:duration-1000`}
              style={{
                transitionTimingFunction: "var(--spring-easing)",
                transform: "translateY(0px)",
                "--translate-y": `${translateY}px`,
              } as React.CSSProperties}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>
      <style>{`
        .menu input[type="checkbox"]:checked ~ button {
          transform: translateY(var(--translate-y, 0px)) !important;
        }
      `}</style>
      <svg
        className="absolute hidden"
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
