import { useRef, useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";

const Navbar = () => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<number | null>(null);

  // Use Lenis scroll callback
  useLenis(({ scroll, direction }: { scroll: number; direction: number }) => {
    if (!navbarRef.current) return;

    const currentScrollY = scroll;
    const scrollDirection = direction > 0 ? "down" : "up";

    // Clear existing timeout
    if (scrollTimeout.current !== null) {
      window.clearTimeout(scrollTimeout.current);
    }

    // Only animate if we're not already animating
    if (!isScrolling.current) {
      isScrolling.current = true;

      if (scrollDirection === "down" && currentScrollY > 50) {
        // Scroll down: slide out to top
        gsap.to(navbarRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            isScrolling.current = false;
          },
        });
      } else if (scrollDirection === "up") {
        // Scroll up: slide back in
        gsap.to(navbarRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            isScrolling.current = false;
          },
        });
      } else {
        isScrolling.current = false;
      }
    }

    lastScrollY.current = currentScrollY;

    // Reset timeout to handle scroll end
    scrollTimeout.current = window.setTimeout(() => {
      isScrolling.current = false;
    }, 150);
  });

  useEffect(() => {
    if (!navbarRef.current) return;

    // Set initial state
    gsap.set(navbarRef.current, {
      y: 0,
      opacity: 1,
    });

    return () => {
      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <div
      ref={navbarRef}
      className="w-full py-8 flex items-center justify-center fixed top-0 left-0 right-0 z-50 bg-background gap-4"
    >
      <a href="/" className="text-5xl font-bold font-display z-10">Labs</a>
    </div>
  );
};

export default Navbar;
