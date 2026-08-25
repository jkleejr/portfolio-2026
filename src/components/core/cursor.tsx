"use client";

// ---------------------------------------------------------------------------
// Cursor — a custom pointer, drawn as whatever you put inside it.
//
// Vendored from motion-primitives, so code written against that component
// works here unchanged. Two modes:
//
//   attachToParent   the cursor belongs to the element this is rendered in.
//                    It appears when the pointer enters that element and goes
//                    when it leaves, and only that element loses its native
//                    pointer.
//   (default)        the cursor belongs to the page. It is mounted for as
//                    long as the component is, and <body> loses its native
//                    pointer.
//
// The position is a spring rather than the raw pointer, which is what gives
// the trailing weight — the drawing chases the mouse instead of being nailed
// to it. Nothing here reads a layout, so the springs cost a transform a frame
// and no reflow.
// ---------------------------------------------------------------------------

import {
  AnimatePresence,
  motion,
  type SpringOptions,
  type Transition,
  type Variant,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

type CursorProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Stiffness/damping of the chase. Defaults to a light, quick follow. */
  springConfig?: SpringOptions;
  /** Confine the cursor to the element this is rendered inside. */
  attachToParent?: boolean;
  transition?: Transition;
  variants?: {
    initial?: Variant;
    animate?: Variant;
    exit?: Variant;
  };
  onPositionChange?: (x: number, y: number) => void;
};

const DEFAULT_SPRING: SpringOptions = { damping: 20, stiffness: 300, mass: 0.5 };

export function Cursor({
  children,
  className,
  style,
  springConfig,
  attachToParent,
  variants,
  transition,
  onPositionChange,
}: CursorProps) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Page-wide, the cursor still waits for the first move: on a touch screen
  // there is no pointer to follow, and drawing one at 0,0 in the corner is
  // worse than drawing none at all.
  const [isVisible, setIsVisible] = useState(false);

  const cursorXSpring = useSpring(cursorX, springConfig ?? DEFAULT_SPRING);
  const cursorYSpring = useSpring(cursorY, springConfig ?? DEFAULT_SPRING);

  useEffect(() => {
    const updatePosition = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      onPositionChange?.(event.clientX, event.clientY);
    };

    document.addEventListener("mousemove", updatePosition);
    return () => document.removeEventListener("mousemove", updatePosition);
  }, [cursorX, cursorY, onPositionChange]);

  useEffect(() => {
    if (attachToParent) return;

    document.body.style.cursor = "none";

    // The first move is also the jump: put the springs where the pointer is
    // before showing anything, or the cursor flies in from the corner.
    const reveal = (event: MouseEvent) => {
      cursorXSpring.jump(event.clientX);
      cursorYSpring.jump(event.clientY);
      setIsVisible(true);
      document.removeEventListener("mousemove", reveal);
    };
    // Leaving the window — into the tab strip, onto another screen — takes
    // the drawing with it, and coming back brings it straight to where the
    // pointer re-entered rather than sliding over from where it left.
    const hide = () => setIsVisible(false);
    const show = (event: MouseEvent) => {
      cursorXSpring.jump(event.clientX);
      cursorYSpring.jump(event.clientY);
      setIsVisible(true);
    };

    document.addEventListener("mousemove", reveal);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", reveal);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, [attachToParent, cursorXSpring, cursorYSpring]);

  useEffect(() => {
    const parent = cursorRef.current?.parentElement;
    if (!attachToParent || !parent) return;

    const handleEnter = () => {
      parent.style.cursor = "none";
      setIsVisible(true);
    };
    const handleLeave = () => {
      parent.style.cursor = "";
      setIsVisible(false);
    };

    parent.addEventListener("mouseenter", handleEnter);
    parent.addEventListener("mouseleave", handleLeave);
    return () => {
      parent.style.cursor = "";
      parent.removeEventListener("mouseenter", handleEnter);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, [attachToParent]);

  return (
    <motion.div
      ref={cursorRef}
      // No centring transform: the drawing's top-left corner is the hotspot,
      // which is what an arrow wants — its tip a pixel or two in. Anything
      // that would rather be centred says so with a margin of its own.
      className={`pointer-events-none fixed left-0 top-0 z-50 ${className ?? ""}`}
      style={{ x: cursorXSpring, y: cursorYSpring, ...style }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
