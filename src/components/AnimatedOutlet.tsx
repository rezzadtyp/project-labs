import { gsap } from "gsap";
import { useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { Transition, TransitionGroup } from "react-transition-group";

const completeCall = (target: HTMLElement, parent: HTMLElement | null) => {
  gsap.set(target, { clearProps: "position, width" });
  if (parent) {
    gsap.set(parent, { clearProps: "overflow" });
  }
};

const AnimatedOutlet = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const parentNode = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const onEnterHandler = () => {
    const node = nodeRef.current;
    if (!node) return;

    gsap.killTweensOf(node);
    // Set initial position and styles
    gsap.set(node, {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      x: 100,
      autoAlpha: 0,
    });
    gsap.set(parentNode.current, { overflow: "hidden" });
    // Create the animation for the incoming component
    gsap.to(node, {
      duration: 0.4,
      autoAlpha: 1,
      x: 0,
      onComplete: completeCall,
      onCompleteParams: [node, parentNode.current],
    });
  };

  const onExitHandler = () => {
    const node = nodeRef.current;
    if (!node) return;

    gsap.killTweensOf(node);
    // Set initial position and styles
    gsap.set(node, {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
    });
    // Create the animation for the outgoing component
    gsap.to(node, {
      duration: 0.4,
      autoAlpha: 0,
      x: -100,
    });
  };

  return (
    <div className="relative w-full h-full" ref={parentNode}>
      <TransitionGroup component={null}>
        <Transition
          timeout={500}
          key={location.pathname}
          nodeRef={nodeRef}
          onEnter={onEnterHandler}
          onExit={onExitHandler}
        >
          <div ref={nodeRef} className="w-full h-full">
            {outlet}
          </div>
        </Transition>
      </TransitionGroup>
    </div>
  );
};

export default AnimatedOutlet;
