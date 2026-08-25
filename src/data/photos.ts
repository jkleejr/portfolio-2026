// ---------------------------------------------------------------------------
// What the photo gallery trails behind the cursor.
//
// Order is the order they appear in: the trail works down the list and starts
// over, so a longer list goes further before it repeats. Add to it and nothing
// else needs to change.
//
// The frame is portrait (see --trail-ratio in globals.css) and a photo is
// drawn to cover it, so a landscape shot is cropped to a column of itself —
// the middle of it, unless the entry says otherwise. `position` is a CSS
// background-position: below 50% keeps a column left of centre, above it one
// to the right.
// ---------------------------------------------------------------------------

import type { TrailItem } from "@/app/image-trail";

export const photos: TrailItem[] = [
  "/photos/pic4.jpg",
  "/photos/pic2.jpg",
  "/photos/pic3.jpg",
  { src: "/photos/pic5.jpg", position: "32% 50%" },
  "/photos/pic6.jpg",
  { src: "/photos/pic7.jpg", position: "28% 50%" },
  "/photos/pic1.jpg",
  "/photos/pic8.jpg",
  "/photos/pic9.jpg",
  "/photos/pic10.jpg",
  "/photos/pic11.jpg",
];
