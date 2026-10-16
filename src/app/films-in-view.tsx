"use client";

// ---------------------------------------------------------------------------
// Every film on the site plays only while some of it is in the window.
//
// The covers and the recordings in a study autoplay and loop, and left to
// themselves they go on doing so out of sight — a study scrolled past, or the
// covers run off the side of the strip — decoding frames nobody sees. Here
// each one is watched, and paused once the last of it leaves the window and
// played again as it comes back, from where it was. Clipping counts: a cover
// cut off by the strip's edge is out of the window as far as this goes. A
// film that starts out of sight — autoplay arriving after the page has been
// scrolled — is stopped as it starts.
//
// Only the pauses made here are undone here: a film the reader paused, with
// its own controls, stays paused when it comes back into view. Films put on
// the page later — a study opening — are picked up as they arrive.
// ---------------------------------------------------------------------------

import { useEffect } from "react";

export function FilmsInView() {
  useEffect(() => {
    // Whether each film is in the window, and the ones this paused for not
    // being — the only ones it starts again.
    const inView = new WeakMap<HTMLVideoElement, boolean>();
    const parked = new WeakSet<HTMLVideoElement>();
    const watched = new WeakSet<HTMLVideoElement>();

    const park = (v: HTMLVideoElement) => {
      parked.add(v);
      v.pause();
    };

    const seen = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        const v = target as HTMLVideoElement;
        inView.set(v, isIntersecting);
        if (isIntersecting) {
          if (parked.has(v)) {
            parked.delete(v);
            v.play().catch(() => {});
          }
        } else if (!v.paused) {
          park(v);
        }
      }
    });

    const onPlay = (e: Event) => {
      const v = e.target as HTMLVideoElement;
      if (inView.get(v) === false) park(v);
      else parked.delete(v);
    };

    const watch = (root: Element | Document) => {
      const films = root instanceof HTMLVideoElement ? [root] : root.querySelectorAll("video");
      for (const v of films) {
        if (watched.has(v)) continue;
        watched.add(v);
        v.addEventListener("play", onPlay);
        seen.observe(v);
      }
    };
    watch(document);
    const added = new MutationObserver((records) => {
      for (const r of records)
        for (const node of r.addedNodes) if (node instanceof Element) watch(node);
    });
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      added.disconnect();
      seen.disconnect();
      for (const v of document.querySelectorAll("video")) v.removeEventListener("play", onPlay);
    };
  }, []);
  return null;
}
