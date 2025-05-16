import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ContextCursor.css';

// Property names for data attributes
const propNames = {
  dataAttr: "data-ccursor",
  noPadding: "noPadding",
  noParallax: "noParallax",
  lift: "lift",
};

// Utility function to calculate movement for parallax effect
const getMoveIndex = (
  mouseEventDirection,
  elPosition,
  elDimension,
  movementSpeed
) => {
  let relativePos = mouseEventDirection - elPosition;
  return (relativePos - elDimension / 2) / movementSpeed;
};

// Utility function to check if element has a specific property
const isElHasProperty = (el, property) => {
  if (el.getAttribute(propNames.dataAttr)?.includes(property)) {
    return true;
  } else {
    return false;
  }
};

const ContextCursor = ({
  radius = 12,
  transitionSpeed = 0.5,
  parallaxIndex = 15,
  hoverPadding = 6
}) => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Create cursor element
    const cursor = cursorRef.current;

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.documentElement.classList.add('custom-cursor-enabled');

    // Set up parallax speed
    const parallaxSpeed = {
      cursor: parallaxIndex,
      target: parallaxIndex * 1.5,
    };

    // State variables
    let isHovered = false;
    let cursorTarget = null;

    // Move cursor function
    const moveCursor = (e) => {
      // If element is not hovered
      if (!isHovered) {
        gsap.to(cursor, {
          duration: transitionSpeed,
          x: e.clientX - radius / 2,
          y: e.clientY - radius / 2,
          ease: "expo.out"
        });
      } else {
        const borderRadius = Number(
          window.getComputedStyle(cursorTarget).borderRadius.slice(0, -2) || 0
        );

        // For "LIFT" mode
        if (isElHasProperty(cursorTarget, propNames.lift)) {
          gsap.to(cursorTarget, {
            duration: transitionSpeed,
            x: getMoveIndex(
              e.clientX,
              cursorTarget.getBoundingClientRect().left,
              cursorTarget.clientWidth,
              parallaxSpeed.target
            ),
            y: getMoveIndex(
              e.clientY,
              cursorTarget.getBoundingClientRect().top,
              cursorTarget.clientHeight,
              parallaxSpeed.target
            ),
            scale: 1.05,
            boxShadow: "0 7px 15px rgba(200, 200, 200, 0.3)",
            ease: "expo.out"
          });

          gsap.to(cursor, {
            duration: transitionSpeed,
            filter: "blur(4px)",
            x:
              cursorTarget.getBoundingClientRect().left +
              (e.clientX -
                cursorTarget.getBoundingClientRect().left -
                cursorTarget.clientWidth / 2) /
                parallaxSpeed.cursor,
            y:
              cursorTarget.getBoundingClientRect().top +
              (e.clientY -
                cursorTarget.getBoundingClientRect().top -
                cursorTarget.clientHeight / 2) /
                parallaxSpeed.cursor,
            backgroundImage: `radial-gradient(circle at ${
              e.clientX - cursorTarget.getBoundingClientRect().left
            }px ${
              e.clientY - cursorTarget.getBoundingClientRect().top
            }px, rgba(220,220,220,0.4), rgba(220,220,220,0))`,
            ease: "expo.out"
          });
        } else {
          // For default "PARALLAX" mode
          gsap.to(cursor, {
            duration: transitionSpeed,
            x:
              cursorTarget.getBoundingClientRect().left -
              (isElHasProperty(cursorTarget, propNames.noPadding)
                ? 0
                : hoverPadding) +
              (isElHasProperty(cursorTarget, propNames.noParallax)
                ? 0
                : (e.clientX -
                    cursorTarget.getBoundingClientRect().left -
                    cursorTarget.clientWidth / 2) /
                  parallaxSpeed.cursor),
            y:
              cursorTarget.getBoundingClientRect().top -
              (isElHasProperty(cursorTarget, propNames.noPadding)
                ? 0
                : hoverPadding) +
              (isElHasProperty(cursorTarget, propNames.noParallax)
                ? 0
                : (e.clientY -
                    cursorTarget.getBoundingClientRect().top -
                    cursorTarget.clientHeight / 2) /
                  parallaxSpeed.cursor),
            borderRadius: Math.max(12, borderRadius * (isElHasProperty(cursorTarget, propNames.noPadding) ? 1 : 1.2)),
            width:
              cursorTarget.clientWidth +
              (isElHasProperty(cursorTarget, propNames.noPadding)
                ? 0
                : hoverPadding * 2),
            height:
              cursorTarget.clientHeight +
              (isElHasProperty(cursorTarget, propNames.noPadding)
                ? 0
                : hoverPadding * 2),
            ease: "expo.out"
          });

          // For "NO PARALLAX" property
          if (!isElHasProperty(cursorTarget, propNames.noParallax)) {
            gsap.to(cursorTarget, {
              duration: transitionSpeed,
              x: -getMoveIndex(
                e.clientX,
                cursorTarget.getBoundingClientRect().left,
                cursorTarget.clientWidth,
                parallaxSpeed.target
              ),
              y: -getMoveIndex(
                e.clientY,
                cursorTarget.getBoundingClientRect().top,
                cursorTarget.clientHeight,
                parallaxSpeed.target
              ),
              ease: "power2.out"
            });
          }
        }
      }
    };

    // Handle mouse over interactive elements
    const handleMouseOver = (e) => {
      isHovered = true;
      cursorTarget = e.target;
      const borderRadius = Number(
        window.getComputedStyle(cursorTarget).borderRadius.slice(0, -2) || 0
      );

      if (isElHasProperty(cursorTarget, propNames.lift)) {
        cursor.classList.add("c-cursor-lift_active");
        gsap.to(cursor, {
          duration: transitionSpeed,
          borderRadius: borderRadius,
          width: cursorTarget.clientWidth,
          height: cursorTarget.clientHeight,
          scale: 1.1,
          ease: "power2.out"
        });
      } else {
        cursor.classList.add("c-cursor_active");
      }
    };

    // Handle mouse out from interactive elements
    const handleMouseOut = (e) => {
      isHovered = false;
      cursor.classList.remove("c-cursor_active");
      cursor.classList.remove("c-cursor-lift_active");

      gsap.to(cursor, {
        duration: transitionSpeed,
        x: e.clientX - radius / 2,
        y: e.clientY - radius / 2,
        width: radius,
        height: radius,
        borderRadius: "100px",
        scale: 1,
        backgroundImage: "none",
        filter: "blur(0px)",
        ease: "power2.out"
      });

      if (cursorTarget) {
        gsap.to(cursorTarget, {
          duration: transitionSpeed,
          x: 0,
          y: 0,
          scale: 1,
          boxShadow: "0 7px 15px rgba(0,0,0,0.0)",
          ease: "power2.out"
        });
      }
    };

    // Handle scroll events
    const handleScroll = () => {
      if (isHovered && cursorTarget) {
        isHovered = false;
        cursor.classList.remove("c-cursor_active");
        cursor.classList.remove("c-cursor-lift_active");

        gsap.to(cursor, {
          duration: transitionSpeed,
          width: radius,
          height: radius,
          borderRadius: "100px",
          scale: 1,
          backgroundImage: "none",
          filter: "blur(0px)",
          ease: "power2.out"
        });

        gsap.to(cursorTarget, {
          duration: transitionSpeed,
          x: 0,
          y: 0,
          scale: 1,
          boxShadow: "0 7px 15px rgba(0,0,0,0.0)",
          ease: "power2.out"
        });
      }
    };

    // Find all interactive elements
    const interactElements = document.querySelectorAll(
      `[${propNames.dataAttr}]`
    );

    // Add event listeners
    document.addEventListener("wheel", handleScroll);
    document.addEventListener("mousemove", moveCursor);

    // Add event listeners to interactive elements
    const addEventListeners = () => {
      const elements = document.querySelectorAll(`[${propNames.dataAttr}]`);
      elements.forEach((item) => {
        item.addEventListener("mouseenter", handleMouseOver);
        item.addEventListener("mouseleave", handleMouseOut);
      });
    };

    // Initial setup
    addEventListeners();

    // Add event listeners when DOM changes (for dynamically added elements)
    const observer = new MutationObserver(() => {
      addEventListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup function
    return () => {
      document.body.style.cursor = 'auto';
      document.documentElement.classList.remove('custom-cursor-enabled');

      document.removeEventListener("wheel", handleScroll);
      document.removeEventListener("mousemove", moveCursor);

      interactElements.forEach((item) => {
        item.removeEventListener("mouseenter", handleMouseOver);
        item.removeEventListener("mouseleave", handleMouseOut);
      });

      observer.disconnect();
    };
  }, [radius, transitionSpeed, parallaxIndex, hoverPadding]);

  return (
    <div
      ref={cursorRef}
      className="c-cursor"
      style={{
        transform: `translate(-200px, -200px)`,
        height: `${radius}px`,
        width: `${radius}px`,
      }}
    />
  );
};

export default ContextCursor;
