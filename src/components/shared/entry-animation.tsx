import gsap from "gsap";
import React, { useRef, useEffect } from "react";

interface EntryAnimationProps {
  children: React.ReactNode;
  className?: string;
  topSquareColor?: string;
  bottomSquareColor?: string;
  duration?: number;
  delay?: number;
  squareStagger?: number;
}

const EntryAnimation = ({
  children,
  className,
  topSquareColor = "#000000",
  bottomSquareColor = "#ffffff",
  duration = 1,
  delay = 0,
  squareStagger = 0.2,
}: EntryAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const topSquareRef = useRef<HTMLDivElement>(null);
  const bottomSquareRef = useRef<HTMLDivElement>(null);

  // Setup animations
  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !topSquareRef.current || !bottomSquareRef.current || !children) {
      return;
    }

    // Wait for layout to settle, then set square dimensions and start animation
    requestAnimationFrame(() => {
      if (!containerRef.current || !contentRef.current || !topSquareRef.current || !bottomSquareRef.current) return;

      // Get actual dimensions of the content container
      const contentRect = contentRef.current.getBoundingClientRect();
      
      // Set initial positions
      // Squares start off-screen to the left (stacked on top of each other)
      gsap.set(topSquareRef.current, {
        x: "-100%",
        y: 0,
        width: contentRect.width || "100%",
        height: contentRect.height || "100%",
        opacity: 1,
      });

      gsap.set(bottomSquareRef.current, {
        x: "-100%",
        y: 0,
        width: contentRect.width || "100%",
        height: contentRect.height || "100%",
        opacity: 1,
      });

      // Initially hide content
      gsap.set(contentRef.current, {
        opacity: 0,
      });

      // Create timeline
      const tl = gsap.timeline({ delay });

      // First: Squares enter from left to right (content is still hidden)
      // Top square enters first
      tl.to(topSquareRef.current, {
        x: 0,
        duration: duration * 0.3,
        ease: "power2.out",
      }, 0);

      // Bottom square enters after stagger delay
      tl.to(bottomSquareRef.current, {
        x: 0,
        duration: duration * 0.3,
        ease: "power2.out",
      }, squareStagger);

      // Second: Make content visible (but still hidden behind squares)
      // Wait for squares to finish entering, then show content
      const enterDuration = duration * 0.3 + squareStagger;
      tl.set(contentRef.current, {
        opacity: 1,
      }, enterDuration);

      // Third: Wait a bit (pause)
      const waitTime = duration * 0.2;
      tl.to({}, { duration: waitTime }, ">");

      // Fourth: Squares slide away to the right with stagger
      // Top square slides first
      tl.to(topSquareRef.current, {
        x: "100%",
        duration: duration * 0.5,
        ease: "power2.inOut",
      }, ">");

      // Bottom square slides after stagger delay
      tl.to(bottomSquareRef.current, {
        x: "100%",
        duration: duration * 0.5,
        ease: "power2.inOut",
      }, `>-${duration * 0.5 - squareStagger}`);
    });

    return () => {
      // Cleanup if needed
    };
  }, [children, topSquareColor, bottomSquareColor, duration, delay, squareStagger]);

  // Format color (support hex with or without #)
  const formatColor = (color: string) => {
    return color.startsWith("#") ? color : `#${color}`;
  };

  if (!children) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block overflow-hidden ${className || ""}`}
    >
      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10"
      >
        {children}
      </div>

      {/* Top square (stacked on top) */}
      <div
        ref={topSquareRef}
        className="absolute top-0 left-0 z-30"
        style={{
          backgroundColor: formatColor(topSquareColor),
        }}
      />

      {/* Bottom square (stacked below top square) */}
      <div
        ref={bottomSquareRef}
        className="absolute top-0 left-0 z-20"
        style={{
          backgroundColor: formatColor(bottomSquareColor),
        }}
      />
    </div>
  );
};

export default EntryAnimation;
