"use client";

// ---------------------------------------------------------------------------
// Photo gallery — the last button in the top-right stack, and what it turns on.
//
// The button is a switch, not a door: it leaves you on the homepage and starts
// a trail of photos following the pointer across it (ImageTrail, from React
// Bits). Pressing it again turns the trail off, as does Escape.
//
// The overlay is click-through, and sits above everything the homepage draws —
// the covers, the corner buttons, the name and role — so the photos pass over
// all of it while every one of those stays clickable underneath. It stays
// below the case study panel (z-50), which is a modal and should cover the
// page.
//
// Split three ways because the switch has a second job: only one thing trails
// the cursor at a time, so turning the photos on puts the ribbons away and
// turning them off brings the ribbons back. The provider owns that one piece
// of state, the button flips it, and CursorRibbons reads it — see
// usePhotoGallery.
// ---------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { photos } from "@/data/photos";
import { SLOT_INDEX, slotTop } from "./corner-stack";
import ImageTrail from "./image-trail";

const EXIT_MS = 200; // must match .pg-closing animation duration in globals.css

type Gallery = {
  /** True from the press that starts the trail to the press that ends it. */
  active: boolean;
  toggle: () => void;
};

const PhotoGalleryContext = createContext<Gallery>({
  active: false,
  toggle: () => {},
});

/** What the switch is currently set to. Read by the button and the ribbons. */
export function usePhotoGallery(): Gallery {
  return useContext(PhotoGalleryContext);
}

/** Two photo frames, the front one holding a sun over hills. */
function GalleryIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* the frame behind, tilted, showing along the top and right edges */}
      <path d="M7.4 4.7 19.5 3.2 20.9 14.9" />
      {/* the frame in front */}
      <rect x="3.1" y="6.5" width="14.3" height="14.3" rx="2.3" />
      {/* the sun, and the hills below it */}
      <circle cx="13.3" cy="10.9" r="1.5" fill="currentColor" stroke="none" />
      <path d="M4.4 17.8 8.3 13.5l3 3.3 1.9-2 3.1 3.4" />
    </svg>
  );
}

export function PhotoGalleryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [on, setOn] = useState(false);
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const off = useCallback(() => setClosing(true), []);

  const toggle = useCallback(() => {
    if (on) {
      off();
      return;
    }
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setClosing(false);
    setOn(true);
  }, [on, off]);

  // Unmount only once the fade-out has played, so the photos on screen when
  // you switch it off go with it rather than vanishing mid-flight.
  useEffect(() => {
    if (!closing) return;
    exitTimer.current = setTimeout(() => {
      setOn(false);
      setClosing(false);
    }, EXIT_MS);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [closing]);

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") off();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on, off]);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

  return (
    <PhotoGalleryContext.Provider value={{ active: on && !closing, toggle }}>
      {children}
      {on && (
        <div
          className={`pointer-events-none fixed inset-0 z-40 ${closing ? "pg-closing" : ""}`}
          aria-hidden
        >
          <div className="pg-surface h-full w-full">
            <ImageTrail items={photos} variant={2} />
          </div>
        </div>
      )}
    </PhotoGalleryContext.Provider>
  );
}

export function PhotoGalleryButton() {
  const { active, toggle } = usePhotoGallery();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Photo gallery"
      aria-pressed={active}
      style={{ top: slotTop(SLOT_INDEX.photoGallery) }}
      // While it is on, the button fills in — the trail is the other half of
      // the feedback, but it only shows once you actually move.
      className="design-one-only absolute right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition duration-200 ease-out hover:scale-110 hover:opacity-80 aria-pressed:bg-foreground aria-pressed:text-background"
    >
      <GalleryIcon />
    </button>
  );
}
