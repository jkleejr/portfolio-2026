"use client";

// ---------------------------------------------------------------------------
// Photo gallery — the last button in the top-right stack, and what it opens.
//
// The button toggles a full-page surface where moving the pointer drags a
// trail of photos across it (ImageTrail, from React Bits). There is nothing to
// click inside: the gallery IS the movement, so the whole surface is left
// clear and the only controls are the close button, Escape, and pressing the
// gallery button again.
//
// It sits above the cursor ribbons (z-30) so the ribbons do not draw over the
// photos, and below the case study panel (z-50), which is a modal proper.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { photos } from "@/data/photos";
import ImageTrail from "./image-trail";

const EXIT_MS = 200; // must match .pg-closing animation duration in globals.css

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

export function PhotoGallery() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setClosing(true), []);

  const toggle = useCallback(() => {
    if (open) {
      close();
      return;
    }
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setClosing(false);
    setOpen(true);
  }, [open, close]);

  // Unmount only once the exit animation has played out, and hand focus back
  // to the button that opened it.
  useEffect(() => {
    if (!closing) return;
    exitTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
      buttonRef.current?.focus();
    }, EXIT_MS);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [closing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Freeze the page underneath, padding out the width the scrollbar gives up
  // so nothing jumps. Same approach as the case study overlay.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [open]);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="Photo gallery"
        aria-expanded={open}
        // Carries on down the corner stack from the site links above it, at
        // the same 3rem pitch (a 2.5rem button plus the 0.5rem gap), so
        // adding another link up there pushes this one down with it.
        style={{ top: `calc(7.5rem + ${site.buttons.length} * 3rem)` }}
        className="design-one-only absolute right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition duration-200 ease-out hover:scale-110 hover:opacity-80"
      >
        <GalleryIcon />
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-40 ${closing ? "pg-closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <div className="pg-surface absolute inset-0 bg-background">
            <ImageTrail items={photos} variant={2} />
          </div>

          {/* Above the trail, and click-through, so the pointer never loses
              the surface while crossing the words. */}
          <p className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center text-sm text-muted">
            Move your cursor
          </p>

          <button
            type="button"
            onClick={close}
            aria-label="Close photo gallery"
            className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition duration-200 ease-out hover:scale-110 hover:opacity-80"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
