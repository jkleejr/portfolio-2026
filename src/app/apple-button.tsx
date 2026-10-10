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

import type { RefObject } from "react";
import { usePress } from "./press";

/**
 * `fixed` holds it at the size it has with the page at full width, at every
 * window width — the About page, where it does not scale. Otherwise it
 * scales with the page from sm up.
 *
 * The switch itself is held by SiteCorner, which also gives the way back —
 * see UndoButton — so this is handed the state rather than owning it.
 * `button` goes to the simulation so it can drop this button on the press,
 * rather than leaving it hanging under the cursor that just pressed it.
 */
export function AppleButton({
  fixed = false,
  button,
  on,
  toggle,
}: {
  fixed?: boolean;
  button: RefObject<HTMLButtonElement | null>;
  on: boolean;
  toggle: () => void;
}) {
  // Once gravity is on the apple can be picked up and thrown, and the throw
  // ends with the pointer released over the apple it was carrying — which the
  // browser reports as a click, switching off the very thing being played
  // with. Only a press that stays put is the switch.
  const { onPointerDown, dragged } = usePress();

  return (
    <button
      ref={button}
      type="button"
      onPointerDown={onPointerDown}
      onClick={(e) => {
        if (!dragged(e)) toggle();
      }}
      aria-pressed={on}
      aria-label="Turn gravity on and off"
      // Falls as the fruit, not the button round it — see inkInset.
      data-gravity-body="ink"
      className={`apple-button flex shrink-0 items-center justify-center text-foreground ${
        fixed ? "size-[calc(44*var(--u-full))]" : "h-11 w-11 sm:size-[calc(44*var(--u))]"
      }`}
    >
      <svg
        width="26"
        height="26"
        // Scales with the page from sm up, unless fixed — see --u and
        // --u-full in globals.css.
        className={fixed ? "size-[calc(26*var(--u-full))]" : "sm:size-[calc(26*var(--u))]"}
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
