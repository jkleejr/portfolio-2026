"use client";

// ---------------------------------------------------------------------------
// The page's pointer: the arrow, drawn rather than the system's.
//
// Mounted once in the layout, so it holds for every route. It only exists
// where there is a pointer to replace — a touch screen keeps its own
// behaviour and pays nothing for this, since the effect never mounts.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { Cursor } from "@/components/core/cursor";

// Scale and fade in on arrival rather than appearing whole, and reverse it on
// the way out. Module scope so the objects are the same ones every render.
const VARIANTS = {
  initial: { scale: 0.3, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.3, opacity: 0 },
};

const TRANSITION = { ease: "easeInOut", duration: 0.15 } as const;

// Above everything the page draws, including the case study panel (z-50).
// Inline rather than a class: a z-index utility and the component's own z-50
// have the same weight, and which of them wins would come down to the order
// Tailwind happened to emit them in.
const LAYER = { zIndex: 100 };

function MouseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={26}
      height={31}
      fill="none"
      {...props}
    >
      <g clipPath="url(#site-cursor-clip)">
        <path
          fill="#22c55e"
          fillRule="evenodd"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth={2}
          d="M21.993 14.425 2.549 2.935l4.444 23.108 4.653-10.002z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="site-cursor-clip">
          <path fill="#22c55e" d="M0 0h26v31H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function SiteCursor() {
  // A mouse, a trackpad, a stylus — anything that hovers. Rendering nothing on
  // the server and deciding on the client also keeps the markup the two agree
  // on identical, so there is no hydration mismatch to suppress.
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const apply = () => setHasPointer(fine.matches);

    apply();
    fine.addEventListener("change", apply);
    return () => fine.removeEventListener("change", apply);
  }, []);

  // Cursor hides the native pointer on <body>, but a `cursor: pointer` on a
  // link inside it wins over that. The flag lets one rule in globals.css hide
  // it for the subtree too, and only while this is mounted.
  useEffect(() => {
    if (!hasPointer) return;

    document.documentElement.dataset.cursor = "custom";
    return () => {
      delete document.documentElement.dataset.cursor;
    };
  }, [hasPointer]);

  if (!hasPointer) return null;

  return (
    <Cursor variants={VARIANTS} transition={TRANSITION} style={LAYER}>
      <MouseIcon className="h-6 w-6" />
    </Cursor>
  );
}
