"use client";

// ---------------------------------------------------------------------------
// Ribbons trailing the cursor across the whole page.
//
// The overlay is click-through, so it draws over the corner buttons
// (z-10/z-20) without swallowing a press on them. It stays under the case
// study panel (z-50), which is a modal and should cover the page.
//
// On by default, and off for as long as the photo gallery is running: only one
// thing trails the cursor at a time. Returning null rather than hiding it in
// CSS matters — the renderer is a WebGL loop, and it should stop, not keep
// drawing a canvas nobody can see. Ribbons releases its context on teardown.
// ---------------------------------------------------------------------------

import Ribbons from "./ribbons";
import { usePhotoGallery } from "./photo-gallery";

// Module scope, not inline: both arrays are effect dependencies inside
// Ribbons, so a fresh one on any render would tear the renderer down and
// build it again. backgroundColor has to be passed for that reason — leaving
// it out means the component's own `= [0, 0, 0, 0]` default builds a new
// array every render, which is exactly the case this guards against.
const COLORS = ["#ff1a1a"];
const BACKGROUND: [number, number, number, number] = [0, 0, 0, 0];

export function CursorRibbons() {
  const { active: galleryOn } = usePhotoGallery();
  if (galleryOn) return null;

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
