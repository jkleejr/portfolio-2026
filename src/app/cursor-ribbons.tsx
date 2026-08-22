"use client";

// ---------------------------------------------------------------------------
// Ribbons trailing the cursor across the whole page.
//
// The overlay is click-through, so it draws over the corner buttons
// (z-10/z-20) without swallowing a press on them. It stays under the case
// study panel (z-50), which is a modal and should cover the page.
// ---------------------------------------------------------------------------

import Ribbons from "./ribbons";

// Module scope, not inline: both arrays are effect dependencies inside
// Ribbons, so a fresh one on any render would tear the renderer down and
// build it again. backgroundColor has to be passed for that reason — leaving
// it out means the component's own `= [0, 0, 0, 0]` default builds a new
// array every render, which is exactly the case this guards against.
const COLORS = ["#ff1a1a"];
const BACKGROUND: [number, number, number, number] = [0, 0, 0, 0];

export function CursorRibbons() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-hidden>
      <Ribbons
        colors={COLORS}
        baseThickness={30}
        speedMultiplier={0.5}
        maxAge={500}
        enableFade={false}
        enableShaderEffect
        backgroundColor={BACKGROUND}
      />
    </div>
  );
}
