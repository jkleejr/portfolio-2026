"use client";

// ---------------------------------------------------------------------------
// Ribbons trailing the cursor across the whole page.
//
// The overlay is click-through and sits under the corner buttons (z-10/z-20)
// and the case study panel (z-50), so it draws over the gallery without
// getting in front of anything you need to press.
// ---------------------------------------------------------------------------

import Ribbons from "./ribbons";

// Module scope, not inline: the array is one of the component's effect
// dependencies, so a fresh one every render would rebuild the renderer.
const COLORS = ["#ff1a1a"];

export function CursorRibbons() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5]" aria-hidden>
      <Ribbons
        colors={COLORS}
        baseThickness={30}
        speedMultiplier={0.5}
        maxAge={500}
        enableFade={false}
        enableShaderEffect
      />
    </div>
  );
}
