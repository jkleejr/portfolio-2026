"use client";

// ---------------------------------------------------------------------------
// The apple, at the foot of the top-right stack.
//
// It turns gravity on and off. Newton's apple: press it and the weight of the
// page arrives — see gravity.tsx.
//
// Monochrome at rest like the rest of the stack, and it ripens under the
// pointer — see .apple-button in globals.css. It stays ripe for as long as
// gravity is running, which is what says the switch is on. The three parts are
// separate paths so each can take its own colour there; at rest they all draw
// in currentColor and read as one silhouette.
// ---------------------------------------------------------------------------

import { useRef } from "react";
import { useGravity } from "./gravity";

export function AppleButton() {
  // Handed to the simulation so it can drop this button on the press, rather
  // than leaving it hanging under the cursor that just pressed it.
  const button = useRef<HTMLButtonElement>(null);
  const { on, toggle } = useGravity(button);

  return (
    <button
      ref={button}
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label="Turn gravity on and off"
      className="apple-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        {/* Leaf and stem first, so the body covers where they run under it —
            the same overlap the reference has. */}
        <path
          className="apple-leaf"
          d="M7 2.9c3.86.42 5.78 2.57 5.75 6.45C8.89 8.93 6.98 6.78 7 2.9Z"
        />
        <path
          className="apple-stem"
          d="M12.5 9.2c.42-2.2 1.26-3.78 2.7-4.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        {/* Two shoulders with a dip between them, and the notch underneath. */}
        <path
          className="apple-body"
          d="M11.9 9.15c-1.05-1.2-2.7-1.8-4.2-1.5-2.5.5-4.1 3-4.1 6.4 0 3.4 2 6.55 4.3 7.25 1.3.4 2.65-.3 4-.3s2.7.7 4 .3c2.3-.7 4.3-3.85 4.3-7.25 0-3.4-1.6-5.9-4.1-6.4-1.5-.3-3.15.3-4.2 1.5Z"
        />
      </svg>
    </button>
  );
}
