import React from "react";
import { ArrowRightIcon } from "lucide-react";

interface ButtonGooeyProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  theme?: "light" | "dark"; // Theme: light = black, dark = white
  size?: "sm" | "md" | "lg";
}

export const ButtonGooey = ({
  children,
  icon,
  onClick,
  className,
  theme = "light",
  size = "md",
}: ButtonGooeyProps) => {
  const buttonId = React.useId();
  const filterId = `gooey-button-${buttonId}`;
  const wrapperClass = `gooey-button-wrapper-${buttonId}`;
  const buttonClass = `gooey-button-${buttonId}`;
  const bubbleClass = `gooey-button-bubble-${buttonId}`;

  // Determine colors based on theme
  const bgColor = theme === "dark" ? "#fff" : "#000";
  const textColor = theme === "dark" ? "#000" : "#eee";
  const bubbleTextColor = theme === "dark" ? "#000" : "#fff";

  // Size variants
  const sizeStyles = {
    sm: { 
      height: "48px", 
      fontSize: "1rem", 
      padding: "0 20px", 
      iconSize: "h-6 w-6", 
      bubbleSize: "48px",
      translateXInitial: "80%",
      translateXHover: "280%", // Increased for small buttons
    },
    md: { 
      height: "64px", 
      fontSize: "1.25rem", 
      padding: "0 24px", 
      iconSize: "h-8 w-8", 
      bubbleSize: "64px",
      translateXInitial: "80%",
      translateXHover: "210%",
    },
    lg: { 
      height: "80px", 
      fontSize: "1.5rem", 
      padding: "0 32px", 
      iconSize: "h-10 w-10", 
      bubbleSize: "80px",
      translateXInitial: "80%",
      translateXHover: "200%",
    },
  };

  const currentSize = sizeStyles[size];
  const defaultIcon = icon || <ArrowRightIcon className={currentSize.iconSize} />;

  return (
    <>
      <div className={`${wrapperClass} ${className || ""}`}>
        <button className={buttonClass} onClick={onClick}>
          {children}
          <div className={bubbleClass}>
            {defaultIcon}
          </div>
        </button>
      </div>

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

      <style>{`
        .${wrapperClass} {
          filter: url(#${filterId});
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }

        .${buttonClass} {
          background: ${bgColor};
          color: ${textColor};
          display: inline-flex;
          font-weight: bold;
          padding: ${currentSize.padding};
          border-radius: 12px;
          font-size: ${currentSize.fontSize};
          line-height: ${currentSize.fontSize};
          height: ${currentSize.height};
          align-items: center;
          position: relative;
          cursor: pointer;
          border: none;
          gap: 12px;
        }

        .${bubbleClass} {
          color: ${bubbleTextColor};
          z-index: -10;
          display: flex;
          background: ${bgColor};
          align-items: center;
          justify-content: center;
          width: ${currentSize.bubbleSize};
          height: ${currentSize.bubbleSize};
          position: absolute;
          border-radius: 12px;
          transition: transform 0.8s;
          transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1.2);
          transform: translateX(${currentSize.translateXInitial}) translateY(0%);
        }

        .${buttonClass}:hover .${bubbleClass} {
          transform: translateX(${currentSize.translateXHover}) translateY(0%);
        }
      `}</style>
    </>
  );
};
