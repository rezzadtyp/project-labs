import gsap from "gsap";
import React, { useRef, useEffect, useMemo } from "react";

// SplitText type declaration
declare class SplitText {
  constructor(element: string | HTMLElement, options?: { type?: string; charsClass?: string });
  chars: HTMLElement[];
  revert: () => void;
}

const AnimatedLink = ({children, href, className, baseColor, activeColor, delay}: {children: React.ReactNode, href: string, className?: string, baseColor?: string, activeColor?: string, delay?: number}) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const topRowRef = useRef<HTMLSpanElement>(null);
  const bottomRowRef = useRef<HTMLSpanElement>(null);
  const splitTopRef = useRef<SplitText | null>(null);
  const splitBottomRef = useRef<SplitText | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Extract text from children
  const text = useMemo(() => {
    if (typeof children === "string") {
      return children.toUpperCase();
    } else if (React.isValidElement(children)) {
      const props = children.props as { children?: React.ReactNode };
      if (typeof props.children === "string") {
        return props.children;
      }
    }
    return "";
  }, [children]);

  // Setup SplitText and animations
  useEffect(() => {
    if (!containerRef.current || !topRowRef.current || !bottomRowRef.current || !text) {
      return;
    }

    // Get SplitText class - try dynamic import first, then runtime detection
    const getSplitTextClass = async (): Promise<typeof SplitText | null> => {
      // Try dynamic import from gsap/SplitText (ES module approach)
      try {
        const SplitTextModule = await import("gsap/SplitText");
        if (SplitTextModule && SplitTextModule.default) {
          return SplitTextModule.default as unknown as typeof SplitText;
        } else if (SplitTextModule && SplitTextModule.SplitText) {
          return SplitTextModule.SplitText as unknown as typeof SplitText;
        }
      } catch {
        // SplitText not available via import - try other methods
      }

      // Try to access SplitText from window or gsap as fallback
      try {
        if (typeof window !== "undefined") {
          const win = window as typeof window & { SplitText?: typeof SplitText };
          if (win.SplitText) {
            return win.SplitText;
          }
        }
        const gsapPlugins = (gsap as typeof gsap & { plugins?: { SplitText?: typeof SplitText } }).plugins;
        if (gsapPlugins?.SplitText) {
          return gsapPlugins.SplitText;
        }
      } catch {
        // SplitText not available - will use fallback method
      }

      return null;
    };

    // Setup animations with SplitText if available
    (async () => {
      const localSplitTextClass = await getSplitTextClass();

      if (!topRowRef.current || !bottomRowRef.current) return;

      // Cleanup previous splits
      if (splitTopRef.current) {
        try {
          splitTopRef.current.revert();
        } catch {
          // Ignore errors on revert
        }
      }
      if (splitBottomRef.current) {
        try {
          splitBottomRef.current.revert();
        } catch {
          // Ignore errors on revert
        }
      }

      let topChars: HTMLElement[] = [];
      let bottomChars: HTMLElement[] = [];

      if (localSplitTextClass && topRowRef.current && bottomRowRef.current) {
        // Use SplitText plugin
        try {
          splitTopRef.current = new localSplitTextClass(topRowRef.current, {
            type: "chars",
            charsClass: "animated-link-char",
          });
          splitBottomRef.current = new localSplitTextClass(bottomRowRef.current, {
            type: "chars",
            charsClass: "animated-link-char",
          });
          topChars = splitTopRef.current.chars as HTMLElement[];
          bottomChars = splitBottomRef.current.chars as HTMLElement[];
        } catch {
          console.warn("Error using SplitText, falling back to manual split");
        }
      }

      // Fallback: manual character splitting if SplitText is not available
      if ((topChars.length === 0 || bottomChars.length === 0) && topRowRef.current && bottomRowRef.current) {
        const topElements = topRowRef.current.querySelectorAll(".char");
        const bottomElements = bottomRowRef.current.querySelectorAll(".char");
        topChars = Array.from(topElements) as HTMLElement[];
        bottomChars = Array.from(bottomElements) as HTMLElement[];
      }

      if (topChars.length === 0 || bottomChars.length === 0 || !containerRef.current) return;

    // Helper function to get current character height dynamically
    const getCharHeight = () => {
      return topChars[0]?.getBoundingClientRect().height || 0;
    };

    // Helper function to format color (support hex with or without #)
    const formatColor = (color?: string) => {
      if (!color) return "#000000";
      return color.startsWith("#") ? color : `#${color}`;
    };

    const baseColorFormatted = formatColor(baseColor);
    // If activeColor is not provided, use baseColor (no color change on hover)
    const activeColorFormatted = formatColor(activeColor || baseColor);
    
    // Use delay prop or default to 0.3
    const staggerDelay = delay !== undefined ? delay : 0.3;

    // Set initial positions, text shadows, and colors
    const initializePositions = () => {
      const charHeight = getCharHeight();
      gsap.set(topChars, { 
        y: 0,
        color: baseColorFormatted
      });
      gsap.set(bottomChars, { 
        y: charHeight,
        color: baseColorFormatted
      });
    };

    // Initialize positions
    initializePositions();

    // Watch for size changes (e.g., when font size changes via className)
    const resizeObserver = new ResizeObserver(() => {
      // Recalculate positions when size changes
      initializePositions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const handleMouseEnter = () => {
      // Recalculate height in case font size changed
      const charHeight = getCharHeight();
      
      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Create new timeline for hover animation
      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Animate top row up with text shadow and color change
      tl.to(topChars, {
        y: -charHeight,
        color: activeColorFormatted,
        duration: 0.3,
        ease: "power2.out",
        stagger: {
          amount: staggerDelay,
          from: "start"
        }
      }, 0);

      // Animate bottom row up to replace top row with text shadow and color change
      tl.to(bottomChars, {
        y: 0,
        color: activeColorFormatted,
        duration: 0.3,
        ease: "power2.out",
        stagger: {
          amount: staggerDelay,
          from: "start"
        }
      }, 0);
    };

    const handleMouseLeave = () => {
      // Recalculate height in case font size changed
      const charHeight = getCharHeight();
      
      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Create new timeline for reverse animation
      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Reverse: top row comes back down with color change
      tl.to(topChars, {
        y: 0,
        color: baseColorFormatted,
        duration: 0.3,
        ease: "power2.out",
        stagger: {
          amount: staggerDelay,
          from: "end"
        }
      }, 0);

      // Reverse: bottom row goes back down with color change
      tl.to(bottomChars, {
        y: charHeight,
        // textShadow: "0px 0px 0px rgba(0,0,0,0)",
        color: baseColorFormatted,
        duration: 0.3,
        ease: "power2.out",
        stagger: {
          amount: staggerDelay,
          from: "end"
        }
      }, 0);
    };

      const container = containerRef.current;
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      // Set up cleanup function
      cleanupRef.current = () => {
        if (container) {
          container.removeEventListener("mouseenter", handleMouseEnter);
          container.removeEventListener("mouseleave", handleMouseLeave);
        }
        
        // Disconnect resize observer
        resizeObserver.disconnect();
        
        // Cleanup timelines
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
        
        // Cleanup SplitText
        if (splitTopRef.current) {
          try {
            splitTopRef.current.revert();
          } catch {
            // Ignore errors
          }
        }
        if (splitBottomRef.current) {
          try {
            splitBottomRef.current.revert();
          } catch {
            // Ignore errors
          }
        }
      };
    })();

    // Return cleanup function from useEffect
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [text, baseColor, activeColor, delay]);

  // Split text into characters for rendering
  const chars = text.split("");

  if (!text) {
    // Fallback: render children as-is if we can't extract text
    return <a href={href} className={className}>{children}</a>;
  }

  // Format base color for initial styling
  const formatColorForStyle = (color?: string) => {
    if (!color) return "#000000";
    return color.startsWith("#") ? color : `#${color}`;
  };

  return (
    <a 
      ref={containerRef}
      href={href} 
      className={`relative inline-block overflow-hidden ${className || ""}`}
      style={{ 
        lineHeight: "1em",
        color: formatColorForStyle(baseColor)
      }}
    >
      <span 
        ref={topRowRef}
        className="inline-block"
        style={{ display: "inline-block", whiteSpace: "nowrap" }}
      >
        {chars.map((char, index) => (
          <span 
            key={`top-${index}`}
            className="char animated-link-char inline-block"
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span 
        ref={bottomRowRef}
        className="inline-block absolute top-0 left-0"
        style={{ display: "inline-block", whiteSpace: "nowrap" }}
      >
        {chars.map((char, index) => (
          <span 
            key={`bottom-${index}`}
            className="char animated-link-char inline-block"
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </a>
  );
};

export default AnimatedLink;
