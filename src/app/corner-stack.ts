// ---------------------------------------------------------------------------
// The geometry of the button stack in the top-right corner.
//
// Every button is 2.5rem tall with 0.5rem under it, so each slot starts 3rem
// below the one above. Down the stack: the design toggle, the theme toggle,
// one slot per site link, then the buttons that act on this page rather than
// linking away — the photo gallery, then the globe.
//
// It lives here because the stack's height is not only the stack's business.
// On a phone the gallery below runs the full width instead of sitting in the
// column beside it, so it has to start under the last button — and a stack
// that grew while that clearance stayed a hardcoded number would put the two
// on top of each other. Both now come from the same count.
// ---------------------------------------------------------------------------

import { site } from "@/data/site";

const FIRST_TOP = 1.5; // rem, top of the design toggle
const SLOT = 3; // rem, a button plus the gap under it
const BUTTON = 2.5; // rem

/** Slots above the site links: the design toggle and the theme toggle. */
const BEFORE_LINKS = 2;
/** Slots below them: the photo gallery, and the globe. */
const AFTER_LINKS = 2;

const SLOTS = BEFORE_LINKS + site.buttons.length + AFTER_LINKS;

/** Where slot `i` starts, counting from the design toggle at 0. */
export function slotTop(i: number): string {
  return `calc(${FIRST_TOP}rem + ${i} * ${SLOT}rem)`;
}

/** The slot each button sits in, named so nothing has to count by hand. */
export const SLOT_INDEX = {
  designToggle: 0,
  themeToggle: 1,
  /** The site links run from here, one slot each. */
  links: BEFORE_LINKS,
  photoGallery: BEFORE_LINKS + site.buttons.length,
  globe: BEFORE_LINKS + site.buttons.length + 1,
};

/** How far down the page the stack reaches — what anything below must clear. */
export const stackBottom = `calc(${FIRST_TOP}rem + ${SLOTS - 1} * ${SLOT}rem + ${BUTTON}rem)`;
